# 미들웨어
>익스프레스의 핵심  
요청과 응답의 중간에 위치하여 미들웨어라고 부름  
라우터와 에러 핸들러 또한 미들웨어의 일종  
미들웨어는 요청과 응답을 조작하여 기능을 추가하기도, 나쁜 요청을 걸러내기도 함

```javascript
app.use(미들웨어)
```
# 자주 쓰이는 미들웨어 
* 미들웨어가 실행되는 경우  

|||
|---|---|
|app.use(미들웨어)|모든 요청에서 미들웨어 실행|
|app.use('/abc', 미들웨어)|abc로 시작하는 요청에서 미들웨어 실행|
|app.post('/abc', 미들웨어)| abc로 시작하는 POST 요청에서 미들웨어 실행|

## 1. morgan
>요청과 응답에 대한 정보를 콘솔에 기록하여 한눈에 볼 수 있어 편리
```javascript
const morgan = require('morgan');
app.use(morgan('dev'));         // 개발환경
app.use(morgan('combined'));    // 운영환경
app.use(morgan('common'));
app.use(morgan('short'));
app.use(morgan('tiny'));
```
> [HTTP메서드] [주소] [HTTP 상태 코드] [응답 속도]-[응답 바이트]  
(dev 기준)
```console
GET / 500 13.293 ms - 50
```

## 2. static
>정적인 파일들을 제공하는 라우터 역할  
기본적으로 제공되기에 따로 설치할 필요 없이 express 객체 안에서 꺼내 장착
```javascript
// app.use('요청경로', express.static('실제경로'));
app.use('/', express.static(path.join(__dirname, 'public')));
```
- 함수의 인수로 정적 파일들이 담겨있는 폴더를 지정  
public/stylesheets/style.css : http://localhost:3030/stylesheets/style.css 로 접근  
public 폴더를 만들고 css, js, 이미지 파일들을 넣으면 브라우저에서 접근 가능
- 실제 서버 경로에는 public 이 들어있지만, 요청주소에는 없기때문에 보안에 도움이 됨
- 정적파일들을 알아서 제공해주므로 fs.readFile 로 파일을 직접 읽어서 전송할 필요 없음  
경로에 해당하는 파일이 없으면 내부적으로 알아서 next 호출  
파일을 발견했다면 다음 미들웨어는 실행되지 않음 (응답으로 파일을 보내고 next 호출 X)

## 3. body-parser
>요청의 본문에 있는 데이터를 해석해서 req.body 객체로 만들어주는 미들웨어  
폼 데이터나 AJAX 요청의 데이터를 처리  
*단, multipart(이미지, 동영상, 파일) 데이터는 처리하지 못함* > multer 모듈 사용
```javascript
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// JSON: {name: 'griffin', book: 'nodejs'} 그대로 req.body 에 들어감
// URL-encoded: name=griffin&book=nodejs
//       {name: 'griffin', book: 'nodejs'} 가 req.body 에 들어감
```
- JSON: JSON 형식의 데이터 전달 방식
- URL-encoded: 주소 형식으로 데이터를 보내는 방식
    - {extended: false}: 노드의 querystring 모듈을 사용하여 쿼리스트링 해석
    - {extended: true}: qs 모듈을 사용하여 쿼리스트링 해석  
    *(qs: npm 패키지, querystring모듈의 기능을 좀 더 확장한 모듈)*
>4.16.0 버전부터 body-parser 미들웨어의 일부 기능이 익스프레스에 내장되었으므로 따로 설치 불필요  
단, 버퍼(Raw), 텍스트(Text) 요청을 처리할 필요가 있다면 body-parser 설치 필요
```console
$ npm i body-parser
``` 
```javascript
const bodyParser = require('body-parser');
app.use(bodyParser.raw());
app.use(bodyParser.text());
```

## 4. cookie-parser
>요청에 동봉된 쿠키를 해석해 req.cookies 객체로 만드는 미들웨어  
parseCookies 함수와 비슷한 기능
```javascript
app.use(cookieParser(비밀키));

// 쿠키
req.cookies

// 서명된 쿠키
req.signedCookies
```
> 해석된 쿠키들은 req.cookies 객체에 들어감  
ex) name=griffin 쿠키 보냄 > req.cookie = {name: 'griffin'}  
유효기간이 지난 쿠키는 알아서 걸러냄
* 쿠키생성/제거
```javascript
res.cookie('name', 'griffin', {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
    secure: true,
});

res.clearCookie('name', 'griffin', {httpOnly: true, secure: true});
```
> 쿠키를 지우려면, 키와 값 외에 옵션도 정확히 일치해야함  
*(단, expires나 maxAge 옵션은 일치할 필요 없음)*
* signed 옵션  
true 로 설정하면 쿠키 뒤에 서명이 붙음  
내 서버가 쿠키를 만들었다는 것을 검증할 수 있으므로 서명 옵션을 켜두는 것이 좋음  
서명을 위한 비밀 키는 cookieParser 미들웨어 변수로 사용한 **process.env.COOKIE_SECRET**

## 5. express-session
> 세션 관리용 미들웨어  
로그인 등 세션을 구현하거나 특정 사용자를 위한 데이터를 임시적으로 저장해둘 떄 매우 유용  
사용자별로 req.session 객체 안에 유지
```javascript
app.use(session({
    resave: false,  // 요청이 올 때 세션에 수정사항이 없더라도 다시 저장할지 여부
    saveUninitialized: false,   // 저장할 내역이 없어도 처음부터 세션을 생성할지 여부
    secret: process.env.COOKIE_SECRET, // 서명 추가
    cookie: {   // 세션 쿠키에 대한 설정
        httpOnly: true,     // 클라이언트에서 쿠키 확인 제한
        secure: false,      // https 가 아닌 환경에서도 사용가능
    },
    name: 'session-cookie',
}));

req.session.name = 'griffin';   // 세션 등록
req.sessionID;                  // 세션 아이디 확인
req.session.destroy();          // 세션 모두 제거
```
> v1.5 이전에는 내부적으로 cookie-parser 를 사용해서 cookie-parser 보다 뒤에 위치해야 했음  
v.1.5 이후로는 사용하지 않게되어 순서 상관없음 (버전을 모른다면 cookie-parser 뒤에 위치)
- 세션 관리 시 클라이언트에 쿠키를 보냄
- 안전한 쿠키 전송을 위해 서명을 추가 (secret 값 필요)  
- 세션 쿠키의 이름은 name 옵션으로 설정 (기본이름: connect.sid)
- express-session 에서 서명한 쿠키 앞에는 ***s: (s%3A)*** 가 붙음

## 6. multer
> 이미지, 동영상 등 여러 가지 파일들을 멀티파트 형식으로 업로드 할 때 사용하는 미들웨어  
*멀티파트: enctype 이 multipart/form-data 인 폼을 통해 업로드하는 데이터 형식*
```html
<form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="image" />
    <input type="test" name="title" />
    <button type="submit">Upload</button>
</form>
```
```console
$ npm i multer
```
```javascript
const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/'); // 업로드 폴더가 반드시 존재해야함
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            // 파일명 중복을 막기위해 현재시간 사용
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
```
- storage: 어디에(destination) 어떤 이름으로 (filename) 저장할지 설정
- done: 함수  
req, file 의 데이터를 가공해서 done 으로 넘기는 형식
- limit: 업로드에 대한 제한 사항 설정
- destination 폴더가 꼭 존재해야 함
```javascript
const fs = require('fs');

try {
    fs.readdirSync('uploads');
} catch(err) {
    console.error('uploads 가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
```
- 파일 하나 업로드하기
```javascript
// upload.single(input태그의 name or 폼 데이터의 키)
app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file, req.body);
    res.send('ok');
});
```
- req.file 객체
```json
{
  fieldname: 'image',
  originalname: '스크린샷 2020-01-21 오후 9.03.12.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'uploads/',
  filename: '스크린샷 2020-01-21 오후 9.03.121612790963656.png',
  path: 'uploads/스크린샷 2020-01-21 오후 9.03.121612790963656.png',
  size: 112491
}
```
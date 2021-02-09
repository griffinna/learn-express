# req, res 객체
> http 모듈의 req, res 객체를 확장한 것  
기존 http 모듈의 메서드와 익스프레스가 추가한 메서드/속성 사용 가능
- res.writeHead, res.write, res.end 사용가능
- res.send, res.sendFile 사용가능

# 자주 쓰이는 req 객체 속성
* **req.app**: req 객체를 통해 app 객체에 접근 가능
    ```javascript
    req.app.get('port');
    ```
* **req.body**: body-parser 미들웨어가 만드는 요청의 본문을 해석한 객체
* **req.cookies**: cookie-parser 미들웨어가 만드는 요청의 쿠키를 해석한 객체
* **req.ip**: 요청의 ip주소
* **req.params**: 라우트 매개변수에 대한 정보가 담긴 객체
* **req.query**: 쿼리스트링에 대한 정보가 담긴 객체
* **req.signedCookies**: 서명된 쿠키들은 req.session 대신 여기에 담김
* ### **req.get(헤더이름)**: 헤더의 값을 가져오고 싶을 때 사용하는 메서드

# 자주 쓰이는 res 객체 속성
* **res.app**: req.app 처럼 res 객체를 통해 app 객체에 접근 가능
* **res.cookie(키, 값, 옵션)**: 쿠키를 설정하는 메서드
* **res.clearCookie(키, 값, 옵션)**: 쿠키를 제거하는 메서드
* **res.end()**: 데이터 없이 응답을 보냄
* **res.json(JSON)**: JSON 형식의 응답을 보냄
* **res.redirect(주소)**: 리다이렉트할 주소와 함께 응답을 보냄
* **res.render(뷰, 데이터)**: 템플릿 엔진을 랜더링해서 응답을 보냄
* **res.send(데이터)**: 데이터(문자열, HTML, 버퍼, 객체, 배열)와 함께 응답을 보냄
* **res.sendFile(경로)**: 경로에 위치한 파일을 응답
* **res.set(헤더, 값)**: 응답의 헤더를 설정
* **res.status(코드)**: 응답 시의 HTTP 상태 코드를 지정

## req, res 객체는 메서드 체이닝을 지원하는 경우가 많음
```javascript
res
  .status(201)
  .cookie('test', 'test')
  .redirect('/admin');
```
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotnev = require('dotenv');       // .env 파일을 읽어서 process.env 로 만든다
const path = require('path');
const multer = require('multer');
const fs = require('fs');

try {
    fs.readdirSync('uploads');
} catch(err) {
    console.error('uploads 가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
dotnev.config();
// express 내부에 http 모듈이 내장되어 있어 서버의 역할을 할 수 있다.
const app = express();
// 서버가 실행 될 포트를 설정 (속성이 없다면 3000 포트를 사용)
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

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
app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.');
    // next: 다음 미들웨어로 넘어가는 함수, 실행하지않으면 다음 미들웨어가 실행되지 않는다.
    next();
})

app.get('/', (req, res, next) => {
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.');
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'multipart.html'));
});

app.get('/multi/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'multipart_multi.html'));
});

app.get('/multi/key/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'multipart_multi_key.html'));
});

app.get('/none/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'multipart_none.html'));
});


// upload.single(input태그의 name or 폼 데이터의 키)
app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file, req.body);
    res.send('ok');
});

// 파일 여러개
app.post('/multi/upload', upload.array('many'), (req, res) => {
    console.log(req.files, req.body);
    res.send('ok');
});

// 파일 여러개 (키가 다르게)
app.post('/multi/key/upload', 
    upload.fields([{name: 'image1'}, {name: 'image2'}]),
    (req, res) => {
        console.log(req.files, req.body);
        res.send('ok');
    }
);

// 파일을 업로드 하지 않고 멀티파트 형식으로 업로드하기
app.post('/none/upload', upload.none(), (req, res) => {
    console.log(req.body);
    res.send('ok');
});


// 에러처리 매개변수는 반드시 4개여야함
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

// app.get(주소, 라우터): 주소에 대한 GET 요청이 올 때 어떤 동작을 할지 설정
// app.get('/', (req, res) => {
//     // res.write, res.end 대신 res.send 사용
//     // res.send('Hello, Express!');
//     res.sendFile(path.join(__dirname, '/index.html'));
// });

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
})
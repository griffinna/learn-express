const express = require('express');
const path = require('path');

// express 내부에 http 모듈이 내장되어 있어 서버의 역할을 할 수 있다.
const app = express();
// 서버가 실행 될 포트를 설정 (속성이 없다면 3000 포트를 사용)
app.set('port', process.env.PORT || 3000);

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
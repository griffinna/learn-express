const express = require('express');

// express 내부에 http 모듈이 내장되어 있어 서버의 역할을 할 수 있다.
const app = express();
// 서버가 실행 될 포트를 설정 (속성이 없다면 3000 포트를 사용)
app.set('port', process.env.PORT || 3000);

// app.get(주소, 라우터): 주소에 대한 GET 요청이 올 때 어떤 동작을 할지 설정
app.get('/', (req, res) => {
    // res.write, res.end 대신 res.send 사용
    res.send('Hello, Express!');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
})
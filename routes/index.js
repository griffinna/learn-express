const express = require('express');

const router = express.Router();

// GET / 라우터
router.get('/', function (req, res, next) {
    next('route');  // 두번째, 세번째 미들웨어 실행되지 않고 주소와 일치하는 다음 라우터로 넘어간다.
}, function(req, res, next) {
    console.log('실행되지 않습니다.');
    next();
}, function(req, res, next) {
    console.log('실행되지 않습니다.');
    next();
});

router.get('/', (req, res) => {
    console.log('실행됩니다.');
    res.send('Helloooo Expresssss!')
})

module.exports = router;
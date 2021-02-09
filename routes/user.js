const express = require('express');

const router = express.Router();

// GET / 라우터
router.get('/', (req, res) => {
    res.send('Hello, User');
});

// 라우트 매개변수
// 다양한 라우터를 아우르는 와일드카드 역할이기때문에 일반 라우터보다 뒤에 위치해야한다.
router.get('/:id', (req, res) => {
    // req.params 안에 req.params.id 로 조회 가능
    console.log(req.params, req.query);
    // /user/1                      => req.params:  { id: '1' }
    // /user/123?limit=5&skip=10    => req.query:   { limit: '5', skip: '10' }
    console.log('얘만 실행됩니다.');
});

router.get('/like', (req, res) => {
    console.log('전혀 실행되지 않습니다.');
});

module.exports = router;
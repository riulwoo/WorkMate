const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("하이하이 테스트 성공이야");
});


module.exports = router;
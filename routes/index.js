var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/detail/:code', function (req, res, next) {
    res.sendFile('index.html', { root: 'public' });
});

router.get('/trails/:type', function (req, res, next) {
    res.sendFile('index.html', { root: 'public' });
});

module.exports = router;

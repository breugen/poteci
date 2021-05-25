var express = require('express');
var sqlite3 = require('sqlite3').verbose()
var router = express.Router();
var database = require('../database');

/* GET users listing. */
router.get('/', function(req, res, next) {
  database.db.each('SELECT COUNT(*) as count FROM lorem', function (err, row) {
    if (err) {
        console.log(err)
    } else {
      // res.status(200).send(body)
      res.send('respond with a resource' + row.count);
    }
  })

});

module.exports = router;

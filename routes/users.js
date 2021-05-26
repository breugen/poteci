var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.each('SELECT id, name, active FROM cities', function (err, row) {
    console.log(row.id + ': ' + row.name + ': ' + row.active)
  })

  
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

var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET cities listing. */
router.get('/', function(req, res, next) {
  // You should use the asterisk (*) for the testing purpose only,
  // not in the real application development.
  // Because…
  // When you develop an application, you should control what
  // SQLite returns to your application. Suppose, a table has 3 columns, and you use the asterisk (*) to retrieve the data from all three columns.
  // What if someone removes a column, your application would
  // not be working properly, because it assumes that there are
  // three columns returned and the logic to process those three columns would be broken.
  // If someone adds more columns, your application may work
  // but it gets more data than needed, which creates more I/O overhead between the database and application.
  // So try to avoid using the asterisk (*) as a good habit
  // when you use the SELECT statement.
  database.db.all('SELECT * FROM cities', function (err, cities) {
    res.send(cities);
  });
});

module.exports = router;

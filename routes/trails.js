var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET trails listing. */
router.get('/:city', function(req, res, next) {
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
  const city = req.params.city;
  database.db.all(`
    SELECT * FROM trails
    INNER JOIN city_trails
    ON city_trails.trail = trails.code
    WHERE city = ?
  `, city, function (err, trails) {
        // some of these are segments
        const trailCodes = trails.map(trail => '\'' + trail.code + '\'').join(', ');
        trails.forEach(trail => {
          trail.pointShortList = trail.pointShortList ? trail.pointShortList.split(',') : [];
          trail.pointLongList = trail.pointLongList ? trail.pointLongList.split(',') : [];
        });

        database.db.all('SELECT * FROM segments WHERE parent IN (' + trailCodes + ')'
          + ' ORDER BY position', function (err, segments) {
          // TODO: you can map the trails by code for faster access and no 'find'
          segments.forEach((segment) => {
            const segmentParentTrail = trails.find(trail => trail.code === segment.parent);
            if (!Array.isArray(segmentParentTrail.segments)) {
              segmentParentTrail.segments = [];
            }
            const segmentChildTrail = trails.find(trail => trail.code === segment.child);
            segmentParentTrail.segments.push(segmentChildTrail)
          });
            


          // filtering the segments out before sending the response
          res.send(trails.filter(trail => trail.type));
      });

  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET trail detail. */
router.get('/:trailCode', function (req, res, next) {
    const trailCode = req.params.trailCode;
    database.db.get(`
      SELECT * FROM details
      WHERE trail = ?
    `, trailCode, function (err, trailDetail) {
        database.db.all(`
          SELECT * FROM pictures
          WHERE trail = ?
      `, trailCode, function (err, pictures) {
        if (trailDetail) {
          trailDetail.pictures = pictures;
          res.send(trailDetail);
        } else {
          console.error('Could not find trail detail for code ' + trailCode);
          res.sendStatus(404);
        }
      });
    });
});

module.exports = router;

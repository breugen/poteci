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
        trailDetail.pictures = pictures;
        res.send(trailDetail);
      });
    });
});

module.exports = router;

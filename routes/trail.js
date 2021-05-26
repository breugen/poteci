var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET trail. */
router.get('/:trailCode', function (req, res, next) {
    const trailCode = req.params.trailCode;
    database.db.all(`
    SELECT
    trails.id as id,
    trails.code as code,
    trails.type as type,
    trails.name as name,
    trails.massif as massif,
    trails.blaze as blaze,
    trails.pointShortList as pointShortList,
    trails.pointLongList as pointLongList,
    trails.time as time,

    // FIXME: continue to join segments then loop over 
    // the segments and build the proper trail.
    paths.id as id
    FROM trails
    LEFT JOIN segments
    ON segments.parent = trails.code
    LEFT JOIN trails as paths
    ON paths.code = segments.child
    WHERE trails.code = ?
  `, trailCode, function (err, rows) {
        rows.forEach(row => {
            console.log(row);
        });
        //   segments.forEach((segment) => {
        //     const segmentParentTrail = trails.find(trail => trail.code === segment.parent);
        //     if (!Array.isArray(segmentParentTrail.segments)) {
        //       segmentParentTrail.segments = [];
        //     }
        //     const segmentChildTrail = trails.find(trail => trail.code === segment.child);
        //     segmentParentTrail.segments.push(segmentChildTrail)
        //   });

        // filtering the segments out before sending the response
        res.send(trails.filter(trail => trail.type));
    });
});

module.exports = router;

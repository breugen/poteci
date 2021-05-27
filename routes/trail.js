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
    paths.id as segment_id,
    paths.code as segment_code,
    paths.type as segment_type,
    paths.name as segment_name,
    paths.massif as segment_massif,
    paths.blaze as segment_blaze,
    paths.pointShortList as segment_pointShortList,
    paths.pointLongList as segment_pointLongList,
    paths.time as segment_time
    FROM trails
    LEFT JOIN segments
    ON segments.parent = trails.code
    LEFT JOIN trails as paths
    ON paths.code = segments.child
    WHERE trails.code = ?
  `, trailCode, function (err, rows) {
        if (rows.length) {
            const trail = {
                id: rows[0].id,
                code: rows[0].code,
                type: rows[0].type,
                name: rows[0].name,
                massif: rows[0].massif,
                blaze: rows[0].blaze,
                pointShortList: rows[0].pointShortList,
                pointLongList: rows[0].pointLongList,
                time: rows[0].time,
                segments: []
            }

            rows.forEach(row => {
                if (row.segment_code) {
                    trail.segments.push({
                        id: row.segment_id,
                        code: row.segment_code,
                        type: row.segment_type,
                        name: row.segment_name,
                        massif: row.segment_massif,
                        blaze: row.segment_blaze,
                        pointShortList: row.segment_pointShortList,
                        pointLongList: row.segment_pointLongList,
                        time: row.segment_time
                    });
                }
            });

            res.send(trail);
        } else {
            res.sendStatus(404);
        }
    });
});

module.exports = router;

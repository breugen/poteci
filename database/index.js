var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(':memory:')
const cities = require('./cities');
const trails = require('./trails');
const details = require('./trailDetails');
const segments = require('./segments');
const pictures = require('./pictures');
const cityTrails = require('./city-trail');

function setupDatabase() {

  db.serialize(function () {
    // setting up the cities
    db.run(`
          CREATE TABLE cities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            active INTEGER,
            code TEXT
          )
        `)

    let stmt = db.prepare('INSERT INTO cities VALUES (?, ?, ?, ?)')

    cities.forEach(city => {
      stmt.run(null, city.name, city.active, city.code);
    });

    stmt.finalize()

    db.each('SELECT id, name, active FROM cities', function (err, row) {
      console.log(row.id + ': ' + row.name + ': ' + row.active)
    })


    // setting up the trails
    db.run(`
          CREATE TABLE trails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT,
            type INTEGER,
            name TEXT,
            massif TEXT,
            blaze TEXT,
            pointShortList TEXT,
            pointLongList TEXT,
            time INTEGER
          )
        `)

    stmt = db.prepare('INSERT INTO trails VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')

    trails.forEach(trail => {
      stmt.run(null, trail.code, trail.type, trail.name, trail.massif,
        trail.blaze, trail.pointShortList, trail.pointLongList,
        trail.time, trail.trailDetailId);
    });

    stmt.finalize()

    db.each('SELECT id, code FROM trails', function (err, row) {
      console.log(row.id + ': ' + row.code)
    })

    // setting up the segments
    db.run(`
        CREATE TABLE segments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          parent TEXT,
          child TEXT,
          position INTEGER
        )
      `)

    stmt = db.prepare('INSERT INTO segments VALUES (?, ?, ?, ?)')

    segments.forEach(segment => {
      stmt.run(null, segment.parent, segment.child, segment.position);
    });

    stmt.finalize()

    db.each('SELECT id, parent FROM segments', function (err, row) {
      console.log(row.id + ': ' + row.parent)
    })

    // setting up the details
    db.run(`
        CREATE TABLE details (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          trail TEXT,
          description TEXT,
          restrictions TEXT,
          water TEXT,
          equipment TEXT,
          wildlife TEXT
        )
      `)

    stmt = db.prepare('INSERT INTO details VALUES (?, ?, ?, ?, ?, ?, ?)')

    details.forEach(detail => {
      stmt.run(null, detail.trail, detail.description, detail.restrictions,
        detail.water, detail.equipment, detail.wildlife);
    });

    stmt.finalize()

    db.each('SELECT id, trail FROM details', function (err, row) {
      console.log(row.id + ':detail ' + row.trail)
    })

    // setting up the pictures
    db.run(`
        CREATE TABLE pictures (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          trail TEXT,
          url TEXT,
          description TEXT
        )
      `)

    stmt = db.prepare('INSERT INTO pictures VALUES (?, ?, ?, ?)')

    pictures.forEach(picture => {
      stmt.run(null, picture.trail, picture.url, picture.description);
    });

    stmt.finalize()

    db.each('SELECT id, url FROM pictures', function (err, row) {
      console.log(row.id + ':pictures ' + row.url)
    })

    // setting up the city-trail
    db.run(`
        CREATE TABLE city_trails (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          trail TEXT,
          city TEXT,
          position INTEGER
        )
      `)

    stmt = db.prepare('INSERT INTO city_trails VALUES (?, ?, ?, ?)')

    cityTrails.forEach(cityTrail => {
      stmt.run(null, cityTrail.trail, cityTrail.city, cityTrail.position);
    });

    stmt.finalize()

    db.each('SELECT trail, city FROM city_trails', function (err, row) {
      console.log(row.trail + ':city_trails ' + row.city)
    })

  })
}


module.exports = {
  setupDatabase,
  db
};
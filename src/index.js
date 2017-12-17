'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jsonParser = require('body-parser').json;
const seeder = require('mongoose-seeder'),
  data = require('./data/data.json');

const courses = require('./routes/courses');
const users = require('./routes/users');

const app = express();


// mongodb conection
mongoose.connect("mongodb://localhost/userRatings")
var db = mongoose.connection;

//mongo error
db.on("error", function(err){
  console.error("connection error:", err);
});


db.once("open", function(){
  console.log("db connection sucessful");
    // Seed Data
  seeder.seed(data, {}, () => {
    console.log("Data has been seeded");
  }).then(function(dbData) {
    // The database objects are stored in dbData
  }).catch(function(err) {
    // handle error
    console.log(err);
  });
  console.log("Connected to Mongo!");
});

//set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// setup json handling
app.use(jsonParser());

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

// include routes
app.use('/api/users', users);
app.use('/api/courses', courses);

// catch 404 and forward to global error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});


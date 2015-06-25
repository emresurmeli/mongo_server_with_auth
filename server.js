'use strict';

var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var usersRoutes = require('./routes/auth_routes');
var app = express();
var authRoutes = express.Router();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/users_dev');

app.use(passport.initialize());

require('./lib/passport_strat')(passport);
require('./routes/auth_routes')(authRoutes, passport);

app.use('/api', authRoutes);

app.listen(process.env.PORT || 3000, function() {
  console.log('server running on port ' + (process.env.PORT || 3000));
});
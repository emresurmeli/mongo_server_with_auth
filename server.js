'use strict';

var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var usersRoutes = require('./routes/auth_routes');
var app = express();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/users_dev');

app.set('appSecret', process.env.APP_SECRET || 'changethischangethischangethis!')
app.use(passport.initialize());

var usersRouter = express.Router();

require('./lib/passport_strat')(passport);
require('./routes/auth_routes')(usersRoutes, passport);

app.use('/api', usersRoutes);

app.listen(process.env.PORT || 3000, function() {
  console.log('server running on port ' + (process.env.PORT || 3000));
});
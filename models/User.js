'use strict';

var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var eat = require('eat');
var expireHrs = 12;

var userSchema = mongoose.Schema({
  eat: Number,
  username: String,
  basic: {
    email: { type: String, unique: true},
    password: String
  }
});

userSchema.path('username').required(true);
userSchema.path('basic.email').required(true);
userSchema.path('basic.email').index({unique: true});
userSchema.path('basic.password').required(true);

userSchema.methods.generateHash = function(password, callback) {
  bcrypt.genSalt(8, function(err, salt) {
    bcrypt.hash(password, salt, null, function(err, hash) {
      if(err) {
        console.log(err);
      }

      callback(hash);
    });
  });
};

userSchema.methods.checkPassword = function(password, callback) {
  bcrypt.compare(password, this.basic.password, function(err, res) {
    if(err) {
      console.log(err);
    }

    callback(res);
  });
};

userSchema.methods.generateToken = function(secret, callback) {
  var currDate = new Date();
  this.eat = currDate.setHours(currDate.getHours() + expireHrs);

  this.save(function(err, user) {
    if(err) {
      console.log('save error: ' + err);
    }

    eat.encode({eat: user.eat}, secret, function(err, eatToken) {
      if(err) {
        console.log('encoding error: ' + err);
        return callback(err, null);
      }

      callback(err, eatToken);
    });
  });
};

userSchema.methods.owns = function(callback) {
  this.eat = null;
  this.save(function(err, user) {
    if(err) {
      console.log(err);
      return callback(err, null);
    }

    callback(err, user);
  });
};

module.exports = mongoose.model('User', userSchema);
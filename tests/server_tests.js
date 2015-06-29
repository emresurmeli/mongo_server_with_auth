'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/users_test';
require('../server');

var User = require('../models/User');
var chaihttp = require('chai-http');
var mongoose = require('mongoose');
var chai = require('chai');
var expect = chai.expect;
chai.use(chaihttp);

describe('Auth', function() {

  describe('sample user', function() {
    var eatToken;
    var newUser;
    beforeEach(function(done) {
      chai.request('localhost:3000')
        .post('/api/create_user')
        .send({username: 'name', email: 'test@example.com', password: 'abc123'})
        .end(function(err, res) {
          expect(err).to.eql(null);
          eatToken = res.body.eat;
          User.findOne({username: 'name'}, function(err, user) {
            expect(err).to.eql(null);
            newUser = user;
            done();
      });
    });
  });

	afterEach(function() {
		mongoose.connection.db.dropDatabase(function() {});
	});

	describe('POST request', function() {
    it('should be able to create a new user', function(done) {
  		chai.request('localhost:3000')
  			.post('/api/create_user')
  			.send({username: 'name', email: 'test@example.com', password:'abc123'})
  			.end(function(err, res) {
  				expect(err).to.eql(null);
  				expect(res.body.msg).to.eql('email in use');
  				done();
			});
    });
  });

  describe('GET sign in request', function() {
    it('should return a token', function(done) {
      chai.request('localhost:3000')
        .get('/api/sign_in')
        .auth('test@example.com', 'abc123')
        .end(function(err, res) {
          var resToken = res.body.eat;
          expect(err).to.eql(null);
          expect(typeof resToken).to.eql('string');
          done();
      });
    });
  });

  describe('GET sign out request', function() {
    it('discards the token', function(done) {
      chai.request('localhost:3000')
        .get('/api/sign_out' + eatToken)
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('successfully signed out');
          done();
        });
      });
    });
  });
});


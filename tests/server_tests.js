'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/users_test';
require('../server');

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

var User = require('../models/User');

describe('single resource api', function() {

	after(function(done) {
		mongoose.connection.db.dropDatabase(function() {
			done();
		});
	});

	it('should be able to create a new user', function(done) {
		chai.request('localhost:3000')
			.post('/api/users')
			.send({name: 'name'})
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.name).to.eql('name');
				expect(res.body).to.have.property('_id');
				done();
			});
	});

	it('should get an array of users', function(done) {
		chai.request('localhost:3000')
			.get('/api/users')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(typeof res.body).to.eql('object');
				expect(Array.isArray(res.body)).to.eql(true);
				done();
			});
	});

	describe('needs an existing user to work with', function(done) {
		beforeEach(function(done) {
			var testUser = new User({name: 'name'});
			testUser.save(function(err, data) {
				if(err) throw err;
				this.testUser = data;
				done();
			}.bind(this));
		});

		it('should be able to make a user in a beforeEach block', function() {
			expect(this.testUser.name).to.eql('name');
			expect(this.testUser).to.have.property('_id');
		});

		it('should update a user', function(done) {
			var id = this.testUser._id;
			chai.request('localhost:3000')
				.put('/api/users/' + id)
				.send({name: 'a new name'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.msg).to.eql('success');
					done();
				});
		});

		it('should delete a user', function(done) {
			chai.request('localhost:3000')
				.del('/api/users/' + this.testUser._id)
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.msg).to.eql('success');
					done();
				});
		});
	});
});
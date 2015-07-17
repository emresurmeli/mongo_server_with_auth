'use strict';

var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);
var bodyparser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/User');
var mongoose = require('mongoose');

module.exports = function(router, passport) {
	router.use(bodyparser.json());

	router.post('/create_user', function(req, res) {

		var newUserData = JSON.parse(JSON.stringify(req.body));
		delete newUserData.email;
		delete newUserData.password;
		newUserData.basic = {};
		newUserData.email = req.body.email;
		var newUser = new User(newUserData);

		newUser.generateHash(req.body.password, function(hash) {
			newUser.basic.password = hash;
			newUser.save(function(err, user) {
				if(err) {
					console.log(err);
					return res.status(500).json({msg: 'email in use'});
				}

				user.generateToken(process.env.APP_SECRET, function(err, token){
					if(err) {
						console.log(err);
						return res.status(500).json({msg: 'err generating token'});
					}

					res.json({token: token});
				});
			});
		});
	});

	router.get('/sign_in', passport.authenticate('basic', {session: false}), function(req, res) {
		req.user.generateToken(process.env.APP_SECRET, function(err, token){
			if(err) {
				console.log(err);
				return res.status(500).json({msg: 'err generating token'});
			}

			res.json({token: token});
		});
	});

	router.get('/sign_out/:eat', eatAuth, function(req, res) {
		req.user.owns(function(err, check) {
			if(err) {
				console.log(err);
				return res.status(500).json({msg: 'internal server error'});
			}

			res.json({msg: 'successfully signed out'});
		});
	});
};
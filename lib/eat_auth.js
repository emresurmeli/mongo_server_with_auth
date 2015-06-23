'use strict';

var User = require('../models/User');
var eat = require('eat');

module.exports = function(secret) {
	return function(req, res, next) {
		var token = req.headers.eat || req.body.eat;
		if(!token) {
			console.log('unauthorized token in request');
			return res.status(401).json({msg: 'not authorized'});
		}

		eat.decode(token, secret, function(err, decoded) {
			if(err) {
				console.log(err);
				return res.status(401).json({msg: 'not authorized'});
			}

			User.findOne({_id: decoded.id}, function(err, user) {
				if(err) {
					console.log(err);
					return res.status(401).json({msg: 'not authorized'});
				}

				if(!user) {
					console.log(err);
					return res.status(401).json({msg: 'not authorized'});
				}

				req.user = user;
				next();
			});
		});
	};
};

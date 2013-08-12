/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true, stupid: true */
"use strict";

/*!
 * package.test - package.json tests
 * Copyright(c) 2013 Crafity
 * Copyright(c) 2013 Bart Riemens
 * Copyright(c) 2013 Galina Slavova
 * MIT Licensed
 */

/**
 * Test dependencies.
 */

var jstest = require('crafity-jstest').createContext("Crafity Jade plugin tests")
	, fs = require('fs')
	, assert = jstest.assert
	;

/**
 * Run the tests
 */

jstest.run({
	"Instantiate crafity-http-jade module": function () {
		var jade = require('../main');
		assert.isDefined(jade, "Expected a module");
		assert.isFunction(jade, "Expected the module to be a function");
	},
	"Call the main module's function with incorrect parameters": function () {
		var jade = require('../main')
			, handler
			, req = {}, res = {};

		try {
			jade();
		} catch (err) {
			assert.areEqual(err.message, "Argument 'config' is required", "Expected another error message");
		}

		handler = jade({});

		try {
			handler();
		} catch (err) {
			assert.areEqual(err.message, "Argument 'req' is required", "Expected another error message");
		}
		try {
			handler(req);
		} catch (err) {
			assert.areEqual(err.message, "Argument 'res' is required", "Expected another error message");
		}
		try {
			handler(req, res);
		} catch (err) {
			assert.areEqual(err.message, "Argument 'next' is required", "Expected another error message");
		}
		try {
			handler(req, res, {});
		} catch (err) {
			assert.areEqual(err.message, "Argument 'next' must be a function", "Expected another error message");
		}
	},
	"Call the main module's function with correct parameters and expected a res.render function in return": function () {
		var jade = require('../main')
			, config = {}
			, handler = jade(config)
			, req = {}, res = {};

		handler(req, res, function () {
			return false;
		});

		assert.isDefined(res.render, "Expected a render function on the response object");
	},
	"Call the res.render function with a non existing view and expect an error": function (test) {
		test.async(1000);
		var jade = require('../main')
			, config = {}
			, handler = jade(config)
			, req = {}, res = {}
			, view = "UNKNOWN", model = {}
			;

//      , accumulatedData = "", req = {}, res= {
//        write: function (chunk) {
//          accumulatedData += chunk;
//        },
//        end: function (data) {
//          accumulatedData += data;
//        }
//      };
//

		handler(req, res, function () {
			return null;
		});

		res.render(view, model, function (err) {
			assert.isDefined(err, "Expected an exception");
			assert.areEqual("ENOENT, open 'views/UNKNOWN.jade'", err.message, "");
			test.complete();
		});

	},
	"Call the res.render function with an existing view and expect html rendered output": function (test) {
		test.async(1000);
		var jade = require('../main')
			, config = { viewPath: "test/views/" }
			, handler = jade(config)
			, endData
			, headers = {}
			, req = {}
			, res = { 
				end: function(data) { endData = data; res.end = undefined; },
				setHeader: function (key, value) { headers[key] = value; }
			}
			, view = "home", model = {}
			;

		handler(req, res, function () {
			return null;
		});

		res.render(view, model, function (err, html) {
			if (err) { throw err; }
			assert.areEqual("text/html", headers["Content-Type"], "Expected the proper content type to be set");
			assert.areEqual("<html><head></head><body><h1>Hello World</h1></body></html>", endData, "Expected other rendered html passed to the res.end() function");
			assert.areEqual("<html><head></head><body><h1>Hello World</h1></body></html>", html, "Expected other rendered html to be returned via a callback");
			test.complete();
		});

	}
	
});

module.exports = jstest;
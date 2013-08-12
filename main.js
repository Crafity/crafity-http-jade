/*jslint node: true, white: true */
"use strict";

/*!
 * crafity-http-jade - Jade plugin for crafity-http
 * Copyright(c) <year> <name>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var jade = require('jade')
	, fs = require('crafity-filesystem');

/**
 *
 * @param {Object} [config]
 * @returns {Function}
 */
function init(config) {
	config = config || {};
	config.viewPath = config.viewPath || "views/";
	config.layout = config.layout !== false ? "layout" : null;

	/**
	 *
	 * @param req The http request
	 * @param res The http response
	 * @param {Function} [next] The next handler in the http pipeline
	 */
	function handler(req, res, next) {
		if (!req) {
			throw new Error("Argument 'req' is required");
		}
		if (!res) {
			throw new Error("Argument 'res' is required");
		}
		if (!next) {
			throw new Error("Argument 'next' is required");
		}
		if (next && !(next instanceof Function)) {
			throw new Error("Argument 'next' must be a function");
		}

		/**
		 *
		 * @param view
		 * @param model
		 * @param callback
		 */
		function render(view, model, callback) {
			if (!view) {
				throw new Error("Argument 'view' is required");
			}
			if (!model) {
				throw new Error("Argument 'model' is required");
			}
			callback = callback || function () {
				return;
			};

			var jadeFilename = fs.combine(config.viewPath, view + ".jade")
				, layoutFilename = fs.combine(config.viewPath, "layout.jade");

			fs.readFile(jadeFilename, function (err, buffer) {
				if (err) { return callback(err); }

				model.body = jade.compile(buffer.toString(), { filename: jadeFilename })(model || {});

				fs.readFile(layoutFilename, function (err, buffer) {
					if (err) { return callback(err); }
					
					var fileContent = buffer.toString()
						, html = jade.compile(fileContent, { filename: layoutFilename })(model || {})
						;
					
					//console.log("fileContent", html);
					
					res.setHeader('Content-Type', 'text/html');
					res.end(html);
					
					return callback(null, html);
				});
			});
		}

		res.render = render;

		return next();
	}

	return handler;
}

module.exports = init;

/**
 * Module name.
 */

module.exports.fullname = "crafity-http-jade";

/**
 * Module version.
 */

module.exports.version = '0.1.0';

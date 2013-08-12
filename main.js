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
var jade = require('jade');

/**
 *
 * @param config
 * @returns {Function}
 */
function init(config) {
  if (!config) {
    throw new Error("Argument 'config' is required");
  }

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
     */
    function render(view, model) {
      if (!view) {
        throw new Error("Argument 'view' is required");
      }
      if (!model) {
        throw new Error("Argument 'model' is required");
      }
      var data = "", fileContent = ""; // = console.log("jade", jade);
      return res.end(jade.compile(fileContent)(data));
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

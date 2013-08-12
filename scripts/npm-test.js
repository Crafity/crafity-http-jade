/*jslint node:true, white: true*/
require("../test/package.test.js").on("complete", function () {
  require("../test/crafity-http-jade.test.js");
});

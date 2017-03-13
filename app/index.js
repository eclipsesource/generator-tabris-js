/* eslint no-var: "off" */
var majorVersion = parseInt(/^v(\d+)\./.exec(process.version)[1], 10);
if (majorVersion < 6) {
  console.error('Your Node.js version (' + process.version + ') is not supported. Please upgrade to >= 6.0.');
  process.exit(1);
}
module.exports = require('./generator');

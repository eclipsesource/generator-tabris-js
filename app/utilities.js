/*
 * Utility functions for convenience
 */
module.exports = {
  toId: function (string) {
    return string.replace(/\s+/g, '-').toLowerCase();
  },
  toAppId: function (string) {
    return string.replace(/\s+/g, '.').replace(/\-+/g, '.').toLowerCase();
  },
  toName: function (string) {
    return string.split(/[-_\s]+/)
      .filter(string => !!string)
      .map(word => word.charAt(0).toUpperCase() + word.substr(1))
      .join(' ');
  },
  appIdIsValid: function (string) {
    var validAppIdRegex = RegExp(/^([a-z0-9_]+\.)*[a-z][a-z0-9_]+$/, 'i');
    return validAppIdRegex.test(string);
  }
};

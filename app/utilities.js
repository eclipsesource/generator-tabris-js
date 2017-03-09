/*
 * Utility functions for convenience
 */
module.exports = {toId, toAppId, toName, isValidAppId};

const VALID_APP_ID_REGEX = /^([a-z0-9_]+\.)+[a-z][a-z0-9_]+$/i;

function toId(string) {
  return string.replace(/\s+/g, '-').replace(/-+/g, '-').toLowerCase();
}

function toAppId(string) {
  return string.replace(/\s+/g, '.').replace(/\-+/g, '.').toLowerCase();
}

function toName(string) {
  return string.split(/[-_\.\s]+/)
    .filter(string => !!string)
    .map(word => word.charAt(0).toUpperCase() + word.substr(1))
    .join(' ');
}

function isValidAppId(string) {
  return VALID_APP_ID_REGEX.test(string);
}

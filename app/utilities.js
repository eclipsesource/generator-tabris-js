/*
 * Utility functions for convenience
 */
module.exports = {toAppId, toName, isValidAppId};

const VALID_APP_ID_REGEX = /^([a-z0-9_]+\.)+[a-z][a-z0-9_]+$/i;

function toAppId(user, appname) {
  return user.github.username()
    .catch(() => user.git.email() ? user.git.email().split('@')[0] : null)
    .then(username => username || 'org.example')
    .then(domain => domain + '.' + appname.replace(/\s+/g, '').replace(/-+/g, '').toLowerCase())
    .catch(error => {
      console.log(error);
      return '';
    });
}

function toName(string) {
  return string.split(/[-_.\s]+/)
    .filter(part => !!part)
    .map(word => word.charAt(0).toUpperCase() + word.substr(1))
    .join(' ');
}

function isValidAppId(string) {
  return VALID_APP_ID_REGEX.test(string);
}

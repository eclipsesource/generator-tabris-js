const {describe, it} = require('mocha');
const {expect} = require('chai');
const {toAppId, toName, isValidAppId} = require('../app/utilities');

describe('Generator utilities:', function() {

  describe('toAppId', function() {

    let userMock;

    beforeEach(function() {
      userMock = {
        github: {username: () => Promise.reject()},
        git: {email: () => null}
      };
    });

    it('translates a single word to lowercase', function() {
      return toAppId(userMock, 'MyApp').then(appid => {
        expect(appid).to.equal('org.example.myapp');
      });
    });

    it('strips spaces, translates to lowercase', function() {
      return toAppId(userMock, 'My  Little\tApp').then(appid => {
        expect(appid).to.equal('org.example.mylittleapp');
      });
    });

    it('uses github user name as prefix', function() {
      userMock.github.username = () => Promise.resolve('mygithubname');
      return toAppId(userMock, 'myapp').then(appid => {
        expect(appid).to.equal('mygithubname.myapp');
      });
    });

    it('uses user email name as prefix', function() {
      userMock.git.email = () => 'name@domain.org';
      return toAppId(userMock, 'myapp').then(appid => {
        expect(appid).to.equal('name.myapp');
      });
    });

  });

  describe('toName', function() {

    it('replaces periods, dashes, and underscores with spaces, translates to titlecase', function() {
      expect(toName('my.little.app')).to.equal('My Little App');
      expect(toName('my-little-app')).to.equal('My Little App');
    });

    it('reduces subsequent spaces to single space', function() {
      expect(toName('My  Little\tApp')).to.equal('My Little App');
    });

  });

  describe('isValidAppId', function() {

    it('accepts valid app id, words separated by periods', function() {
      expect(isValidAppId('my.app.id')).to.be.true;
    });

    it('accepts id with two segments', function() {
      expect(isValidAppId('my.app')).to.be.true;
    });

    it('rejects id without periods (single word)', function() {
      expect(isValidAppId('myapp')).to.be.false;
    });

    it('rejects ids with illegal periods', function() {
      expect(isValidAppId('my..app.id')).to.be.false;
      expect(isValidAppId('.my.app.id')).to.be.false;
      expect(isValidAppId('my.app.id.')).to.be.false;
    });

    it('rejects ids with invalid characters', function() {
      expect(isValidAppId('my-app-id')).to.be.false;
      expect(isValidAppId('my app id')).to.be.false;
      expect(isValidAppId('my*app*id')).to.be.false;
      expect(isValidAppId('my.app.!d')).to.be.false;
      expect(isValidAppId('my.@pp.id')).to.be.false;
      expect(isValidAppId('m$.app.id')).to.be.false;
    });

  });

});

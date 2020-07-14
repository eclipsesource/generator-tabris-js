const {statSync, existsSync} = require('fs');
const {resolve} = require('path');
const {describe, it} = require('mocha');
const {expect} = require('chai');
const {
  toAppId,
  toName,
  isValidAppId,
  templateRequiresTsc,
  templateSupportsMocha,
  templateRequiresDecorators
} = require('../app/utilities');
const {TEMPLATES} = require('../app/templates.data');

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

  describe('templateRequiresTsc', function() {

    it('returns correct values', function() {
      expect(templateRequiresTsc(null)).to.be.false;
      expect(templateRequiresTsc('mvvm')).to.be.true;
      expect(templateRequiresTsc('mvp')).to.be.true;
      expect(templateRequiresTsc('tsx')).to.be.true;
      expect(templateRequiresTsc('jsx')).to.be.true;
      expect(templateRequiresTsc('js')).to.be.false;
    });

    it('matches template description', function() {
      TEMPLATES.forEach(template => {
        const expected = template.name.endsWith('(TypeScript/JSX)')
          || template.name.endsWith('(JavaScript/JSX)');
        expect(templateRequiresTsc(template.value)).to.equal(expected);
      });
    });

  });

  describe('templateSupportsMocha', function() {

    it('returns correct values', function() {
      expect(templateSupportsMocha(null)).to.be.false;
      expect(templateSupportsMocha('mvvm')).to.be.true;
      expect(templateSupportsMocha('mvp')).to.be.true;
      expect(templateSupportsMocha('tsx')).to.be.true;
      expect(templateSupportsMocha('jsx')).to.be.false;
      expect(templateSupportsMocha('js')).to.be.false;
    });

    it('matches template folders', function() {
      TEMPLATES.forEach(template => {
        const path = resolve(__dirname, '../app/templates-3.x/ts/test-' + template.value);
        const stat = existsSync(path) && statSync(path);
        expect(templateSupportsMocha(template.value)).to.equal(stat && stat.isDirectory());
      });
    });

  });

  describe('templateRequiresDecorators', function() {

    it('returns correct values', function() {
      expect(templateRequiresDecorators(null)).to.be.false;
      expect(templateRequiresDecorators('mvvm')).to.be.true;
      expect(templateRequiresDecorators('mvp')).to.be.true;
      expect(templateRequiresDecorators('tsx')).to.be.false;
      expect(templateRequiresDecorators('jsx')).to.be.false;
      expect(templateRequiresDecorators('js')).to.be.false;
    });

  });

});

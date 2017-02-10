import {describe, it} from 'mocha';
import {expect} from 'chai';
import {assert} from 'yeoman-generator';
import * as generator from '../app/index';
import utilities from '../app/utilities';

describe('Package files:', () => {
  it('should exist on the file system', () => {
    assert.file(['package.json', '.eslintrc', '.babelrc', '.editorconfig', 'README.md', 'app/index.js']);
  });
  it('should contain the tabris homepage in the package.json', () => {
    assert.fileContent('package.json', /"homepage": "http:\/\/tabrisjs.com\/"/);
  });
  it('should contain an entry point in the package.json', () => {
    assert.fileContent('package.json', /"main": "app\/index.js"/);
  });
  it('should contain licence info in the README', () => {
    assert.fileContent('README.md', /License/);
  });
  it('should export an object from the generator (app/index.js)', () => {
    expect(generator).to.be.a('Object');
  });
});

describe('Generator utilities:', () => {
  it('should have the required utility functions', () => {
    expect(utilities.toId).to.be.a('function');
    expect(utilities.toAppId).to.be.a('function');
    expect(utilities.toName).to.be.a('function');
  });

  describe('Validate AppId:', () => {
    it('should accept a valid app id, words separated by periods', () => {
      expect(utilities.appIdIsValid('my.app.id')).to.be.true;
    });
    it('should accept a valid app id, reverse domain name', () => {
      expect(utilities.appIdIsValid('com.tabrisjs.myapp')).to.be.true;
    });
    it('should accept a valid app id that has less than 3 periods', () => {
      expect(utilities.appIdIsValid('my.app')).to.be.true;
    });
    it('should accept a valid app id that has no periods (single word)', () => {
      expect(utilities.appIdIsValid('myapp')).to.be.true;
    });
    it('should reject an invalid app id that contains dashes', () => {
      expect(utilities.appIdIsValid('my-app-id')).to.be.false;
    });
    it('should reject an invalid app id that contains spaces', () => {
      expect(utilities.appIdIsValid('my app id')).to.be.false;
    });
    it('should reject an invalid app id that contains asterisk', () => {
      expect(utilities.appIdIsValid('my*app*id')).to.be.false;
    });
    it('should reject an invalid app id that contains an exclamation mark', () => {
      expect(utilities.appIdIsValid('my.app.!d')).to.be.false;
    });
    it('should reject an invalid app id that contains an at symbol', () => {
      expect(utilities.appIdIsValid('my.@pp.id')).to.be.false;
    });
    it('should reject an invalid app id that contains a dollar sign', () => {
      expect(utilities.appIdIsValid('m$.app.id')).to.be.false;
    });
    it('should reject an invalid app id that contains multiple concurrent periods', () => {
      expect(utilities.appIdIsValid('my..app.id')).to.be.false;
    });
  });

})
;


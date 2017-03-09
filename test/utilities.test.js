import {describe, it} from 'mocha';
import {expect} from 'chai';
import {toId, toAppId, toName, isValidAppId} from '../app/utilities';

describe('Generator utilities:', () => {

  describe('toId', () => {

    it('translates a single word to lowercase', () => {
      expect(toId('MyApp')).to.equal('myapp');
    });

    it('replaces all spaces with dashes, translates to lowercase', () => {
      expect(toId('My Little App')).to.equal('my-little-app');
      expect(toId('My  Little\tApp')).to.equal('my-little-app');
    });

    it('reduces subsequent dashes to a single one', () => {
      expect(toId('My Little - App')).to.equal('my-little-app');
    });

  });

  describe('toAppId', () => {

    it('translates a single word to lowercase', () => {
      expect(toAppId('MyApp')).to.equal('myapp');
    });

    it('replaces spaces with periods, translates to lowercase', () => {
      expect(toAppId('My Little App')).to.equal('my.little.app');
      expect(toAppId('My  Little\tApp')).to.equal('my.little.app');
    });

  });

  describe('toName', () => {

    it('replaces periods, dashes, and underscores with spaces, translates to titlecase', () => {
      expect(toName('my.little.app')).to.equal('My Little App');
      expect(toName('my-little-app')).to.equal('My Little App');
    });

    it('reduces subsequent spaces to single space', () => {
      expect(toName('My  Little\tApp')).to.equal('My Little App');
    });

  });

  describe('isValidAppId', () => {

    it('accepts valid app id, words separated by periods', () => {
      expect(isValidAppId('my.app.id')).to.be.true;
    });

    it('accepts id with two segments', () => {
      expect(isValidAppId('my.app')).to.be.true;
    });

    it('rejects id without periods (single word)', () => {
      expect(isValidAppId('myapp')).to.be.false;
    });

    it('rejects ids with illegal periods', () => {
      expect(isValidAppId('my..app.id')).to.be.false;
      expect(isValidAppId('.my.app.id')).to.be.false;
      expect(isValidAppId('my.app.id.')).to.be.false;
    });

    it('rejects ids with invalid characters', () => {
      expect(isValidAppId('my-app-id')).to.be.false;
      expect(isValidAppId('my app id')).to.be.false;
      expect(isValidAppId('my*app*id')).to.be.false;
      expect(isValidAppId('my.app.!d')).to.be.false;
      expect(isValidAppId('my.@pp.id')).to.be.false;
      expect(isValidAppId('m$.app.id')).to.be.false;
    });

  });

});

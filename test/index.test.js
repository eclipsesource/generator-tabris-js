import {describe, it} from 'mocha';
import {expect} from 'chai';
import assert from 'yeoman-assert';
import * as generator from '../app/index';

describe('Package files:', () => {

  it('exists on the file system', () => {
    assert.file(['package.json', '.eslintrc', '.babelrc', '.editorconfig', 'README.md', 'app/index.js']);
  });

  it('contains the tabris homepage in the package.json', () => {
    assert.fileContent('package.json', /"homepage": "http:\/\/tabrisjs.com\/"/);
  });

  it('contains an entry point in the package.json', () => {
    assert.fileContent('package.json', /"main": "app\/index.js"/);
  });

  it('contains licence info in the README', () => {
    assert.fileContent('README.md', /License/);
  });

  it('exports an object from the generator (app/index.js)', () => {
    expect(generator).to.be.a('Object');
  });

});

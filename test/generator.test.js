const {join} = require('path');
const {readFileSync} = require('fs');
const {describe, it} = require('mocha');
const {expect} = require('chai');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('Generator (JS)', function() {

  beforeEach(function() {
    return helpers.run(join(__dirname, '../app')).withPrompts({
      proj_type: 'js',
      name: 'foo'
    });
  });

  it('creates package.json with correct content', function() {
    let json = JSON.parse(readFileSync('package.json', {encoding: 'utf-8'}));
    expect(json.name).to.equal('foo');
    expect(json.version).to.equal('0.1.0');
    expect(json.main).to.equal('src/app.js');
    expect(json.scripts.test).to.equal('eslint .');
    expect(json.scripts.start).to.equal('tabris serve');
  });

  it('creates config.xml with correct id and version', function() {
    assert.fileContent('cordova/config.xml', '<widget id="example.foo" version="0.1.0">');
  });

  it('creates other files', function() {
    assert.file(['.gitignore', '.eslintrc', 'src/app.js']);
  });

});

describe('Generator (TS)', function() {

  beforeEach(function() {
    return helpers.run(join(__dirname, '../app')).withPrompts({
      proj_type: 'ts',
      name: 'foo'
    });
  });

  it('creates config.xml with correct id and version', function() {
    assert.fileContent('cordova/config.xml', '<widget id="example.foo" version="0.1.0">');
  });

  it('creates package.json with correct content', function() {
    let json = JSON.parse(readFileSync('package.json', {encoding: 'utf-8'}));
    expect(json.name).to.equal('foo');
    expect(json.version).to.equal('0.1.0');
    expect(json.main).to.equal('dist/app.js');
    expect(json.scripts.test).to.equal("tslint 'src/**/*.ts'");
    expect(json.scripts.build).to.equal('tsc -p .');
    expect(json.scripts.start).to.equal('tabris serve');
  });

  it('creates other files', function() {
    assert.file(['.gitignore', 'tslint.json', 'src/app.ts']);
  });

});

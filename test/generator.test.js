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
      ide_type: 'vsc',
      app_name: 'foo'
    });
  });

  it('creates package.json with correct content', function() {
    const json = JSON.parse(readFileSync('package.json', {encoding: 'utf-8'}));
    expect(json.main).to.equal('src/app.js');
    expect(json.scripts.test).to.equal('eslint .');
    expect(json.scripts.start).to.equal('tabris serve -a');
  });

  it('creates config.xml with correct id and version', function() {
    assert.fileContent('cordova/config.xml', /<widget id=".+.foo" version="0.1.0">/);
  });

  it('creates other files', function() {
    assert.file(['.gitignore', '.tabrisignore', '.eslintrc', 'src/app.js', '.vscode/tasks.json']);
  });

});

describe('Generator (TS)', function() {

  beforeEach(function() {
    return helpers.run(join(__dirname, '../app')).withPrompts({
      proj_type: 'ts',
      ide_type: 'vsc',
      app_name: 'foo'
    });
  });

  it('creates config.xml with correct id and version', function() {
    assert.fileContent('cordova/config.xml', /<widget id=".+.foo" version="0.1.0">/);
  });

  it('creates package.json with correct content', function() {
    const json = JSON.parse(readFileSync('package.json', {encoding: 'utf-8'}));
    expect(json.main).to.equal('dist/app.js');
    expect(json.scripts.test).to.equal('npm run build && npm run lint');
    expect(json.scripts.lint).to.equal('tslint --project .');
    expect(json.scripts.build).to.equal('tsc -p .');
    expect(json.scripts.start).to.equal('tabris serve -a -w');
    expect(json.scripts.watch).to.equal('tsc -p . -w --preserveWatchOutput');
  });

  it('creates other files', function() {
    assert.file(['.gitignore', '.tabrisignore', 'tslint.json', 'src/app.tsx', '.vscode/tasks.json']);
  });

});

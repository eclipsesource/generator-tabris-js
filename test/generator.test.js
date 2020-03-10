const {join} = require('path');
const {readFileSync} = require('fs');
const {describe, it} = require('mocha');
const {expect} = require('chai');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('Generator (3.x, JS)', function() {

  this.timeout(10000);

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
    expect(json.scripts.mocha).to.be.undefined;
    expect(json.scripts.start).to.equal('tabris serve -a');
  });

  it('creates settings.json with correct content', function() {
    const json = JSON.parse(readFileSync('.vscode/settings.json', {encoding: 'utf-8'}));
    expect(json['tslint.jsEnable']).to.be.false;
    expect(json['eslint.enable']).to.be.true;
  });

  it('creates config.xml with correct id and version', function() {
    assert.fileContent('cordova/config.xml', /<widget id=".+.foo" version="0.1.0">/);
  });

  it('creates extensions.json with correct content', function() {
    const json = JSON.parse(readFileSync('.vscode/extensions.json', {encoding: 'utf-8'}));
    expect(json.recommendations).to.deep.equal(['dbaeumer.vscode-eslint']);
  });

  it('creates launch.json with correct content', function() {
    const json = JSON.parse(readFileSync('.vscode/launch.json', {encoding: 'utf-8'}));
    expect(json.version).to.equal('0.2.0');
    expect(json.configurations[0].name).to.equal('Debug Tabris on Android');
    expect(json.configurations[0].address).to.equal('${input:debugAddress}');
    expect(json.inputs[0].id).to.equal('debugAddress');
  });

  it('creates settings.json with correct content', function() {
    const json = JSON.parse(readFileSync('.vscode/settings.json', {encoding: 'utf-8'}));
    expect(json['tslint.jsEnable']).to.be.false;
    expect(json['eslint.enable']).to.be.true;
  });

  it('creates .tabrisignore with correct content', function() {
    const files = readFileSync('.tabrisignore', {encoding: 'utf-8'}).split('\n');
    expect(files).to.not.include('src/');
    expect(files).to.include('.eslintrc');
    expect(files).to.include('.gitignore');
    expect(files).to.include('.vscode/');
    expect(files).to.include('node_modules/**/*.d.ts');
    expect(files).to.include('node_modules/tabris/ClientMock.js');
    expect(files).to.include('package-lock.json');
    expect(files).to.include('README.md');
  });

  it('creates .gitignore with correct content', function() {
    const files = readFileSync('.gitignore', {encoding: 'utf-8'}).split('\n');
    expect(files).to.not.include('/dist/');
    expect(files).to.include('/build/');
    expect(files).to.include('node_modules/');
  });

  it('creates README.md with correct content', function() {
    const readme = readFileSync('README.md', {encoding: 'utf-8'});
    expect(readme).to.include('# foo');
    expect(readme).to.include('## Run');
    expect(readme).to.include('## Test');
    expect(readme).to.include('## Debugging');
    expect(readme).to.include('## Build');
    expect(readme).not.to.include('unit tests');
    expect(readme).to.match(/https\:\/\/docs\.tabris\.com\/3\.[0-9]\/developer\-app\.html/);
    expect(readme).to.match(/https\:\/\/docs\.tabris\.com\/3\.[0-9]\/debug\.html#android/);
    expect(readme).to.match(/https\:\/\/docs\.tabris\.com\/3\.[0-9]\/debug\.html#ios/);
  });

  it('creates other files', function() {
    assert.file(['.eslintrc', 'src/app.js', '.vscode/tasks.json']);
  });

});

describe('Generator (3.x TS)', function() {

  this.timeout(10000);

  beforeEach(function() {
    return helpers.run(join(__dirname, '../app')).withPrompts({
      proj_type: 'ts',
      ide_type: 'vsc',
      app_name: 'foo',
      tests: 'mocha',
      example: 'tsx'
    });
  });

  it('creates config.xml with correct id and version', function() {
    assert.fileContent('cordova/config.xml', /<widget id=".+.foo" version="0.1.0">/);
  });

  it('creates package.json with correct content', function() {
    const json = JSON.parse(readFileSync('package.json', {encoding: 'utf-8'}));
    expect(json.main).to.equal('dist');
    expect(json.scripts.lint).to.equal('tslint --project . -t verbose');
    expect(json.scripts.test).to.equal('npm run build && npm run lint && npm run mocha');
    expect(json.scripts.mocha).to.equal('mocha --require ts-node/register ./test/*.test.*');
    expect(json.scripts.build).to.equal('tsc -p .');
    expect(json.scripts.start).to.equal('tabris serve -a -w');
    expect(json.scripts.watch).to.equal('tsc -p . -w --preserveWatchOutput --inlineSourceMap');
  });

  it('creates extensions.json with correct content', function() {
    const json = JSON.parse(readFileSync('.vscode/extensions.json', {encoding: 'utf-8'}));
    expect(json.recommendations).to.deep.equal([
      'ms-vscode.vscode-typescript-tslint-plugin',
      'hbenl.vscode-mocha-test-adapter'
    ]);
  });

  it('creates launch.json with correct content', function() {
    const json = JSON.parse(readFileSync('.vscode/launch.json', {encoding: 'utf-8'}));
    expect(json.configurations.length).to.equal(3);
  });

  it('creates settings.json with correct content', function() {
    const json = JSON.parse(readFileSync('.vscode/settings.json', {encoding: 'utf-8'}));
    expect(json).to.deep.equal({
      'mochaExplorer.require': 'ts-node/register',
      'mochaExplorer.files': 'test/**/*.test.*',
      'typescript.tsdk': 'node_modules/typescript/lib',
      'javascript.implicitProjectConfig.experimentalDecorators': true,
      'tslint.jsEnable': true,
      'eslint.enable': false
    });
  });

  it('creates .tabrisignore with correct content', function() {
    const files = readFileSync('.tabrisignore', {encoding: 'utf-8'}).split('\n');
    expect(files).to.include('src/');
    expect(files).to.include('tslint.json');
    expect(files).to.include('tsconfig.json');
    expect(files).to.include('.gitignore');
    expect(files).to.include('.vscode/');
    expect(files).to.include('node_modules/**/*.d.ts');
    expect(files).to.include('node_modules/tabris/ClientMock.js');
    expect(files).to.include('package-lock.json');
    expect(files).to.include('README.md');
  });

  it('creates .gitignore with correct content', function() {
    const files = readFileSync('.gitignore', {encoding: 'utf-8'}).split('\n');
    expect(files).to.include('/dist/');
    expect(files).to.include('/build/');
    expect(files).to.include('node_modules/');
  });

  it('creates README.md with correct content', function() {
    const readme = readFileSync('README.md', {encoding: 'utf-8'});
    expect(readme).to.include('# foo');
    expect(readme).to.include('## Run');
    expect(readme).to.include('## Test');
    expect(readme).to.include('## Debugging');
    expect(readme).to.include('## Build');
    expect(readme).to.include(
      '\n\nTabris.js unit tests support any debugger that works with Node.js. In Visual '
    );
    expect(readme).to.include('in the debug sidebar.\n\n#');
    expect(readme).to.match(/https\:\/\/docs\.tabris\.com\/3\.[0-9]\/developer\-app\.html/);
    expect(readme).to.match(/https\:\/\/docs\.tabris\.com\/3\.[0-9]\/debug\.html#android/);
    expect(readme).to.match(/https\:\/\/docs\.tabris\.com\/3\.[0-9]\/debug\.html#ios/);
  });

  it('creates other files', function() {
    assert.file([
      'tslint.json',
      'src/App.tsx',
      'src/index.ts',
      '.vscode/tasks.json',
      'test/sandbox.ts',
      'test/sandbox.test.ts',
      'test/App.test.ts'
    ]);
  });

});

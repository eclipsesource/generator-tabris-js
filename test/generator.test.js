const {join} = require('path');
const {readFileSync, renameSync} = require('fs');
const {describe, it} = require('mocha');
const {expect} = require('chai');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('Generator', function() {

  this.timeout(300000);

  /** @type {import('yeoman-test').RunContext} */
  let runContext;

  after(function() {
    runContext.cleanTestDirectory();
  });

  async function runGenerator({type, keepNodeModules: keep, example, tests}) {
    const oldContext = runContext;
    const oldModules = join(process.cwd(), 'node_modules');
    const config = ['vsc'];
    if (tests) {
      config.push('mocha');
    }
    runContext = helpers.run(join(__dirname, '../app')).withOptions({
      skipInstall: !!keep,
      forceInstall: true,
      force: true
    }).withPrompts({
      app_name: 'foo',
      config,
      template: type === 'js' ? 'js' : example || 'tsx'
    });
    await runContext;
    if (keep) {
      renameSync(oldModules, join(process.cwd(), 'node_modules'));
    }
    if (oldContext) {
      oldContext.cleanTestDirectory();
    }
  }

  function lint(files) {
    const eslint = require(process.cwd() + '/node_modules/eslint');
    const cli = new eslint.CLIEngine({extensions: ['.js', '.jsx', '.ts', '.tsx']});
    return cli.executeOnFiles(files);
  }

  describe('creates vanilla JavaScript projects', function() {

    before(() => runGenerator({type: 'js'}));

    it('creates package.json with correct content', function() {
      const json = JSON.parse(readFileSync('package.json', {encoding: 'utf-8'}));
      expect(json.main).to.equal('src/app.js');
      expect(json.scripts.test).to.equal('eslint .');
      expect(json.scripts.mocha).to.be.undefined;
      expect(json.scripts.start).to.equal('tabris serve -a');
    });

    it('creates settings.json with correct content', function() {
      const json = JSON.parse(readFileSync('.vscode/settings.json', {encoding: 'utf-8'}));
      expect(json['mochaExplorer.require']).to.be.undefined;
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

    it('creates .tabrisignore with correct content', function() {
      const files = readFileSync('.tabrisignore', {encoding: 'utf-8'}).split('\n');
      expect(files).to.not.include('src/');
      expect(files).to.include('.eslintrc');
      expect(files).to.include('.gitignore');
      expect(files).to.include('.vscode/');
      expect(files).to.include('node_modules/**/*.d.ts');
      expect(files).to.include('node_modules/tabris/ClientMock.js');
      expect(files).to.include('README.md');
      expect(files).not.to.include('package-lock.json');
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
      expect(readme).to.match(/https:\/\/docs\.tabris\.com\/3\.[0-9]\/developer-app\.html/);
      expect(readme).to.match(/https:\/\/docs\.tabris\.com\/3\.[0-9]\/debug\.html#android/);
      expect(readme).to.match(/https:\/\/docs\.tabris\.com\/3\.[0-9]\/debug\.html#ios/);
    });

    it('creates other files', function() {
      assert.file(['.eslintrc', 'src/app.js', '.vscode/tasks.json']);
    });

    it('creates code passing eslint check', function() {
      expect(lint('src')).to.include({warningCount: 0, errorCount: 0});
    });

  });

  describe('generates TypeScript-compiled projects', function() {

    describe('without mocha tests', function() {

      before(() => runGenerator({type: 'ts'}));

      it('creates config.xml with correct id and version', function() {
        assert.fileContent('cordova/config.xml', /<widget id=".+.foo" version="0.1.0">/);
      });

      it('creates package.json with correct content', function() {
        const json = JSON.parse(readFileSync('package.json', {encoding: 'utf-8'}));
        expect(json.main).to.equal('dist');
        expect(json.scripts.lint).to.equal('eslint --ext .js,.jsx,.ts,.tsx src');
        expect(json.scripts.test).to.equal('npm run build && npm run lint');
        expect(json.scripts.mocha).to.be.undefined;
        expect(json.scripts.build).to.equal('tsc -p .');
        expect(json.scripts.start).to.equal('tabris serve -a -w');
        expect(json.scripts.watch).to.equal('tsc -p . -w --preserveWatchOutput --inlineSourceMap');
      });

      it('creates extensions.json with correct content', function() {
        const json = JSON.parse(readFileSync('.vscode/extensions.json', {encoding: 'utf-8'}));
        expect(json.recommendations).to.deep.equal(['dbaeumer.vscode-eslint']);
      });

      it('creates launch.json with correct content', function() {
        const json = JSON.parse(readFileSync('.vscode/launch.json', {encoding: 'utf-8'}));
        expect(json.configurations.length).to.equal(1);
      });

      it('creates settings.json with correct content', function() {
        const json = JSON.parse(readFileSync('.vscode/settings.json', {encoding: 'utf-8'}));
        expect(json).to.deep.equal({
          'typescript.tsdk': 'node_modules/typescript/lib',
          'javascript.implicitProjectConfig.experimentalDecorators': true,
          'eslint.enable': true
        });
      });

      it('creates .tabrisignore with correct content', function() {
        const files = readFileSync('.tabrisignore', {encoding: 'utf-8'}).split('\n');
        expect(files).to.include('src/');
        expect(files).to.not.include('test/');
        expect(files).to.include('.eslintrc');
        expect(files).to.include('tsconfig.json');
        expect(files).to.include('.gitignore');
        expect(files).to.include('.vscode/');
        expect(files).to.include('node_modules/**/*.d.ts');
        expect(files).to.include('node_modules/tabris/ClientMock.js');
        expect(files).to.include('README.md');
        expect(files).not.to.include('package-lock.json');
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
        expect(readme).not.to.include('unit tests');
        expect(readme).to.match(/https:\/\/docs\.tabris\.com\/3\.[0-9]\/developer-app\.html/);
        expect(readme).to.match(/https:\/\/docs\.tabris\.com\/3\.[0-9]\/debug\.html#android/);
        expect(readme).to.match(/https:\/\/docs\.tabris\.com\/3\.[0-9]\/debug\.html#ios/);
      });

      it('creates other files', function() {
        assert.file([
          '.eslintrc',
          'src/App.tsx',
          'src/index.ts',
          '.vscode/tasks.json'
        ]);
        assert.noFile([
          'test/tsconfig.json',
          'test/sandbox.ts',
          'test/sandbox.test.ts',
          'test/App.test.ts'
        ]);
      });

      it('lints js example', async function() {
        await runGenerator({type: 'ts', example: 'js', keepNodeModules: true});
        expect(lint('src')).to.include({warningCount: 0, errorCount: 0});
      });

      it('lints jsx example', async function() {
        await runGenerator({type: 'ts', example: 'jsx', keepNodeModules: true});
        expect(lint('src')).to.include({warningCount: 0, errorCount: 0});
      });

      it('lints tsx example', async function() {
        await runGenerator({type: 'ts', example: 'tsx', keepNodeModules: true});
        expect(lint('src')).to.include({warningCount: 0, errorCount: 0});
      });

      it('lints mvp example', async function() {
        await runGenerator({type: 'ts', example: 'mvp', keepNodeModules: true});
        expect(lint('src')).to.include({warningCount: 0, errorCount: 0});
      });

      it('lints mvvm example', async function() {
        await runGenerator({type: 'ts', example: 'mvvm', keepNodeModules: true});
        expect(lint('src')).to.include({warningCount: 0, errorCount: 0});
      });

    });

    describe('with mocha tests', function() {

      before(() => runGenerator({type: 'ts', tests: true}));

      it('creates config.xml with correct id and version', function() {
        assert.fileContent('cordova/config.xml', /<widget id=".+.foo" version="0.1.0">/);
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
        expect(readme).to.match(/https:\/\/docs\.tabris\.com\/3\.[0-9]\/developer-app\.html/);
        expect(readme).to.match(/https:\/\/docs\.tabris\.com\/3\.[0-9]\/debug\.html#android/);
        expect(readme).to.match(/https:\/\/docs\.tabris\.com\/3\.[0-9]\/debug\.html#ios/);
      });

      it('creates extensions.json with correct content', function() {
        const json = JSON.parse(readFileSync('.vscode/extensions.json', {encoding: 'utf-8'}));
        expect(json.recommendations).to.deep.equal([
          'dbaeumer.vscode-eslint',
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
          'eslint.enable': true
        });
      });

      it('creates .tabrisignore with correct content', function() {
        const files = readFileSync('.tabrisignore', {encoding: 'utf-8'}).split('\n');
        expect(files).to.include('src/');
        expect(files).to.include('test/');
        expect(files).to.include('.eslintrc');
        expect(files).to.include('tsconfig.json');
        expect(files).to.include('.gitignore');
        expect(files).to.include('.vscode/');
        expect(files).to.include('node_modules/**/*.d.ts');
        expect(files).to.include('node_modules/tabris/ClientMock.js');
        expect(files).to.include('README.md');
        expect(files).not.to.include('package-lock.json');
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
        expect(readme).to.match(/https:\/\/docs\.tabris\.com\/3\.[0-9]\/developer-app\.html/);
        expect(readme).to.match(/https:\/\/docs\.tabris\.com\/3\.[0-9]\/debug\.html#android/);
        expect(readme).to.match(/https:\/\/docs\.tabris\.com\/3\.[0-9]\/debug\.html#ios/);
      });

      it('creates other files', function() {
        assert.file([
          '.eslintrc',
          'src/App.tsx',
          'src/index.ts',
          '.vscode/tasks.json',
          'test/tsconfig.json',
          'test/sandbox.ts',
          'test/sandbox.test.ts',
          'test/App.test.ts'
        ]);
      });

      it('lints tsx example tests', async function() {
        await runGenerator({type: 'ts', example: 'tsx', keepNodeModules: true, tests: true});
        expect(lint('test')).to.include({warningCount: 0, errorCount: 0});
      });

      it('lints mvp example tests', async function() {
        await runGenerator({type: 'ts', example: 'mvp', keepNodeModules: true, tests: true});
        expect(lint('test')).to.include({warningCount: 0, errorCount: 0});
      });

      it('lints mvvm example tests', async function() {
        await runGenerator({type: 'ts', example: 'mvvm', keepNodeModules: true, tests: true});
        expect(lint('test')).to.include({warningCount: 0, errorCount: 0});
      });

    });

  });

});

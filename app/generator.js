const path = require('path');
const Generator = require('yeoman-generator');
const {toAppId, toName, isValidAppId} = require('./utilities.js');

const VERSION_REGEXP = /'([2-3]\..*)'/;

const TEMPLATES = [{
  name: 'Model-View-ViewModel (TypeScript/JSX)',
  value: 'mvvm'
}, {
  name: 'Model-View-Presenter (TypeScript/JSX)',
  value: 'mvp'
}, {
  name: 'Hello World (TypeScript/JSX)',
  value: 'tsx'
}, {
  name: 'Hello World (JavaScript/JSX)',
  value: 'jsx'
}, {
  name: 'Hello World (JavaScript)',
  value: 'js'
}];

const CONFIG = [
  {
    name: 'Visual Studio Code configuration',
    short: 'VS Code',
    value: 'vsc',
    checked: true
  }, {
    name: 'Set up unit tests with Mocha',
    short: 'Mocha',
    value: 'mocha',
    disabled: ({template}) =>
      (!template || template.startsWith('js')) ? 'Disabled: TypeScript only' : false
  }
];

module.exports = class extends Generator {

  prompting() {
    return this.prompt([{
      name: 'template',
      type: 'list',
      default: 'jsx',
      message: 'Template',
      choices: TEMPLATES
    }, {
      type: 'input',
      name: 'app_name',
      message: 'App name as it appears on the device\'s home screen:\n',
      default: toName(this.appname)
    }, {
      type: 'input',
      name: 'app_id',
      message: 'App ID',
      default: answers => toAppId(this.user, answers.app_name),
      validate: input => isValidAppId(input) ||
        'Invalid App ID, use alphanumeric characters and periods only, EG: com.domain.app'
    }, {
      type: 'checkbox',
      name: 'config',
      message: 'Additional options',
      choices: CONFIG
    }
    ]).then(answers => {
      const tsc = answers.template !== 'js';
      const tabrisLatest = this._npmVersion('tabris@latest').pop();
      this._props = {
        app_id: answers.app_id,
        example: answers.template,
        app_name: answers.app_name,
        proj_type: tsc ? 'ts' : 'js',
        main: tsc ? 'dist' : 'src/app.js',
        author_name: this.user.git.name() || 'John Smith',
        author_email: this.user.git.email() || 'john@example.org',
        tests: answers.config.indexOf('mocha') !== -1 ? 'mocha' : 'none',
        ide_type: answers.config.indexOf('vsc') !== -1 ? 'vsc' : 'none',
        tabris_install_version: tabrisLatest,
        tabris_doc_url: 'https://docs.tabris.com/' + this._removePatch(tabrisLatest)
      };
    });
  }

  writing() {
    this.sourceRoot(path.join(path.dirname(this.resolved), 'templates-3.x'));
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      this._props
    );
    this.fs.copyTpl(
      this.templatePath('cordova'),
      this.destinationPath('cordova'),
      this._props
    );
    this.fs.copyTpl(
      this.templatePath('_tabrisignore'),
      this.destinationPath('.tabrisignore'),
      this._props
    );
    this.fs.copyTpl(
      this.templatePath('_README.md'),
      this.destinationPath('README.md'),
      this._props
    );
    if (this._props.proj_type === 'ts') {
      this.fs.copyTpl(
        this.templatePath('ts/_gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copyTpl(
        this.templatePath(this._props.example ? 'ts/src-' + this._props.example : 'ts/src'),
        this.destinationPath('src'),
        this._props
      );
      this.fs.copyTpl(
        this.templatePath('ts/tsconfig.json'),
        this.destinationPath('tsconfig.json')
      );
      this.fs.copyTpl(
        this.templatePath('ts/_.eslintrc'),
        this.destinationPath('.eslintrc'),
        this._props
      );
      if (this._props.tests === 'mocha') {
        this.fs.copyTpl(
          this.templatePath('ts/test'),
          this.destinationPath('test'),
          this._props
        );
        this.fs.copyTpl(
          this.templatePath('ts/test-' + this._props.example),
          this.destinationPath('test'),
          this._props
        );
      }
    } else if (this._props.proj_type === 'js') {
      this.fs.copyTpl(
        this.templatePath('js/_gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copyTpl(
        this.templatePath('js/src'),
        this.destinationPath('src'),
        this._props
      );
      this.fs.copyTpl(
        this.templatePath('js/.eslintrc'),
        this.destinationPath('.eslintrc')
      );
    }
    if (this._props.ide_type === 'vsc') {
      this.fs.copyTpl(
        this.templatePath('.vscode'),
        this.destinationPath('.vscode'),
        this._props
      );
    }
  }

  install() {
    const version = this._props.tabris_install_version;
    this.npmInstall(['tabris@' + version], {
      savePrefix: '~'
    });
    if (this._props.example === 'mvp' || this._props.example === 'mvvm') {
      this.npmInstall(['tabris-decorators@' + version], {
        savePrefix: '~'
      });
    }
    this.npmInstall(['eslint'], {
      saveDev: true
    });
    if (this._props.proj_type === 'ts') {
      this.npmInstall(['typescript@3.8.x'], {
        saveDev: true,
        savePrefix: '~'
      });
      this.npmInstall([
        '@typescript-eslint/parser',
        '@typescript-eslint/eslint-plugin',
        'eslint-plugin-react'
      ], {
        saveDev: true
      });
    }
    if (this._props.tests === 'mocha') {
      this.npmInstall([
        'mocha',
        '@types/mocha',
        'sinon',
        'chai',
        '@types/sinon',
        'sinon-chai',
        '@types/sinon-chai',
        'ts-node'
      ], {
        saveDev: true
      });
    }
  }

  end() {
    console.log('Please check out README.md, or just type "npm start" to start :-)');
  }

  _npmVersion(moduleId) {
    return this.spawnCommandSync('npm', ['view', moduleId, 'version'], {stdio: 'pipe'}).stdout
      .toString()
      .split('\n')
      .filter(entry => !!entry)
      .sort()
      .map(entry => VERSION_REGEXP.test(entry) ? VERSION_REGEXP.exec(entry).pop() : entry);
  }

  _removePatch(version) {
    const [sem, postfix] = version.split('-');
    const semPart = sem.split('.').slice(0, 2).join('.');
    return semPart + (postfix ? '-' + postfix : '');
  }

};

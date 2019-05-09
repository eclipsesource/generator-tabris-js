const path = require('path');
const inquirer = require('inquirer');
const Generator = require('yeoman-generator');
const {toAppId, toName, isValidAppId} = require('./utilities.js');

const VERSION_REGEXP = /'([2-3]\..*)'/;

const PROJECT_TYPES = [
  new inquirer.Separator('   '),
  {
    name: 'Compiled (recommended)',
    short: 'Compiled',
    value: 'ts',
  },
  new inquirer.Separator(
    'Modern JavaScript, JSX and/or TypeScript.'
  ),
  new inquirer.Separator('   '),
  {
    name: 'Vanilla',
    value: 'js'
  },
  new inquirer.Separator('Runs JavaScript files as-is. No ES6 Modules, async/await or JSX.')
];

const IDE_TYPES = [{
  name: 'None',
  value: 'none'
}, {
  name: 'Visual Studio Code',
  value: 'vsc'
}];

const TEST_TYPES = [{
  name: 'None',
  value: 'none'
}, {
  name: 'Mocha with sinon/chai',
  short: 'Mocha',
  value: 'mocha',
}];

module.exports = class extends Generator {

  prompting() {
    return this.prompt([
      {
        type: 'list',
        name: 'tabris_version',
        message: 'Tabris.js Version',
        choices: ['3.x', '2.x']
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
        type: 'list',
        name: 'proj_type',
        message: 'Type of project?',
        choices: PROJECT_TYPES
      }, {
        type: 'list',
        name: 'ide_type',
        message: 'Additional IDE configuration? (e.g. launch options)',
        choices: IDE_TYPES
      }, {
        name: 'tests',
        type: 'list',
        message: 'Configure unit tests?',
        choices: TEST_TYPES,
        when: answers => answers.proj_type === 'ts' && answers.tabris_version === '3.x'
      }
    ]).then(answers => {
      const main = answers.proj_type === 'js' ? 'src/app.js' : 'dist';
      const author_name = this.user.git.name() || 'John Smith';
      const author_email = this.user.git.email() || 'john@example.org';
      const tests = answers.tests || 'none';
      const tabris_install_version = this._npmVersion('tabris@' + answers.tabris_version).pop();
      const tabris_doc_url = 'https://tabrisjs.com/documentation/' + this._removePatch(tabris_install_version);
      this._props = Object.assign(answers, {
        main,
        author_name,
        author_email,
        tests,
        tabris_install_version,
        tabris_doc_url
      });
    });
  }

  writing() {
    this.sourceRoot(path.join(path.dirname(this.resolved), 'templates-' + this._props.tabris_version));
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
        this.templatePath('ts/src'),
        this.destinationPath('src'),
        this._props
      );
      this.fs.copyTpl(
        this.templatePath('ts/tsconfig.json'),
        this.destinationPath('tsconfig.json')
      );
      this.fs.copyTpl(
        this.templatePath('ts/tslint.json'),
        this.destinationPath('tslint.json')
      );
      if (this._props.tests === 'mocha') {
        this.fs.copyTpl(
          this.templatePath('ts/test'),
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
        this.templatePath('js/.eslintrc'),
        this.destinationPath('.eslintrc')
      );
      this.fs.copyTpl(
        this.templatePath('js/src'),
        this.destinationPath('src'),
        this._props
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
    const preRelease = version.indexOf('-') !== -1;
    this.npmInstall(['tabris@' + version], {
      ['save' + (preRelease ? 'Exact' : 'Prod')]: true
    });
    if (this._props.proj_type === 'js') {
      this.npmInstall(['eslint'], {
        saveDev: true
      });
    } else if (this._props.proj_type === 'ts') {
      this.npmInstall(['typescript', 'tslint'], {
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

  _npmVersion(moduleId) {
    if (moduleId === 'tabris@3.x') {
      return ['3.0.0-rc1'];
    }
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

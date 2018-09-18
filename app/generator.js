const Generator = require('yeoman-generator');
const {toAppId, toName, isValidAppId} = require('./utilities.js');

const PROJECT_TYPES = [{
  name: '1 - JavaScript App',
  value: 'js'
}, {
  name: '2 - TypeScript App',
  value: 'ts'
}];

const IDE_TYPES = [{
  name: '1 - None',
  value: 'none'
}, {
  name: '2 - Visual Studio Code',
  value: 'vsc'
}];

module.exports = class extends Generator {

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'app_name',
        message: 'App name',
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
        message: 'Type of project',
        choices: PROJECT_TYPES
      }, {
        type: 'list',
        name: 'ide_type',
        message: 'Configure for IDE',
        choices: IDE_TYPES
      }
    ]).then(answers => {
      let main = answers.proj_type === 'js' ? 'src/app.js' : 'dist/app.js';
      let author_name = this.user.git.name() || 'John Smith';
      let author_email = this.user.git.email() || 'john@example.org';
      this._props = Object.assign(answers, {main, author_name, author_email});
    });
  }

  writing() {
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
        this.destinationPath('.vscode')
      );
    }
  }

  install() {
    this.npmInstall(['tabris@>=3.0.0 || >=3.0.0-beta1 || >=3.0.0-dev.20180918'], {
      save: true
    });
    if (this._props.proj_type === 'js') {
      this.npmInstall(['eslint'], {
        saveDev: true
      });
    } else if (this._props.proj_type === 'ts') {
      this.npmInstall(['typescript', 'tslint', 'npm-run-all'], {
        saveDev: true
      });
    }
  }

};

const Generator = require('yeoman-generator');
const {toId, toAppId, toName, isValidAppId} = require('./utilities.js');

const PROJECT_TYPES = [{
  name: 'JavaScript App',
  value: 'js'
}, {
  name: 'TypeScript App',
  value: 'ts'
}];

const IDE_TYPES = [{
  name: 'None',
  value: 'none'
}, {
  name: 'Visual Studio Code',
  value: 'vsc'
}];

module.exports = class extends Generator {

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname, // defaults to current working dir
        filter: toId
      }, {
        type: 'input',
        name: 'version',
        message: 'Initial version',
        default: '0.1.0'
      }, {
        type: 'list',
        name: 'proj_type',
        message: 'Type of project',
        choices: PROJECT_TYPES
      }, {
        type: 'input',
        name: 'app_id',
        message: 'App ID',
        default: answers => 'example.' + toAppId(answers.name),
        validate: input => isValidAppId(input) ||
          'Invalid App ID, use alphanumeric characters and periods only, EG: com.domain.app'
      }, {
        type: 'input',
        name: 'app_name',
        message: 'App name',
        default: answers => toName(answers.name)
      }, {
        type: 'input',
        name: 'app_description',
        message: 'App description',
        default: 'Example Tabris.js App'
      }, {
        type: 'input',
        name: 'author_name',
        message: 'Author',
        default: this.user.git.name
      }, {
        type: 'input',
        name: 'author_email',
        message: 'Email',
        default: this.user.git.email
      }, {
        type: 'list',
        name: 'ide_type',
        message: 'Configure for IDE',
        choices: IDE_TYPES
      }
    ]).then(answers => {
      let main = answers.proj_type === 'js' ? 'src/app.js' : 'dist/app.js';
      this._props = Object.assign(answers, {main});
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
    this.npmInstall(['tabris@2.0.0-beta2'], {
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

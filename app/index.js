var generators = require('yeoman-generator');

var projectTypes = [{
  name: 'Basic JS App',
  value: 'basic'
}, {
  name: 'ES6 App (using Babel transpiler)',
  short: 'ES6 App',
  value: 'es6'
}];

var props;

module.exports = generators.Base.extend({
  prompting: function() {
    var done = this.async();
    this.prompt([
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
        choices: projectTypes
      }, {
        type: 'confirm',
        name: 'prep_build',
        message: 'Prepare app build',
        default: true
      }, {
        when: answers => answers.prep_build,
        type: 'input',
        name: 'app_id',
        message: 'App ID',
        default: answers => answers.name
      }, {
        when: answers => answers.prep_build,
        type: 'input',
        name: 'app_name',
        message: 'App name',
        default: answers => toName(answers.name)
      }, {
        when: answers => answers.prep_build,
        type: 'input',
        name: 'app_description',
        message: 'App description',
        default: 'Example Tabris.js App'
      }, {
        when: answers => answers.prep_build,
        type: 'input',
        name: 'author_name',
        message: 'Author',
        default: this.user.git.name
      }, {
        when: answers => answers.prep_build,
        type: 'input',
        name: 'author_email',
        message: 'Email',
        default: this.user.git.email
      }
    ], (answers) => {
      props = answers;
      props.build = answers.proj_type === 'es6';
      props.main = answers.build ? 'dist/app.js' : 'app.js';
      done();
    });
  },

  writing: function() {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      props
    );
    if (props.prep_build) {
      this.fs.copyTpl(
        this.templatePath('cordova'),
        this.destinationPath('cordova'),
        props
      );
    }
    if (props.proj_type === 'es6') {
      this.fs.copyTpl(
        this.templatePath('es6/_gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copyTpl(
        this.templatePath('es6/src'),
        this.destinationPath('src'),
        props
      );
      this.fs.copyTpl(
        this.templatePath('es6/babel-*.json'),
        this.destinationRoot()
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('basic/_gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copyTpl(
        this.templatePath('basic/app.js'),
        this.destinationPath(props.main),
        props
      );
    }
  },

  install: function() {
    this.npmInstall(['tabris'], {
      save: true
    });
    if (props.proj_type === 'es6') {
      this.npmInstall(['babel-cli', 'babel-preset-es2015'], {
        saveDev: true
      });
    }
  }

});

function toId(string) {
  return string.replace(/\s+/g, '-').toLowerCase();
}

function toName(str) {
  return str.split(/[-_\s]+/)
    .filter(str => !!str)
    .map(word => word.charAt(0).toUpperCase() + word.substr(1))
    .join(' ');
}

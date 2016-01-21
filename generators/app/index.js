var generators = require('yeoman-generator');
var input = {};

module.exports = generators.Base.extend({
  prompting: function () {
    var done = this.async();
    this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Your project name',
      default : this.appname // Default to current folder name
    }, {
      type    : 'input',
      name    : 'entrypoint',
      message : 'Project entry point',
      default : 'app.js' // Default to current folder name
    }, {
      type    : 'input',
      name    : 'description',
      message : 'Project description'
    }], function (answers) {
      this.log("Creating Tabris.js app: " + answers.name +
               ", description: " + answers.description +
               " entry point: "  + answers.entrypoint);
      input = answers;
      done();
    }.bind(this));
  },

  writePackageJson: function () {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { name: input.name, description: input.description, entrypoint: input.entrypoint }
    );
  },
  
  writeApp: function () {
    this.fs.copyTpl(
      this.templatePath('app.js'),
      this.destinationPath(input.entrypoint),
      { name: input.name }
    );
  },

  installingTabrisJS: function() {
    this.npmInstall(['tabris'], { 'save': true });
  }

});

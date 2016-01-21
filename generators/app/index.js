var generators = require('yeoman-generator');
var exampleApps = [{
  name: 'Hello, World!',
  app: 'hello.js'
}, {
  name: 'None',
  app: 'app.js'
}];
var input = {};

module.exports = generators.Base.extend({
  prompting: function() {
    var done = this.async();
    this.prompt([{
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname // Default to current folder name
      }, {
        type: 'input',
        name: 'entrypoint',
        message: 'Project entry point',
        default: 'app.js'
      }, {
        type: 'input',
        name: 'description',
        message: 'Project description'
      }, {
        type: 'list',
        name: 'sample',
        message: 'Generator sample project',
        choices: exampleApps.map(e => e.name)
      }],
      function(answers) {
        input = answers;
        input.sampleApp = exampleApps.filter(e => e.name === answers.sample)[
          0].app;
        this.log("Creating Tabris.js app: " + answers.name +
          ", description: " + answers.description +
          " entry point: " + answers.entrypoint +
          " example: " + input.sampleApp);
        done();
      }.bind(this));
  },

  writePackageJson: function() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'), {
        name: input.name,
        description: input.description,
        entrypoint: input.entrypoint
      }
    );
  },

  writeApp: function() {
    this.fs.copyTpl(
      this.templatePath(input.sampleApp),
      this.destinationPath(input.entrypoint)
    );
  },

  installingTabrisJS: function() {
    this.npmInstall(['tabris'], {
      'save': true
    });
  }

});

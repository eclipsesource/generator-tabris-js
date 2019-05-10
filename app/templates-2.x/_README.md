# <%- app_name %>

## Run

If you haven't done so already, install the [Tabris CLI](https://www.npmjs.com/package/tabris-cli) on your machine:

```
npm i tabris-cli -g
```

Then in the project directory, type:

```
npm start
```
<% if (ide_type === 'vsc') { %>Or choose "npm: start" from the Visual Studio Code task runner to make compile errors appear in the "Problems" view.<% } %>

This will start a Tabris.js code server at a free port and print its URL to the console. The app code can then be [side-loaded](<%- tabris_doc_url %>/developer-app.html#run-your-app) in the [developer app](<%- tabris_doc_url %>/developer-app.html) by entering that URL.

Alternatively you can also call the Tabris CLI directly:
<% if (proj_type === 'ts') { %>
```
tabris serve -w
```

The `-w` switch starts the compiler in watch mode, meaning you do not have to re-start the server after each code change.
<% } else { %>
```
tabris serve
```
<% } %>
## Test

This project includes a <%- proj_type === 'ts' ? 'TSLint' : 'ESLint' %> configuration that helps preventing common mistakes in your code. Most IDEs can display <%- proj_type === 'ts' ? 'TSLint' : 'ESLint' %>-based hints directly in the editor, but you can also run the tool explicitly via:

```
npm test
```

<% if (proj_type === 'ts') { %>This will also check for compile errors.

<% } %>The initial rules defined in `<%- proj_type === 'ts' ? 'tslint.json' : '.eslintrc' %>` are supposed to warn against problematic patterns, but do not enforce a specific code style. You may want to [adjust them](<%- proj_type === 'ts' ? 'https://palantir.github.io/tslint/rules/' : 'https://eslint.org/docs/rules/' %>) according to your taste.

## Build

The app can be built using the online build service at [tabrisjs.com](https://tabrisjs.com) or locally using [Tabris.js CLI](https://www.npmjs.com/package/tabris-cli).

See [Building a Tabris.js App](<%- tabris_doc_url %>/build.html) for more information.

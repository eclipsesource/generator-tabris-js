# Tabris.js generator

[![Build Status](https://travis-ci.org/eclipsesource/generator-tabris-js.svg?branch=master)](https://travis-ci.org/eclipsesource/generator-tabris-js)

A [Yeoman](http://yeoman.io) generator for [Tabris.js](https://tabrisjs.com/) apps. It lets you quickly set up a new project with sensible defaults and best practices.

## Getting Started

Install yeoman, this generator, and an HTTP server for local testing:

```js
npm install -g yo generator-tabris-js http-server
```

Create your app in an empty directory:

```js
yo tabris-js
```

Run the app locally:

```
npm start
```

Get the [Tabris.js Developer App](https://tabrisjs.com/download) and point it to the URL the HTTP server has just opened (should be printed on the console).

## Documentation

Check out the [online documentation](https://tabrisjs.com/documentation/latest/) for APIs, examples, and build documentation.

## Contributing

To contribute to the Yeoman generator for tabris.js, begin by cloning this repository. Once cloned you can run `npm install` to install the required dependencies. Next install Yeoman using `npm install yo -g`. Finally you can install the local copy of the tabris.js generator using `npm link`. With the tabris.js generator installed, you can now run `yo  tabris-js` to start the generator.

```
git clone https://github.com/eclipsesource/generator-tabris-js.git
cd generator-tabris-js
npm install
npm install yo -g
npm link
```

You can make changes to generator and test them by using `npm link`. Finally, feel free to suggest changes in [GitHub Issues](https://github.com/eclipsesource/generator-tabris-js/issues), or send us a Pull Request.

## License

[BSD License](./LICENSE)

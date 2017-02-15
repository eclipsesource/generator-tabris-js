# How to contribute

At EclipseSource we love pull requests and third party contributions. 
The following guide will help you get started contributing to Tabris.js 
and Tabris.js tools.

# Getting Started

To contribute to the Tabris.js Generator, first begin by forking the project on 
GitHub. Once you have forked the project, clone it locally and create a new
feature branch for your work:
```
git checkout -b feature_branch_name
```

## Setting up the development environment
Once you have cloned the repository, run `npm install` and `npm install yo -g`.
Use `npm link` to update your local yeoman generator with the contents from
the Tabris.js Generator. When you make changes the source files, re-run
`npm link` to test them.

## Running the tests
The Tabris.js generator contains a small test suite. Run `npm run test` from
the root of the project to invoke the test suite.

## Submitting pull requests
If you wish to contribute changes back to the Tabris.js Generator, first push
your branch to github:
```
git push origin feature_branch_name -u
```


## Writing commit messages

Good commit messages are an essential part of a software system, they describe *how* the software was developed and provide traceability into each aspect of the system.

https://chris.beams.io/posts/git-commit/

# Contributing

Thank you for helping this project become a better library :)

- [Triage](#triage)
- [Reporting Bugs](#reporting-bugs)
- [Providing a feature request](#providing-a-feature-request)
- [Pull requests](#pull-requests)

## Triage

This is one of the easiest and most effective ways of helping out. If you see an open issue, try and reproduce the bug yourself, and comment with the result. If the issue is lacking any information to reproduce the bug, let the author know.

## Reporting Bugs

Open an issue, making sure to follow the bug report template.

## Providing a feature request

Open an issue, making sure to follow the Feature request template.

## Pull requests

### Getting started

- If there isn't one already, open an issue describing the bug or feature request that you are going to solve in your pull request.
- Create a fork of react-native-maps
  - If you already have a fork, make sure it is up to date
- Git clone your fork and run `yarn` in the base of the cloned repo to setup your local development environment.
- Create a branch from the master branch to start working on your changes.

### Committing

- When you made your changes, run `yarn lint` & `yarn test` to make sure the code you introduced doesn't cause any obvious issues.
- When you are ready to commit your changes, use the [Angular conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/#summary) convention for you commit messages, as we use your commits when releasing new versions.
- Use present tense: "add awesome component" not "added awesome component"
- Limit the first line of the commit message to 100 characters
- Reference issues and pull requests before committing

### Creating the pull request

- The title of the PR needs to follow the same conventions as your commit messages, as it might be used in case of a squash merge.
- Create the pull request against the beta branch.

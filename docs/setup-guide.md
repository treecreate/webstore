# Project Setup
This file describes the setup process of the repository, with the commands and steps needed to succesffuly recreate it

## General information
The repository is part of a Treecreate organization.\
It utilizes Github Project, Issues and pull requests for task management.\
Commits are made using [git-cz](https://github.com/streamich/git-cz), which replaces `git commit` and provides extra structure for making commits.\
This is used in combination with [semantic-release](https://github.com/semantic-release/semantic-release), which handles automatic creation of releasses
To use **git cz**, you have to install it globally with
```shell
npm install -g commitizen git-cz
commitizen init git-cz --save-dev --save-exact
```
If you install it locally, you will have to use `npx git cz` instead

## Workspace setup
Create a new workspace in the root folder of the repository
`npx create-nx-workspace@latest webstore`

Add docs explaning the setup of the workspace

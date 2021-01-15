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

### Java Project setup
*[guide](https://www.linkedin.com/pulse/integrating-spring-boot-application-inside-nx-workspace-tine-kondo/)* \
Install a dependancy for Java and Spring 
`npm install --save-dev @nxrocks/nx-spring-boot`
It seems like the dependancy uninstalls the nx-cloud one, so we install it again
`npm install --save-dev @nrwl/nx-cloud`

Generate a Java app
`nx g @nxrocks/nx-spring-boot:app api` \
When prompted to, choose **Maven**, **Jar**, **Java 11** and **Java**. \
GroupId is your domain, in our case it's **dk.treecreate** \
ArtifactId is the name of the app, **api** \
For the package name, we combine the domain and the app name **dk.treecreate.api** \
Description is quite self explanatory \
For the dependancies we don't pass anything, and we will simply add them by hand. Why? Because I'm lazy and this is less error-prone

### Angular Project Setup
Install a schematic for Angular `npm install --save-dev @nrwl/angular`

Generate a Angular app `nx generate @nrwl/angular:app webstore` \
When prompted to, choose the following: \
Stylesheet format: **CSS** \
Router: **Yes** *(We will need it in the future anyway, might as well add it)*

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/treecreate/webstore">
    <img src="assets/treecreate_logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Treecreate Webstore</h3>

  <p align="center">
    A web store where you can design and buy your own family tree, engraved in wood with a laser
    <br />
    <a href="https://github.com/treecreate/webstore/docs"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    ·
    <a href="https://github.com/treecreate/webstore/issues">Report Bug</a>
    ·
    <a href="https://github.com/treecreate/webstore/issues">Request Feature</a>
    ·
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [License](#license)
- [Contact](#contact)

<!-- ABOUT THE PROJECT -->

## About The Project

Treecreate webstore is a monorepo consiting of multiple apps working together

Key points

- An api built with Java Springboot, with MySQL for persistance
- A frontend app built with Angular
- All apps are contained within a NX monorepo for easy management

This project is an improved version of our [previous repository](https://github.com/Kwandes/treecreate), with the frontend and backend split into seperate apps.

### Built With

- [NX](https://nx.dev/) - a modern mono-repo generation and management tool
- [Java Springboot](https://spring.io/projects/spring-boot) and a [NX schematic for it](https://github.com/tinesoft/nxrocks/tree/develop/packages/nx-spring-boot)
- [Angular](https://angular.io/)

<!-- GETTING STARTED -->

## Getting Started

The repository is made as a monorepo using NX. The applications are located in the /apps directory

### Prerequisites

- npm

```sh
npm install npm@latest -g
```

- nx

```sh
npm install nx
```

Commits are made with `git-cz`, a wrapper for `git commit`

```shell
npm install -g commitizen
npm install -g git-cz
commitizen init git-cz --save-dev --save-exact
```

_If you install it locally, you will have to use `npx git cz` instead_

### Installation

1. Clone the repo

```sh
git clone https://github.com/treecreate/webstore.git
```

2. Install NPM packages

```sh
npm install
```

3. Serve the apps via NX
   _some of the apps require extra environment setup_

```
nx serve api
nx serve webstore
```

<!-- CONTACT -->

## Contact

Email: info@treecreate.dk\
[Facebook](https://www.facebook.com/TreeCreate.dk)\
[Instagram](https://www.instagram.com/treecreate.dk)

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[product-screenshot]: assets/screenshot.gif

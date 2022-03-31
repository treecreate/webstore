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
  - [API documentation](#api-documentation)
- [License](#license)
- [Contact](#contact)

<!-- ABOUT THE PROJECT -->

## About The Project

Treecreate webstore is a monorepo consisting of multiple apps working together

Key points

- An api built with Java Springboot, with MySQL for persistance
- A frontend app built with Angular
- All apps are contained within a NX monorepo for easy management

This project is an improved version of our [previous repository](https://github.com/Kwandes/treecreate), with the frontend and backend split into separate apps.

### Built With

- [NX](https://nx.dev/) - a modern mono-repo generation and management tool
- [Java Springboot](https://spring.io/projects/spring-boot) and a [NX schematic for it](https://github.com/tinesoft/nxrocks/tree/develop/packages/nx-spring-boot)
- [Angular](https://angular.io/)

<!-- GETTING STARTED -->

## Getting Started

The repository is made as a monorepo using NX. The applications are located in the /apps directory

### Prerequisites

In order to run this project locally and develop it, you need to have Node and JDK 11 installed.

#### Node

We strongly suggest installing Node via NVM.\
It allows easy updates of Node, which is critical for NX to work properly. We develop using the latest stable releases.

- [Get NVM for Linux/Mac](https://github.com/nvm-sh/nvm)
- [Get NVM for Windows](https://github.com/coreybutler/nvm-windows)

#### Java

We develop with Java 11. Make sure your JDK is >= 11.

#### Other

- npm

```sh
npm install npm@latest -g
```

- nx

```sh
npm install -g nx
```

Commits are made with `git-cz`, a wrapper for `git commit`

```shell
npm install -g git-cz
```

_If you install it locally, you will have to use `npx git cz` instead_

### Installation

#### 1. Clone the repo

```sh
git clone https://github.com/treecreate/webstore.git
```

#### 2. Serve the API

The API requires the following Envirnonment variables to run.
Not all variables need to have values but have to exist.

`TREECREATE_JDBC_URL` - url for connecting to the database. Follows a format of `jdbc:mysql://username:password@hostname:port/schema?serverTimezone\=UTC&characterEncoding\=UTF-8`

`TREECREATE_MAIL_PASS` - password for the mail provider

> Only needed for sending emails

`TREECREATE_QUICKPAY_API_KEY` - api key for the Quickpay account

> Only needed for processing payment-related data

`TREECREATE_QUICKPAY_PRIVATE_KEY` - private key for the Quickpay account

> Only needed for processing payment-related data

`TREECREATE_SENTRY_DSN` - DSN key for Sentry, a logging service. Leave blank to not send any data

`SHIPMONDO_URL` - `https://app.shipmondo.com/api/public/v3`

> Only needed for processing shipping information

`SHIPMONDO_TOKEN`- Shipmondo api key. Follows instrucions in shipmondo documentation to obtain and format it properly (should look like so: `Basic base64enconded-username:password`)

> Only needed for processing shipping information

**Serving API with IntelliJ Idea**

When run through Intellij Idea, set the variables in the run configuration.

**Serving API with NX**

When run with NX, create a `.env` file in the root directory and fill out values based on the [.env.template file](.env.template).

Once you create and fill out the `.env` file, you can serve the api with the following command:

```sh
nx serve api
```

**Serving API with Visual Studio Code**

Running through Visual Studio Code is not tested and depends on what java extension you use.

#### 3. Install NPM packages

```sh
npm install
```

4. Serve the frontend apps via NX

```
nx serve webstore
nx serve admin-page
```

## Api Documentation

The api features auto-generated documentation using Swagger UI.\
It can be accessed at [`localhost:5050/docs`](localhost:5050/docs) when the api is running

<!-- CONTACT -->

## How to set this up yourself

Are you interested how we set up the project and what commands we used? Checkout [our setup guide](docs/setup-guide.md)

## Contact

Email: info@treecreate.dk\
[Facebook](https://www.facebook.com/TreeCreate.dk)\
[Instagram](https://www.instagram.com/treecreate.dk)

<!-- LICENSE -->

## License

Distributed under the BSD-3-Clause License. See [LICENSE](./LICENSE) for more information.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[product-screenshot]: assets/screenshot.gif

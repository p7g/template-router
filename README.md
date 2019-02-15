# template-router

[![Known Vulnerabilities](https://snyk.io/test/github/p7g/template-router/badge.svg?targetFile=package.json)](https://snyk.io/test/github/p7g/template-router?targetFile=package.json)
[![Build Status](https://travis-ci.com/p7g/template-router.svg?branch=master)](https://travis-ci.com/p7g/template-router)
[![codecov](https://codecov.io/gh/p7g/template-router/branch/master/graph/badge.svg)](https://codecov.io/gh/p7g/template-router)

Define routes for express, koa-router or similar using tagged template literals.

## Example

```js
const express = require('express');
const routes = require('template-router');

const app = express();

routes(app)`
  GET /hello/:name ${
    function sayHello(req, res) {
      const name = req.params.name;
      res.send(`Hello, ${name}`);
    }
  }

  POST ${/some regex/} ${
    function doPostThing(req, res) {
      // ...
    }
  }
`;

app.listen(8080);
```
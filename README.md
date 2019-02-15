# template-router

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
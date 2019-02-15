const test = require('ava');
const express = require('express');
const fetch = require('node-fetch');
const routes = require('../src/routes');

test('calls router method with correct arguments', (t) => {
  t.plan(2);

  const expectedRoute = '/hullo/:name';
  const expectedHandler = () => 'hullo';

  const mockRouter = {
    get(route, handler) {
      t.is(route, expectedRoute);
      t.is(handler, expectedHandler);
    },
  };

  // eslint-disable-next-line no-unused-expressions
  routes(mockRouter)`
    GET /hullo/:name ${expectedHandler}
  `;
});

test('multiple routes', (t) => {
  t.plan(4);

  const expectedRoute1 = '/hullo/:name';
  function expectedHandler1(req, res) {
    res.send(`Hullo, ${req.params.name}`);
  }

  const expectedRoute2 = '/abc/123';
  function expectedHandler2(req, res) {
    res.send('abc123');
  }

  const mockRouter = {
    get(route, handler) {
      t.is(route, expectedRoute1);
      t.is(handler, expectedHandler1);
    },

    post(route, handler) {
      t.is(route, expectedRoute2);
      t.is(handler, expectedHandler2);
    },
  };

  return routes(mockRouter)`
    GET /hullo/:name ${expectedHandler1}

    POST /abc/123 ${expectedHandler2}
  `;
});

test('multiple methods', (t) => {
  t.plan(2);

  return routes({
    get() {
      t.pass();
    },
    post() {
      t.pass();
    },
  })`
    GET, POST / ${a => a}
  `;
});

test('multiple paths', (t) => {
  t.plan(2);

  const paths = ['/a', '/b'];

  const mockRouter = {
    get(path) {
      t.is(path, paths.shift());
    },
  };

  return routes(mockRouter)`
    GET /a, /b ${a => a}
  `;
});

test('multiple methods and paths', (t) => {
  t.plan(4);

  const paths1 = ['/a', '/b'];
  const paths2 = ['/a', '/b'];

  const mockRouter = {
    get(path) {
      t.is(path, paths1.shift());
    },
    post(path) {
      t.is(path, paths2.shift());
    },
  };

  return routes(mockRouter)`
    GET, POST /a, /b ${a => a}
  `;
});

test('multiple handlers', (t) => {
  t.plan(2);

  const mockRouter = {
    get(_path, ...handlers) {
      handlers.forEach(h => h());
    },
  };

  return routes(mockRouter)`
    GET / ${[
    () => t.pass(),
    () => t.pass(),
  ]}
  `;
});

test('variable method', (t) => {
  t.plan(1);

  const mockRouter = {
    notAMethod() {
      t.pass();
    },
  };

  return routes(mockRouter)`
    ${'notAMethod'} / ${a => a}
  `;
});

test('variable path', (t) => {
  t.plan(1);

  const re = /hullo/;

  const mockRouter = {
    get(path) {
      t.is(re, path);
    },
  };

  return routes(mockRouter)`
    GET ${re} ${a => a}
  `;
});

test('variable method and path', (t) => {
  t.plan(1);

  const re = /hullo/;

  const mockRouter = {
    hullo(path) {
      t.is(re, path);
    },
  };

  return routes(mockRouter)`
    ${'hullo'} ${re} ${a => a}
  `;
});

test('variable method list', (t) => {
  t.plan(2);

  const mockRouter = {
    hullo() {
      t.pass();
    },
    goodbye() {
      t.pass();
    },
  };

  return routes(mockRouter)`
    ${'hullo'}, ${'goodbye'} / ${a => a}
  `;
});

test('variable path list', (t) => {
  t.plan(2);

  const re1 = /test/;
  const re2 = /abc/;

  const res = [re1, re2];

  const mockRouter = {
    get(path) {
      if (res.includes(path)) {
        t.pass();
        res.splice(res.indexOf(path), 1);
        return;
      }
      t.fail();
    },
  };

  return routes(mockRouter)`
    GET ${re1}, ${re2} ${a => a}
  `;
});

test('works with express', async (t) => {
  t.plan(1);
  const app = express();

  /* eslint-disable no-unused-expressions, indent */
  routes(app)`
    GET /hullo/:name ${
      function testHandler(req, res) {
        res.send(`Hullo, ${req.params.name}`);
      }
    }
  `;
  /* eslint-enable */

  const server = app.listen(8081);

  await fetch('http://localhost:8081/hullo/yourNameHere')
    .then(res => res.text())
    .then(text => t.is('Hullo, yourNameHere', text));

  server.close();
});

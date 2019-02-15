const methods = [
  'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'CONNECT',
];

function parse(tokenLists, values) {
  if (!tokenLists || !values) {
    throw new Error();
  }
  const routes = [];

  while (tokenLists.length) {
    const route = {
      methods: [],
      paths: [],
      handler: null,
    };

    let tokens = tokenLists.shift();
    // read methods
    let token = tokens.shift();
    do {
      if (token && token.type === 'comma') {
        token = tokens.shift();
      }
      if (token === undefined) {
        if (values.length === 0) {
          throw new SyntaxError('Expected method or interpolated value');
        }
        route.methods.push(values.shift());
        tokens = tokenLists.shift();
      } else {
        if (token.type !== 'identifier') {
          throw new SyntaxError(`Expected identifier, found ${token.type}`);
        }

        const { name } = token;
        if (!methods.includes(name)) {
          throw new SyntaxError(`Expected HTTP method, found ${name}`);
        }

        route.methods.push(name.toLowerCase());
      }

      token = tokens && tokens.shift();
    } while (token && token.type === 'comma');

    // read paths
    do {
      if (token && token.type === 'comma') {
        token = tokens.shift();
      }
      if (token === undefined) {
        if (values.length === 0) {
          throw new SyntaxError('Expected method or interpolated value');
        }
        route.paths.push(values.shift());
        tokens = tokenLists.shift();
      } else {
        if (token.type !== 'identifier') {
          throw new SyntaxError(`Expected identifier, found ${token.type}`);
        }

        const { name } = token;

        route.paths.push(name);
      }

      token = tokens && tokens.shift();
    } while (token && token.type === 'comma');

    const handler = values.shift();
    if (handler === undefined) {
      throw new SyntaxError('Expected handler');
    }

    route.handler = Array.isArray(handler) ? handler : [handler];
    routes.push(route);
  }

  return routes;
}

module.exports = parse;

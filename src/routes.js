const parse = require('./parser');
const lex = require('./lexer');

module.exports = function routes(router) {
  return function parseTemplate(strings, ...handlers) {
    const routeObjects = parse(strings.slice(0, -1).map(lex), handlers);

    return routeObjects.reduce(
      (acc, { methods, paths, handler }) => methods.reduce(
        (acc1, method) => paths.reduce(
          (acc2, path) => (acc2 || router)[method](path, ...handler),
          acc1,
        ),
        acc,
      ),
      router,
    ) || router;
  };
};

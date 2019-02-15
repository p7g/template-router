const Parser = require('./parser');
const Lexer = require('./lexer');

const lex = string => (new Lexer(string)).lex();

module.exports = function routes(router) {
  return function parseTemplate(strings, ...values) {
    const routeObjects = (new Parser(strings.slice(0, -1).map(lex), values)).parse();

    return routeObjects.reduce(
      (acc, { methods, paths, handlers }) => methods.reduce(
        (acc1, method) => paths.reduce(
          (acc2, path) => (acc2 || router)[method](path, ...handlers),
          acc1,
        ),
        acc,
      ),
      router,
    ) || router;
  };
};

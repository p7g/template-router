const test = require('ava');
const parse = require('../src/parser');
const lex = require('../src/lexer');

const id = a => a;

test('parsing valid strings', (t) => {
  t.plan(2);

  const expected = { methods: ['get'], paths: ['/hullo/:name'], handler: [id] };
  const testString = 'GET /hullo/:name';
  const withWhitespace = `
  GET
    /hullo/:name
`;

  t.deepEqual([expected], parse([lex(testString)], [id]), 'Gets the correct method and path');
  t.deepEqual([expected], parse([lex(withWhitespace)], [id]), 'Works with extra spaces');
});

test('fails on invalid strings', (t) => {
  t.plan(4);

  const missingMethod = '/some/path';
  const missingPath = 'GET';
  const invalidMethod = 'HULLO /this/is/a/path';
  const double = 'POST / GET /';

  t.throws(() => parse(lex(missingMethod)));
  t.throws(() => parse(lex(invalidMethod)));
  t.throws(() => parse(lex(missingPath)));
  t.throws(() => parse(lex(double)));
});

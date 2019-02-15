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

test('fails if no input', (t) => {
  t.plan(1);

  t.throws(() => parse());
});

test('fails on invalid strings', (t) => {
  t.plan(8);

  const missingMethod = '/some/path';
  const missingPath = 'GET';
  const invalidMethod = 'HULLO /this/is/a/path';
  const double = 'POST / GET /';
  const twoCommas = 'POST,,';
  const twoCommas2 = 'POST /,,';

  const handlers = ['handler'];

  t.throws(() => parse([lex(missingMethod)], handlers), SyntaxError);
  t.throws(() => parse([lex(invalidMethod)], handlers), SyntaxError);
  t.throws(() => parse([lex(missingPath)], handlers), SyntaxError);
  t.throws(() => parse([lex(double)], handlers), SyntaxError);
  t.throws(() => parse([lex(twoCommas)], handlers), SyntaxError);
  t.throws(() => parse([[]], []), SyntaxError);
  t.throws(() => parse([lex('GET')], []), SyntaxError);
  t.throws(() => parse([lex(twoCommas2)], handlers), SyntaxError);
});

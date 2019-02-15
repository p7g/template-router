const test = require('ava');
const lex = require('../src/lexer');

test('lexes identifiers and commas', (t) => {
  t.plan(1);

  const string = 'GET, POST /home, /away';

  t.deepEqual([
    { type: 'identifier', name: 'GET' },
    { type: 'comma' },
    { type: 'identifier', name: 'POST' },
    { type: 'identifier', name: '/home' },
    { type: 'comma' },
    { type: 'identifier', name: '/away' },
  ], lex(string));
});

test('empty string has no tokens', (t) => {
  t.plan(1);

  t.deepEqual([], lex(''));
});

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { tokenize, T } = require('../app.js');

test('source positions remain one-based across multiple lines', () => {
  const tokens = tokenize('int a;\n  a = 2;');
  const secondA = tokens.filter(token => token.value === 'a')[1];
  assert.equal(secondA.line, 2);
  assert.equal(secondA.column, 3);
  assert.equal(secondA.start, 9);
  assert.equal(secondA.end, 10);
});

test('multi-character operators use longest-match tokenization', () => {
  const source = 'a >>= 1; b <<= 2; c -> d; x == y && y != z;';
  const tokens = tokenize(source);
  const operators = tokens.filter(token => token.type === T.OPERATOR).map(token => token.value);
  assert.deepEqual(operators, ['>>=', '<<=', '->', '==', '&&', '!=']);
});

test('whitespace-only input produces no tokens', () => {
  assert.deepEqual(tokenize(' \t\n  \r\n'), []);
});

test('every emitted token has a non-empty source span within the input', () => {
  const source = 'int value = 12;\nvalue += 3;';
  for (const token of tokenize(source)) {
    assert.ok(token.start >= 0);
    assert.ok(token.end > token.start);
    assert.ok(token.end <= source.length);
    assert.equal(source.slice(token.start, token.end), token.value);
  }
});

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { tokenize, parseToAST, buildCFG, buildDFG, T } = require('../app.js');

test('tokenizes identifiers, keywords, and operators with source positions', () => {
  const tokens = tokenize('int main() { return a<=10; }');
  assert.deepEqual(tokens.slice(0, 3).map(t => t.value), ['int', 'main', '(']);
  assert.equal(tokens[0].type, T.KEYWORD);
  assert.equal(tokens[1].type, T.IDENTIFIER);
  const comparison = tokens.find(t => t.value === '<=');
  assert.equal(comparison.type, T.OPERATOR);
  assert.equal(comparison.line, 1);
  assert.ok(comparison.start < comparison.end);
});

test('skips line and block comments without swallowing following code', () => {
  const tokens = tokenize('int a; // ignore\n/* block */ a = 2;');
  assert.deepEqual(tokens.filter(t => t.value === 'a').map(t => t.line), [1, 2]);
  assert.equal(tokens.some(t => t.value.includes('ignore')), false);
});

test('handles escaped quotes inside string and character literals', () => {
  const tokens = tokenize(String.raw`char *s = "say \\"hi\\""; char c = '\\'';`);
  assert.equal(tokens.filter(t => t.type === T.LITERAL).length, 2);
  assert.equal(tokens.some(t => t.type === T.ERROR), false);
});

test('recognizes common numeric literal forms as single tokens', () => {
  const tokens = tokenize('0xFF 42U 3.14 .5 1e-3 2.0f');
  assert.deepEqual(tokens.map(t => t.value), ['0xFF', '42U', '3.14', '.5', '1e-3', '2.0f']);
  assert.ok(tokens.every(t => t.type === T.LITERAL));
});

test('reports unterminated strings, character literals, and block comments', () => {
  for (const source of ['"never closed', "'x", '/* never closed']) {
    const tokens = tokenize(source);
    assert.equal(tokens.length, 1);
    assert.equal(tokens[0].type, T.ERROR);
    assert.ok(tokens[0].error);
  }
});

test('marks unsupported characters as errors instead of silently classifying symbols', () => {
  const tokens = tokenize('int x = 1; @');
  assert.equal(tokens.at(-1).value, '@');
  assert.equal(tokens.at(-1).type, T.ERROR);
});

test('parses sample declaration and return into an AST', () => {
  const ast = parseToAST(tokenize('int main() { int value = 3; return value; }'));
  assert.equal(ast.functions.length, 1);
  assert.equal(ast.functions[0].name, 'main');
  assert.equal(ast.functions[0].body[0].kind, 'Declaration');
  assert.equal(ast.functions[0].body[1].kind, 'Return');
});

test('builds non-empty control-flow and data-flow graphs for a simple program', () => {
  const ast = parseToAST(tokenize('int main() { int a = 1; int b = a + 2; return b; }'));
  const cfg = buildCFG(ast);
  const dfg = buildDFG(ast);
  assert.ok(cfg.length >= 4);
  assert.ok(dfg.nodes.length >= 2);
});

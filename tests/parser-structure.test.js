'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { tokenize, parseToAST } = require('../app.js');

function parse(source) {
  return parseToAST(tokenize(source));
}

test('preserves nested if/else structure in the AST', () => {
  const ast = parse('int main() { int x = 0; if (x) { if (x) { x++; } else { x = 2; } } return x; }');
  const outer = ast.functions[0].body.find(node => node.kind === 'If');
  assert.ok(outer);
  const inner = outer.thenBranch.find(node => node.kind === 'If');
  assert.ok(inner);
  assert.equal(inner.thenBranch[0].kind, 'Assign');
  assert.equal(inner.elseBranch[0].kind, 'Assign');
});

test('keeps function declarations separate and in source order', () => {
  const ast = parse('int first() { return 1; } void second() { return; } int main() { return first(); }');
  assert.deepEqual(ast.functions.map(fn => fn.name), ['first', 'second', 'main']);
  assert.equal(ast.functions[0].body[0].kind, 'Return');
  assert.equal(ast.functions[1].body[0].kind, 'Return');
});

test('parses a while loop containing a conditional and a return', () => {
  const ast = parse('int main() { int x = 0; while (x < 3) { if (x == 2) { return x; } x++; } return x; }');
  const loop = ast.functions[0].body.find(node => node.kind === 'While');
  assert.ok(loop);
  assert.equal(loop.body[0].kind, 'If');
  assert.equal(loop.body[0].thenBranch[0].kind, 'Return');
  assert.equal(loop.body[1].kind, 'Assign');
});

test('empty source returns a well-shaped empty program node', () => {
  assert.deepEqual(parse(''), { kind: 'Program', functions: [] });
});

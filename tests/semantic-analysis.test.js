'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { tokenize, parseToAST, analyzeSemantics } = require('../app.js');

function analyze(source) {
  return analyzeSemantics(parseToAST(tokenize(source)));
}

test('reports identifiers used before declaration', () => {
  const diagnostics = analyze('int main() { x = 3; return x; }');
  assert.ok(diagnostics.some(d => d.code === 'E_UNDECLARED' && d.name === 'x'));
});

test('reports reads of declared but uninitialized variables', () => {
  const diagnostics = analyze('int main() { int x; return x; }');
  assert.ok(diagnostics.some(d => d.code === 'W_UNINITIALIZED' && d.name === 'x'));
});

test('does not warn when a variable is initialized before use', () => {
  const diagnostics = analyze('int main() { int x = 4; int y = x + 1; return y; }');
  assert.equal(diagnostics.filter(d => d.code === 'W_UNINITIALIZED').length, 0);
  assert.equal(diagnostics.filter(d => d.code === 'E_UNDECLARED').length, 0);
});

test('reports duplicate declarations in the same scope', () => {
  const diagnostics = analyze('int main() { int x = 1; int x = 2; return x; }');
  assert.ok(diagnostics.some(d => d.code === 'E_DUPLICATE_DECLARATION' && d.name === 'x'));
});

test('requires initialization on both if branches before treating a value as definite', () => {
  const diagnostics = analyze('int main() { int x; if (1) { x = 1; } return x; }');
  assert.ok(diagnostics.some(d => d.code === 'W_UNINITIALIZED' && d.name === 'x'));
});

test('accepts initialization on both if/else branches', () => {
  const diagnostics = analyze('int main() { int x; if (1) { x = 1; } else { x = 2; } return x; }');
  assert.equal(diagnostics.filter(d => d.code === 'W_UNINITIALIZED').length, 0);
});

test('does not assume a loop body executes before a later read', () => {
  const diagnostics = analyze('int main() { int x; while (1) { x = 1; } return x; }');
  assert.ok(diagnostics.some(d => d.code === 'W_UNINITIALIZED' && d.name === 'x'));
});

test('analyzes functions independently', () => {
  const diagnostics = analyze('int first() { int x = 1; return x; } int second() { return x; }');
  assert.ok(diagnostics.some(d => d.code === 'E_UNDECLARED' && d.name === 'x'));
});

test('returns an empty diagnostic list for an empty program', () => {
  assert.deepEqual(analyze(''), []);
});

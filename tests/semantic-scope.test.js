'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { tokenize, parseToAST, analyzeSemantics } = require('../app.js');

function diagnostics(source) {
  return analyzeSemantics(parseToAST(tokenize(source)));
}

test('allows a nested declaration to shadow an outer variable', () => {
  const result = diagnostics('int main() { int value = 1; if (value) { int value = 2; return value; } return value; }');
  assert.equal(result.filter(item => item.code === 'E_DUPLICATE_DECLARATION').length, 0);
  assert.equal(result.filter(item => item.code === 'E_UNDECLARED').length, 0);
});

test('reports an uninitialized read even when the variable exists in an outer scope', () => {
  const result = diagnostics('int main() { int value; if (1) { int inner = value; } return 0; }');
  assert.ok(result.some(item => item.code === 'W_UNINITIALIZED' && item.name === 'value'));
});

test('does not leak local declarations between functions', () => {
  const result = diagnostics('int first() { int privateValue = 1; return privateValue; } int second() { return privateValue; }');
  assert.ok(result.some(item => item.code === 'E_UNDECLARED' && item.name === 'privateValue'));
});

test('initialization from a loop body is not assumed after a possibly skipped loop', () => {
  const result = diagnostics('int main() { int value; for (value = 0; value < 1; value++) { value = 1; } int result; return result; }');
  assert.ok(result.some(item => item.code === 'W_UNINITIALIZED' && item.name === 'result'));
});

test('diagnostics expose stable severity, code, and message fields', () => {
  const item = diagnostics('int main() { return missing; }').find(d => d.code === 'E_UNDECLARED');
  assert.ok(item);
  assert.equal(item.severity, 'error');
  assert.equal(typeof item.message, 'string');
  assert.ok(item.message.length > 0);
});

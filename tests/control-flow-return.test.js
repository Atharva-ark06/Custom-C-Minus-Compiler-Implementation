'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { tokenize, parseToAST, buildCFG } = require('../app.js');

function cfgFor(source) {
  return buildCFG(parseToAST(tokenize(source)));
}

test('return nodes do not connect to END', () => {
  const cfg = cfgFor('int main() { return 0; }');
  const ret = cfg.find(node => node.type === 'return');
  const end = cfg.find(node => node.type === 'end');
  assert.ok(ret);
  assert.equal(ret.successors.length, 0);
  assert.ok(!ret.successors.includes(end.id));
});

test('statements after return are not reachable from the return node', () => {
  const cfg = cfgFor('int main() { return 0; int x = 1; x = 2; }');
  const ret = cfg.find(node => node.type === 'return');
  const declaration = cfg.find(node => node.label.startsWith('Declare: int x'));
  const assignment = cfg.find(node => node.label === 'Assign: x = 2');
  assert.ok(ret && declaration && assignment);
  assert.ok(!ret.successors.includes(declaration.id));
  assert.ok(declaration.successors.includes(assignment.id));
});

test('a return in one if branch does not flow into the branch merge', () => {
  const cfg = cfgFor('int main() { int x = 0; if (x) { return 1; } else { x = 2; } return x; }');
  const ret = cfg.find(node => node.type === 'return' && node.label === 'Return: 1');
  const merge = cfg.find(node => node.label === 'merge');
  assert.ok(ret && merge);
  assert.ok(!ret.successors.includes(merge.id));
});

test('normal non-returning functions still connect to END', () => {
  const cfg = cfgFor('int main() { int x = 1; x = 2; }');
  const end = cfg.find(node => node.type === 'end');
  const assignment = cfg.find(node => node.label === 'Assign: x = 2');
  assert.ok(assignment.successors.includes(end.id));
});

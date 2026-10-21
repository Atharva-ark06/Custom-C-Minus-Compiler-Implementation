'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { tokenize, parseToAST, buildDFG } = require('../app.js');

function dfgFor(source) {
  return buildDFG(parseToAST(tokenize(source)));
}

test('self-referential assignment reads from the previous definition', () => {
  const dfg = dfgFor('int main() { int x = 1; x = x + 1; return x; }');
  const defs = dfg.nodes.filter(node => node.kind === 'def' && node.varName === 'x');
  assert.equal(defs.length, 2);
  const prior = defs[0];
  const next = defs[1];
  assert.ok(dfg.edges.some(edge => edge.from === prior.id && edge.to === next.id && edge.label === 'x'));
  assert.ok(!dfg.edges.some(edge => edge.from === next.id && edge.to === next.id));
});

test('compound assignments and increments depend on the prior variable definition', () => {
  const compound = dfgFor('int main() { int x = 1; x += 2; return x; }');
  const compoundDefs = compound.nodes.filter(node => node.kind === 'def' && node.varName === 'x');
  assert.ok(compound.edges.some(edge => edge.from === compoundDefs[0].id && edge.to === compoundDefs[1].id));

  const increment = dfgFor('int main() { int x = 1; x++; return x; }');
  const incrementDefs = increment.nodes.filter(node => node.kind === 'def' && node.varName === 'x');
  assert.ok(increment.edges.some(edge => edge.from === incrementDefs[0].id && edge.to === incrementDefs[1].id));
});

test('declaration initializer uses the earlier definition instead of itself', () => {
  const dfg = dfgFor('int main() { int x = 1; int y = x + 2; return y; }');
  const xDef = dfg.nodes.find(node => node.kind === 'def' && node.varName === 'x');
  const yDef = dfg.nodes.find(node => node.kind === 'def' && node.varName === 'y');
  assert.ok(dfg.edges.some(edge => edge.from === xDef.id && edge.to !== xDef.id && edge.label === '→'));
  assert.ok(dfg.edges.some(edge => edge.to === yDef.id && edge.label === '→'));
});

test('return expressions create data-flow use nodes', () => {
  const dfg = dfgFor('int main() { int answer = 42; return answer; }');
  const answerDef = dfg.nodes.find(node => node.kind === 'def' && node.varName === 'answer');
  const returnUse = dfg.nodes.find(node => node.label === 'RETURN answer');
  const answerUse = dfg.nodes.find(node => node.kind === 'use' && node.label === 'USE answer in return');
  assert.ok(returnUse);
  assert.ok(answerUse);
  assert.ok(dfg.edges.some(edge => edge.from === answerDef.id && edge.to === answerUse.id));
  assert.ok(dfg.edges.some(edge => edge.from === answerUse.id && edge.to === returnUse.id));
});

test('all data-flow edges reference valid nodes', () => {
  const dfg = dfgFor('int main() { int a = 1; int b = a; b = b + a; return b; }');
  const ids = new Set(dfg.nodes.map(node => node.id));
  for (const edge of dfg.edges) {
    assert.ok(ids.has(edge.from));
    assert.ok(ids.has(edge.to));
  }
});

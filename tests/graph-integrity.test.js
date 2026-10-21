'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { tokenize, parseToAST, buildCFG, buildDFG, buildCPG } = require('../app.js');

function analyze(source) {
  const ast = parseToAST(tokenize(source));
  const cfg = buildCFG(ast);
  const dfg = buildDFG(ast);
  return { cfg, dfg, cpg: buildCPG(cfg, dfg) };
}

test('CFG node identifiers are unique and every successor resolves', () => {
  const { cfg } = analyze('int main() { int x = 0; while (x < 4) { if (x == 2) { x++; } else { x += 1; } } return x; }');
  const ids = cfg.map(node => node.id);
  assert.equal(new Set(ids).size, ids.length);
  const idSet = new Set(ids);
  for (const node of cfg) {
    assert.ok(Array.isArray(node.successors));
    for (const successor of node.successors) assert.ok(idSet.has(successor));
  }
});

test('DFG identifiers are unique and every edge endpoint resolves', () => {
  const { dfg } = analyze('int main() { int a = 1; int b = a; b = b + a; return b; }');
  const ids = dfg.nodes.map(node => node.id);
  assert.equal(new Set(ids).size, ids.length);
  const idSet = new Set(ids);
  for (const edge of dfg.edges) {
    assert.ok(idSet.has(edge.from));
    assert.ok(idSet.has(edge.to));
  }
});

test('CPG retains the exact CFG and DFG instances supplied to it', () => {
  const { cfg, dfg, cpg } = analyze('int main() { return 0; }');
  assert.equal(cpg.cfg, cfg);
  assert.equal(cpg.dfg, dfg);
});

test('multiple functions do not create dangling CFG or DFG references', () => {
  const { cfg, dfg } = analyze('int first() { int x = 1; return x; } int main() { int y = 2; return y; }');
  const cfgIds = new Set(cfg.map(node => node.id));
  const dfgIds = new Set(dfg.nodes.map(node => node.id));
  assert.ok(cfg.every(node => node.successors.every(id => cfgIds.has(id))));
  assert.ok(dfg.edges.every(edge => dfgIds.has(edge.from) && dfgIds.has(edge.to)));
});

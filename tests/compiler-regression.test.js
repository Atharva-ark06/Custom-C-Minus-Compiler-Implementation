'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  tokenize, parseToAST, buildCFG, buildDFG, buildCPG, extractVarUses, T,
} = require('../app.js');

function compile(source) {
  const tokens = tokenize(source);
  const ast = parseToAST(tokens);
  return { tokens, ast, cfg: buildCFG(ast), dfg: buildDFG(ast) };
}

test('parses if/else into distinct branches and preserves both assignments', () => {
  const { ast, cfg } = compile(
    'int main() { int x = 0; if (x < 1) { x = 1; } else { x = 2; } return x; }'
  );
  const branch = ast.functions[0].body.find(node => node.kind === 'If');
  assert.ok(branch);
  assert.equal(branch.thenBranch[0].kind, 'Assign');
  assert.equal(branch.elseBranch[0].kind, 'Assign');
  const condition = cfg.find(node => node.type === 'cond');
  assert.equal(condition.successors.length, 2);
});

test('parses while loops and emits a control-flow back edge', () => {
  const { ast, cfg } = compile('int main() { int i = 0; while (i < 3) { i++; } return i; }');
  assert.ok(ast.functions[0].body.some(node => node.kind === 'While'));
  const loop = cfg.find(node => node.type === 'loop' && node.label.startsWith('while'));
  assert.ok(loop);
  const body = cfg.find(node => node.label === 'loop body');
  assert.ok(body);
  assert.ok(cfg.some(node => node.successors.includes(loop.id) && node.id !== loop.id));
});

test('parses for-loop initializer, condition, update, and body', () => {
  const { ast, cfg } = compile('int main() { int i; for (i = 0; i < 4; i++) { i += 1; } return i; }');
  const loop = ast.functions[0].body.find(node => node.kind === 'For');
  assert.ok(loop);
  assert.match(loop.init, /i = 0/);
  assert.match(loop.cond, /i < 4/);
  assert.match(loop.upd, /i \+\+/);
  assert.equal(loop.body[0].kind, 'Assign');
  assert.ok(cfg.some(node => node.label.startsWith('for upd:')));
});

test('parses function calls and keeps their argument expressions', () => {
  const { ast } = compile('int main() { int x = 2; printf("%d", x); return 0; }');
  const call = ast.functions[0].body.find(node => node.kind === 'Call');
  assert.ok(call);
  assert.equal(call.name, 'printf');
  assert.deepEqual(call.args, ['"%d"', 'x']);
});

test('data-flow edges reference existing nodes and track initialized-variable use', () => {
  const { dfg } = compile('int main() { int a = 1; int b = a + 2; return b; }');
  const ids = new Set(dfg.nodes.map(node => node.id));
  assert.ok(dfg.edges.length >= 2);
  for (const edge of dfg.edges) {
    assert.ok(ids.has(edge.from), 'edge source should exist');
    assert.ok(ids.has(edge.to), 'edge target should exist');
  }
  assert.ok(dfg.nodes.some(node => node.kind === 'use' && node.varName === 'a'));
});

test('CFG successor references always point to an existing node', () => {
  const { cfg } = compile(
    'int main() { int i = 0; while (i < 3) { if (i == 1) { i++; } else { i += 2; } } return i; }'
  );
  const ids = new Set(cfg.map(node => node.id));
  for (const node of cfg) {
    for (const successor of node.successors) {
      assert.ok(ids.has(successor), `node ${node.id} points to missing successor ${successor}`);
    }
  }
});

test('combined program graph preserves the CFG and DFG structures', () => {
  const { cfg, dfg } = compile('int main() { int x = 1; x = x + 1; return x; }');
  const cpg = buildCPG(cfg, dfg);
  assert.equal(cpg.cfg, cfg);
  assert.equal(cpg.dfg, dfg);
});

test('identifier extraction excludes language keywords and deduplicates names', () => {
  assert.deepEqual([...extractVarUses('x + x * y + return')].sort(), ['x', 'y']);
});

test('parser safely returns a program for incomplete source input', () => {
  assert.doesNotThrow(() => parseToAST(tokenize('int main( { int x = ;')));
  const ast = parseToAST(tokenize('int main( { int x = ;'));
  assert.ok(ast);
  assert.equal(ast.kind, 'Program');
});

test('empty source produces empty graphs with a valid start-to-end CFG path', () => {
  const { ast, cfg, dfg } = compile('');
  assert.equal(ast.functions.length, 0);
  assert.equal(dfg.nodes.length, 0);
  assert.equal(cfg[0].label, 'START');
  assert.equal(cfg.at(-1).label, 'END');
  assert.ok(cfg[0].successors.includes(cfg.at(-1).id));
});

test('tokenizer error tokens remain visible to regression tests', () => {
  const { tokens } = compile('int main() { @ return 0; }');
  assert.ok(tokens.some(token => token.type === T.ERROR && token.value === '@'));
});

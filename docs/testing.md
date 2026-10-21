# Testing and Quality Checks

The project uses Node.js's built-in test runner, so no third-party test framework is needed.

## Commands

Run the full regression suite:

```bash
npm test
```

Run the dependency-free repository smoke check:

```bash
npm run check:repo
```

Check browser-core JavaScript syntax:

```bash
node --check app.js
```

## Test organization

- `compiler-core.test.js`: baseline lexer, parser, and graph behavior.
- `compiler-regression.test.js`: structural parsing and graph regressions.
- `lexer-source-position.test.js`: token offsets, line/column tracking, and longest-match operators.
- `parser-structure.test.js`: nested control flow and function ordering.
- `semantic-analysis.test.js` and `semantic-scope.test.js`: diagnostics and conservative scope/initialization behavior.
- `control-flow-return.test.js`: terminal return edges in the CFG.
- `data-flow-definition-edges.test.js`: data-flow definition/use edges.
- `graph-integrity.test.js`: node identity and edge endpoint integrity.
- `browser-contract.test.js`: required browser entry-point references and output containers.

## Interpreting results

Passing tests means the covered behaviors passed. It does not establish complete C-language conformance or prove that every possible program is analyzed correctly. The parser and semantic analysis are intentionally limited to an educational C-like subset.

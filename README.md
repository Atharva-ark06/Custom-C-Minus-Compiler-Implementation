# C-Viz — Custom C-Minus Compiler & Program Structure Visualizer

[![Compiler quality checks](https://github.com/Atharva-ark06/Custom-C-Minus-Compiler-Implementation/actions/workflows/repository-checks.yml/badge.svg?branch=master)](https://github.com/Atharva-ark06/Custom-C-Minus-Compiler-Implementation/actions/workflows/repository-checks.yml)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-f7df1e?logo=javascript&logoColor=222)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)
![Project](https://img.shields.io/badge/Project-Educational-blue)

**C-Viz** is a browser-based educational tool for exploring the structure of C-like programs. It tokenizes source code, builds a lightweight structural representation, and visualizes control-flow, data-flow, and code-property relationships. The project also includes a conservative semantic-diagnostics pass and automated regression tests.

> **Scope:** This is a learning-oriented structural visualizer and compiler-core prototype, not a production C compiler. It does not implement the complete C grammar, a full static type system, machine-code generation, or a complete optimization pipeline. The parser and analyses support a subset of constructs and should be treated accordingly.

## Contents

- [Highlights](#highlights)
- [How it works](#how-it-works)
- [Current capabilities](#current-capabilities)
- [Technology stack](#technology-stack)
- [Run locally](#run-locally)
- [Run tests](#run-tests)
- [Repository layout](#repository-layout)
- [Known limitations](#known-limitations)
- [Development roadmap](#development-roadmap)
- [Contributing](#contributing)

## Highlights

- **Lexer:** recognizes supported keywords, identifiers, numeric and quoted literals, operators, comments, and invalid input.
- **Source diagnostics:** token records carry line, column, and source-offset information; malformed literals/comments and unknown characters can produce explicit error tokens.
- **Structural parsing:** converts supported source constructs into an AST-like representation for functions, declarations, assignments, calls, returns, conditionals, and loops.
- **Semantic diagnostics:** flags undeclared identifiers, duplicate declarations in the same scope, and potentially uninitialized reads.
- **Control-flow graph (CFG):** represents branches and loops, including loop back-edges; return nodes terminate their outgoing control-flow path.
- **Data-flow graph (DFG):** represents supported definition/use relationships, including reads from prior definitions and return-expression uses.
- **Code property graph (CPG):** combines structural and graph information for exploration.
- **Browser UI:** displays program-analysis views without requiring a separate frontend build step.
- **Regression tests and CI:** uses Node's built-in test runner and GitHub Actions to catch logic regressions.

## How it works

The current workflow is an educational analysis pipeline rather than a complete compile-to-machine-code pipeline.

~~~text
       C-like source input
                |
                v
       Lexer / Token stream
                |
                v
      Structural parser / AST
         /       |       \
        v        v        v
   Semantic     CFG      DFG
 diagnostics     \        /
                   v
             Combined CPG
                |
                v
          Browser visualizer
~~~

## Current capabilities

| Component | What is currently covered |
|---|---|
| Lexical analysis | Supported keywords, identifiers, quoted literals and escapes, numeric forms, operators, comments, source positions, and error tokens |
| Structural parser | Supported declarations, assignments, function-like constructs, calls, returns, if/else, while, and for structures |
| Semantic diagnostics | Undeclared identifiers, same-scope duplicate declarations, potentially uninitialized reads, and conservative initialization checks around branches/loops |
| CFG | Statement nodes, branch/loop structure, loop back-edges, and return termination |
| DFG | Definition/use relationships for supported expressions, assignment dependencies, compound updates, increments, and return expressions |
| CPG | Combined structural/flow information for visual exploration |
| Quality checks | Node test suite plus JavaScript syntax validation in GitHub Actions |

The behavior is intentionally scoped. A successful analysis does **not** mean arbitrary C source has been parsed or type-checked according to the C standard.

## Technology stack

- **Frontend:** HTML, CSS, browser JavaScript
- **Compiler core:** JavaScript
- **Test runner:** Node.js built-in node:test
- **Continuous integration:** GitHub Actions
- **Runtime requirement:** Node.js 20 or newer for tests

No third-party npm dependencies are required by the current test setup.

## Run locally

1. Clone the repository:

   ~~~bash
   git clone https://github.com/Atharva-ark06/Custom-C-Minus-Compiler-Implementation.git
   cd Custom-C-Minus-Compiler-Implementation
   ~~~

2. Open index.html in a modern browser to use the visualizer.

3. To run the compiler-core tests, install [Node.js 20+](https://nodejs.org/) and run:

   ~~~bash
   npm test
   ~~~

4. To check JavaScript syntax separately:

   ~~~bash
   node --check app.js
   ~~~

The same test and syntax checks run in GitHub Actions for pushes and pull requests targeting the configured branches.

## Run tests

Run all automated tests:

~~~bash
npm test
~~~

The suite is organized by concern:

- **tests/compiler-core.test.js** — core lexer/parser/graph behavior
- **tests/compiler-regression.test.js** — parser and graph regression cases
- **tests/control-flow-return.test.js** — return termination and CFG edge behavior
- **tests/data-flow-definition-edges.test.js** — definition/use edge correctness
- **tests/semantic-analysis.test.js** — semantic diagnostics and initialization-flow behavior

Tests document supported behavior and prevent known regressions. They are not a claim of full standards conformance.

## Visualizer screenshots

<p align="center">
  <img src="https://res.cloudinary.com/wpop4xyo/image/upload/v1788029072/Screenshot_2026-08-30_001419.png" width="95%" alt="C-Viz browser interface screenshot" />
</p>

<p align="center">
  <img src="https://res.cloudinary.com/wpop4xyo/image/upload/v1788029127/Screenshot_2026-08-30_001509.png" width="95%" alt="C-Viz program analysis output screenshot" />
</p>

<p align="center">
  <img src="https://res.cloudinary.com/wpop4xyo/image/upload/v1788029139/Screenshot_2026-08-30_001456.png" width="95%" alt="C-Viz structural visualization screenshot" />
</p>

## Repository layout

~~~text
.
├── app.js                              # Browser logic and compiler-core functions
├── index.html                          # Visualizer interface
├── style.css                           # Interface styles
├── package.json                        # Node test command and runtime requirement
├── tests/
│   ├── compiler-core.test.js
│   ├── compiler-regression.test.js
│   ├── control-flow-return.test.js
│   ├── data-flow-definition-edges.test.js
│   └── semantic-analysis.test.js
├── docs/
│   └── engineering-roadmap.md          # Planned improvements and milestones
└── .github/
    └── workflows/
        └── repository-checks.yml       # Automated test and syntax checks
~~~

## Known limitations

- The parser is structural and supports only a subset of C-like syntax; it is not a standards-compliant C parser.
- Expressions are represented in a lightweight form rather than a complete precedence-aware expression AST.
- Semantic analysis is conservative and is not a complete type checker or a complete implementation of C scope and lifetime rules.
- Data-flow and control-flow analyses are educational approximations; complex path-sensitive cases may not be modeled precisely.
- The project does not currently generate executable machine code.
- A clean test run verifies the covered cases only; it does not prove correctness for every possible input.

These boundaries are documented so new features can be added incrementally without overstating current behavior.

## Development roadmap

The next useful milestones are:

1. Improve expression parsing, precedence, and associativity in the AST.
2. Add source spans and clearer parser diagnostics.
3. Strengthen nested-scope and function-parameter handling in semantic analysis.
4. Improve CFG/DFG accuracy for nested and path-sensitive constructs.
5. Add end-to-end sample programs and broader malformed-input tests.
6. Keep the UI, screenshots, documentation, and tested capabilities aligned.

See [docs/engineering-roadmap.md](docs/engineering-roadmap.md) for the detailed plan.

## Contributing

1. Start from the latest master and create a focused branch.
2. Make a small, reviewable change.
3. Add or update regression tests for behavior changes.
4. Run npm test and node --check app.js.
5. Update this README when capabilities, commands, UI, or limitations change.
6. Open a pull request describing the change and validation performed.

Please avoid empty commits made only to increase commit counts; prioritize meaningful, tested improvements.

---

**Purpose:** make compiler concepts visible and testable while steadily improving the correctness of a small educational compiler core.

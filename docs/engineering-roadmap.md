# Engineering Roadmap

This roadmap separates implemented behavior from planned compiler phases so contributors can extend the project without overstating current functionality.

## Suggested milestones

### 1. Establish a reproducible baseline
- Document the actual implementation language, runtime, and commands.
- Record the current source tree and existing examples.
- Add a smoke test that runs the real entry point once its path is confirmed.
- Keep screenshots and sample output synchronized with current behavior.

### 2. Lexer and source diagnostics
- Define token kinds, keyword rules, operator precedence, and comment syntax.
- Track one-based line and column positions.
- Report invalid characters and unterminated literals/comments with source locations.
- Add unit tests for valid tokens, boundary cases, and malformed input.

### 3. Parser and AST
- Write a compact grammar for the supported C-minus subset.
- Use explicit AST node types rather than loosely structured dictionaries.
- Test operator precedence, associativity, parentheses, and malformed statements.
- Include source spans in AST nodes for better diagnostics.

### 4. Semantic analysis
- Implement nested scopes with push/pop behavior.
- Detect duplicate declarations, undeclared identifiers, invalid assignments, and invalid return statements.
- Add tests for shadowing and scope boundaries.

### 5. Intermediate representation
- Define a stable three-address-code format and label conventions.
- Test expression temporaries, branches, loops, and return instructions.
- Add a small IR validator before optimization or execution.

### 6. Frontend and usability
- Show source, tokens, syntax/semantic diagnostics, AST, and intermediate code as distinct stages.
- Preserve the source input when a stage fails and display line/column details.
- Add copy/download actions for generated output and a reset/sample-program action.
- Ensure the interface works on narrow screens and supports keyboard navigation.

### 7. Release quality
- Add tests for every implemented phase and a few end-to-end sample programs.
- Run formatting/linting only after selecting tools appropriate to the actual language.
- Add CI checks that execute tests rather than merely listing repository files.
- Document known limitations and avoid claiming unsupported C language features.

## Contribution rule

Every PR should make a reviewable change, include relevant tests or a clear reason tests do not apply, and update documentation when behavior changes. Do not create empty commits just to increase commit count.

# Supported C-Like Language Subset

C-Viz is a structural visualizer, not a standards-compliant C compiler. The current parser recognizes a limited set of C-like constructs and stores many expressions as strings rather than building a complete precedence-aware expression tree.

## Constructs currently represented

- Function-like definitions with a recognized return type and a braced body.
- Basic declarations using supported primitive type keywords, with optional initializers.
- Simple assignments and selected compound assignments/increment/decrement forms.
- Function calls with comma-separated arguments.
- `return` statements.
- `if` / `else`, `while`, and `for` structures.
- Numeric and quoted literals, identifiers, supported operators, delimiters, and comments in the lexer.

## Important boundaries

- This list describes constructs recognized by the current implementation, not full validation of their grammar or semantics.
- The parser does not implement the complete C standard, all declaration forms, a complete expression grammar, or robust error recovery.
- Lexical recognition of a token does not guarantee that the parser supports the construct containing it.
- Semantic diagnostics are conservative checks for selected undeclared, duplicate, and potentially uninitialized variable cases; they are not a complete type checker.
- CFG and DFG outputs are educational approximations. Complex control-flow, aliasing, and path-sensitive cases are outside the current guarantees.
- No executable machine code is generated.

When extending this subset, add regression tests for both accepted input and nearby unsupported or malformed cases, then update this document and the README together.

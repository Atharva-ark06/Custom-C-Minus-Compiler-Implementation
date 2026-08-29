# 🚀 Multi-Phase Compiler

A functional, multi-phase compiler designed and implemented from scratch to demonstrate the core principles of compiler construction. The project translates a custom high-level language (or a defined subset of C/Java) into **machine-independent intermediate code**, while enforcing lexical, syntactic, and semantic rules.

---

## 📌 Project Overview

The compiler follows a traditional compiler architecture consisting of multiple phases. Each phase processes the output of the previous stage and performs a specific transformation or validation.

```text
┌─────────────────┐
│   Source Code   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Lexer / Scanner │  ← Regex / Flex
└────────┬────────┘
         │ Tokens
         ▼
┌─────────────────┐
│ Parser          │  ← CFG / Bison
└────────┬────────┘
         │ Parse Tree
         ▼
┌─────────────────┐
│ AST Generation  │
└────────┬────────┘
         │ AST
         ▼
┌─────────────────┐
│ Type Checker    │
└────────┬────────┘
         │ Validated AST
         ▼
┌─────────────────┐
│ TAC Generator   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Intermediate    │
│ Representation  │
└─────────────────┘
```

<<<<<<< HEAD
---
=======
## Visuals 

<p align="center">
  <img src="https://res.cloudinary.com/wpop4xyo/image/upload/v1788029072/Screenshot_2026-08-30_001419.png" width="95%" alt="XYZ Insta Login Screen">
</p> 

## Results and outputs 

## 1.
<p align="center">
  <img src="https://res.cloudinary.com/wpop4xyo/image/upload/v1788029127/Screenshot_2026-08-30_001509.png" width="95%" alt="XYZ Insta Login Screen">
</p>

## 2.
<p align="center">
  <img src="https://res.cloudinary.com/wpop4xyo/image/upload/v1788029139/Screenshot_2026-08-30_001456.png" width="95%" alt="XYZ Insta Login Screen">
</p>
>>>>>>> e6bbe5b3df1287a036e98ff6b73d4275cb61649b

## 🏗️ Compiler Phases

### 1. 🔤 Lexical Analysis

The **Lexer** converts the raw source code into meaningful tokens.

**Responsibilities:**

* Identify keywords and identifiers
* Recognize literals and operators
* Remove whitespace and comments
* Track line and column numbers
* Detect invalid characters and lexical errors

**Technologies:**

* Regular Expressions
* Lex / Flex
* PLY *(optional)*

---

### 2. 🌳 Syntax Analysis

The **Parser** validates the token stream against the language's **Context-Free Grammar (CFG)**.

**Responsibilities:**

* Validate program structure
* Build a Parse Tree or AST
* Handle operator precedence
* Detect syntax errors
* Provide meaningful error messages

**Technologies:**

* CFG
* Yacc / Bison
* ANTLR
* Recursive Descent Parser

---

### 3. 🧠 Abstract Syntax Tree (AST)

The AST provides a simplified structural representation of the source program.

```text
        Assignment
        /        \
     Variable    Expression
       x        /          \
             Variable      Number
                y            10
```

The AST removes unnecessary syntactic details and provides a clean structure for semantic analysis and code generation.

---

### 4. 🔍 Semantic Analysis

The **Semantic Analyzer** verifies whether the program follows the language's semantic rules.

**Key responsibilities:**

* Type checking
* Variable declaration checking
* Scope management
* Symbol table management
* Detecting undeclared variables
* Detecting incompatible operations

For example:

```text
int x;
string name;

x = name;   ❌ Type Error
```

---

## 📚 Symbol Table

The compiler maintains a **Symbol Table** to store information about identifiers.

Typical entries include:

| Identifier | Type     | Scope  | Other Information |
| ---------- | -------- | ------ | ----------------- |
| `x`        | `int`    | Local  | Variable          |
| `name`     | `string` | Global | Variable          |
| `sum`      | `int`    | Local  | Function          |

The symbol table supports **nested scopes**, allowing the compiler to distinguish between global and local variables.

---

## ⚙️ Intermediate Code Generation

After semantic validation, the compiler converts the AST into **Three-Address Code (TAC)** or another intermediate representation.

Example source:

```text
x = a + b * c;
```

TAC:

```text
t1 = b * c
t2 = a + t1
x  = t2
```

This machine-independent representation makes the compiler easier to optimize and eventually translate into target-specific code.

---

## 🔀 Control Flow Translation

The compiler supports translation of control-flow structures such as:

* `if`
* `if-else`
* `while`
* Nested conditionals
* Loops

Example:

```text
if (x > 10)
    y = x + 1;
else
    y = x - 1;
```

Possible TAC:

```text
if x > 10 goto L1
goto L2

L1:
t1 = x + 1
y = t1
goto L3

L2:
t2 = x - 1
y = t2

L3:
```

---

## 🛠️ Technology Stack

### Implementation Languages

Choose one:

* C
* C++
* Java
* Python

### Compiler Tools

| Tool                  | Purpose                   |
| --------------------- | ------------------------- |
| **Lex / Flex**        | Lexical Analysis          |
| **Yacc / Bison**      | Syntax Analysis           |
| **ANTLR**             | Lexer & Parser Generation |
| **PLY**               | Python Lex-Yacc           |
| **Recursive Descent** | Manual Parsing            |

---

## ✨ Key Features

* 🔤 Regex-based lexical analysis
* 🌳 CFG-based syntax analysis
* 🧩 Abstract Syntax Tree generation
* 🔍 Static semantic analysis
* 📖 Dynamic symbol table
* 🔐 Nested scope management
* ⚠️ Syntax and semantic error reporting
* 📍 Line and column-level error detection
* 🔄 Three-Address Code generation
* 🔀 Conditional and loop translation
* ⚡ Machine-independent intermediate representation

---

## 🎯 Project Objectives

1. Understand the architecture of modern compilers.
2. Implement lexical, syntactic, and semantic analysis.
3. Design and manage symbol tables and scopes.
4. Generate an intermediate representation from an AST.
5. Implement structured error detection and reporting.
6. Demonstrate how high-level source code is progressively transformed into executable representations.

---

## 📂 Suggested Project Structure

```text
compiler-project/
│
├── src/
│   ├── lexer/
│   ├── parser/
│   ├── ast/
│   ├── semantic/
│   ├── symbol_table/
│   └── codegen/
│
├── tests/
│   ├── valid/
│   └── invalid/
│
├── examples/
│   └── sample_program.txt
│
├── docs/
│
├── README.md
└── requirements.txt
```

---

## 🧪 Example Compilation Flow

```text
Source Program
      ↓
Lexical Analysis
      ↓
Token Stream
      ↓
Syntax Analysis
      ↓
Parse Tree / AST
      ↓
Semantic Analysis
      ↓
Validated AST
      ↓
Three-Address Code
      ↓
Intermediate Representation
```

---

## 📈 Future Scope

* Code optimization
* Dead-code elimination
* Constant folding
* Register allocation
* Machine-code generation
* Assembly generation
* Function and procedure support
* Improved error recovery
* Interactive compiler/debugging interface

---

## 👨‍💻 Project

This project demonstrates the complete pipeline of a compiler, from **source-code tokenization to intermediate code generation**, providing practical implementation of concepts from **Formal Languages, Automata Theory, Parsing, Symbol Tables, Semantic Analysis, and Code Generation**.

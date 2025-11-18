/**
 * Core DSL module - Expression Language
 * 
 * Re-exports all core functionality for the DSL including:
 * - Tokenization (Lexer)
 * - Parsing (AST generation)
 * - Evaluation
 * - Error types
 */

export type { Token, TokenType } from "./tokens.js";
export type { ASTNode, IntegerLiteral, BinaryExpr, UnaryExpr, BinaryOperator, UnaryOperator } from "./ast.js";
export { DSLError, LexError, ParseError, EvalError } from "./errors.js";
export { tokenize } from "./tokens.js";
export { parse } from "./parser.js";
export { evaluate } from "./evaluator.js";

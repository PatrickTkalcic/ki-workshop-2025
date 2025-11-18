/**
 * Base class for all DSL errors with position information.
 */
export abstract class DSLError extends Error {
  constructor(
    message: string,
    public readonly index: number
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown during tokenization (lexical analysis).
 * Indicates an unexpected or invalid character in the source.
 */
export class LexError extends DSLError {
  constructor(message: string, index: number) {
    super(message, index);
  }
}

/**
 * Error thrown during parsing.
 * Indicates a syntax error such as unexpected token or mismatched parentheses.
 */
export class ParseError extends DSLError {
  constructor(message: string, index: number) {
    super(message, index);
  }
}

/**
 * Error thrown during evaluation.
 * Indicates a runtime error such as division by zero.
 */
export class EvalError extends DSLError {
  constructor(message: string, index: number) {
    super(message, index);
  }
}

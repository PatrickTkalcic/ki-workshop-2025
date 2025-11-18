import { tokenize, parse, evaluate } from "./core/index.js";

// Re-export all core functionality
export * from "./core/index.js";

/**
 * Evaluates a mathematical expression and returns the integer result.
 * 
 * Supports:
 * - Integer literals (positive and negative)
 * - Binary operators: +, -, *, / (with standard precedence)
 * - Parentheses for grouping
 * - Unary minus
 * 
 * @param source - The expression string to evaluate
 * @returns The integer result of the evaluation
 * @throws {LexError} If the source contains invalid characters
 * @throws {ParseError} If the source has syntax errors
 * @throws {EvalError} If a runtime error occurs (e.g., division by zero)
 * 
 * @example
 * ```typescript
 * evaluateExpression("2 + 3 * 4") // returns 14
 * evaluateExpression("(2 + 3) * 4") // returns 20
 * evaluateExpression("-(3 + 4*2) / 5") // returns -2
 * evaluateExpression("7 / 3") // returns 2 (truncated)
 * evaluateExpression("-7 / 3") // returns -2 (truncated toward zero)
 * ```
 */
export function evaluateExpression(source: string): number {
  const tokens = tokenize(source);
  const ast = parse(tokens);
  const result = evaluate(ast);
  return result;
}
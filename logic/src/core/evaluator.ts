import { ASTNode } from "./ast.js";
import { EvalError } from "./errors.js";

/**
 * Evaluates an AST node and returns the computed integer result.
 * 
 * @param node - The AST node to evaluate
 * @returns The integer result of the evaluation
 * @throws {EvalError} If division by zero is attempted
 */
export function evaluate(node: ASTNode): number {
  switch (node.kind) {
    case "IntegerLiteral":
      return node.value;

    case "UnaryExpr": {
      const operandValue = evaluate(node.operand);
      // Currently only supports unary minus
      return -operandValue;
    }

    case "BinaryExpr": {
      const left = evaluate(node.left);
      const right = evaluate(node.right);

      switch (node.operator) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          if (right === 0) {
            throw new EvalError("Division by zero", node.index);
          }
          // Integer division with truncation toward zero
          return Math.trunc(left / right);
      }
    }

    default: {
      // TypeScript exhaustiveness check
      const _exhaustive: never = node;
      throw new EvalError(`Unknown node kind`, 0);
    }
  }
}

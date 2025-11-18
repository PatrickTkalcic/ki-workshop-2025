/**
 * AST node representing an integer literal.
 */
export interface IntegerLiteral {
  kind: "IntegerLiteral";
  value: number;
  index: number;
}

/**
 * Binary operators supported by the DSL.
 */
export type BinaryOperator = "+" | "-" | "*" | "/";

/**
 * AST node representing a binary expression (e.g., a + b, a * b).
 */
export interface BinaryExpr {
  kind: "BinaryExpr";
  operator: BinaryOperator;
  left: ASTNode;
  right: ASTNode;
  index: number;
}

/**
 * Unary operators supported by the DSL.
 */
export type UnaryOperator = "-";

/**
 * AST node representing a unary expression (e.g., -a).
 */
export interface UnaryExpr {
  kind: "UnaryExpr";
  operator: UnaryOperator;
  operand: ASTNode;
  index: number;
}

/**
 * Union type of all possible AST nodes.
 * Discriminated by the 'kind' property for type safety.
 */
export type ASTNode = IntegerLiteral | BinaryExpr | UnaryExpr;

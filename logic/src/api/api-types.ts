import { Token } from "../core/tokens.js";
import { ASTNode } from "../core/ast.js";

/**
 * Request body for expression evaluation.
 */
export interface EvaluateRequest {
  expression: string;
}

/**
 * Response for successful expression evaluation.
 */
export interface EvaluateResponse {
  result: number;
  expression: string;
}

/**
 * Request body for tokenization.
 */
export interface TokenizeRequest {
  expression: string;
}

/**
 * Response for successful tokenization.
 */
export interface TokenizeResponse {
  tokens: Token[];
  expression: string;
}

/**
 * Request body for parsing.
 */
export interface ParseRequest {
  expression: string;
}

/**
 * Response for successful parsing.
 */
export interface ParseResponse {
  ast: ASTNode;
  expression: string;
}

/**
 * Error response structure.
 */
export interface ErrorResponse {
  error: {
    type: "LexError" | "ParseError" | "EvalError" | "ValidationError" | "ServerError";
    message: string;
    index?: number;
    expression?: string;
  };
}

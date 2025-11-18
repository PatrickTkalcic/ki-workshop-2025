import { ASTNode, BinaryExpr, IntegerLiteral, UnaryExpr } from "./ast.js";
import { ParseError } from "./errors.js";
import { Token, TokenType } from "./tokens.js";

/**
 * Recursive descent parser for the DSL.
 * 
 * Grammar:
 *   expression -> term ( (PLUS | MINUS) term )*
 *   term       -> factor ( (STAR | SLASH) factor )*
 *   factor     -> MINUS factor | primary
 *   primary    -> INT | LPAREN expression RPAREN
 */
class Parser {
  private current = 0;

  constructor(private readonly tokens: Token[]) {}

  /**
   * Peeks at the current token without consuming it.
   */
  private peek(): Token {
    return this.tokens[this.current];
  }

  /**
   * Checks if the current token matches any of the given types.
   */
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.peek().type === type) {
        return true;
      }
    }
    return false;
  }

  /**
   * Advances to the next token and returns the previous one.
   */
  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.tokens[this.current - 1];
  }

  /**
   * Checks if we've reached the end of tokens.
   */
  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  /**
   * Consumes a token of the expected type or throws an error.
   */
  private consume(type: TokenType, message: string): Token {
    if (this.peek().type === type) {
      return this.advance();
    }
    const token = this.peek();
    throw new ParseError(message, token.index);
  }

  /**
   * Parses an expression: term ( (PLUS | MINUS) term )*
   */
  private expression(): ASTNode {
    let node = this.term();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operatorToken = this.advance();
      const operator = operatorToken.value as "+" | "-";
      
      // Check if there's a term after the operator
      if (this.isAtEnd() || (!this.match(TokenType.INT, TokenType.LPAREN, TokenType.MINUS))) {
        throw new ParseError(`Expected expression after '${operator}'`, this.peek().index);
      }
      
      const right = this.term();
      node = {
        kind: "BinaryExpr",
        operator,
        left: node,
        right,
        index: operatorToken.index,
      } satisfies BinaryExpr;
    }

    return node;
  }

  /**
   * Parses a term: factor ( (STAR | SLASH) factor )*
   */
  private term(): ASTNode {
    let node = this.factor();

    while (this.match(TokenType.STAR, TokenType.SLASH)) {
      const operatorToken = this.advance();
      const operator = operatorToken.value as "*" | "/";
      
      // Check if there's a factor after the operator
      if (this.isAtEnd() || (!this.match(TokenType.INT, TokenType.LPAREN, TokenType.MINUS))) {
        throw new ParseError(`Expected expression after '${operator}'`, this.peek().index);
      }
      
      const right = this.factor();
      node = {
        kind: "BinaryExpr",
        operator,
        left: node,
        right,
        index: operatorToken.index,
      } satisfies BinaryExpr;
    }

    return node;
  }

  /**
   * Parses a factor: MINUS factor | primary
   */
  private factor(): ASTNode {
    if (this.match(TokenType.MINUS)) {
      const operatorToken = this.advance();
      const operand = this.factor();
      return {
        kind: "UnaryExpr",
        operator: "-",
        operand,
        index: operatorToken.index,
      } satisfies UnaryExpr;
    }

    return this.primary();
  }

  /**
   * Parses a primary: INT | LPAREN expression RPAREN
   */
  private primary(): ASTNode {
    // Integer literal
    if (this.match(TokenType.INT)) {
      const token = this.advance();
      return {
        kind: "IntegerLiteral",
        value: parseInt(token.value, 10),
        index: token.index,
      } satisfies IntegerLiteral;
    }

    // Parenthesized expression
    if (this.match(TokenType.LPAREN)) {
      const lparen = this.advance();
      const expr = this.expression();
      this.consume(TokenType.RPAREN, "Expected ')' after expression");
      return expr;
    }

    // Unexpected token
    const token = this.peek();
    if (token.type === TokenType.EOF) {
      throw new ParseError(`Unexpected end of expression`, token.index);
    }
    throw new ParseError(`Unexpected token '${token.value}'`, token.index);
  }

  /**
   * Main parse method - entry point.
   */
  parse(): ASTNode {
    const ast = this.expression();
    
    // Ensure we've consumed all tokens except EOF
    if (!this.isAtEnd()) {
      const token = this.peek();
      throw new ParseError(`Unexpected token '${token.value}' after expression`, token.index);
    }

    return ast;
  }
}

/**
 * Parses an array of tokens into an Abstract Syntax Tree (AST).
 * 
 * @param tokens - Array of tokens to parse
 * @returns The root AST node
 * @throws {ParseError} If the tokens don't form a valid expression
 */
export function parse(tokens: Token[]): ASTNode {
  const parser = new Parser(tokens);
  return parser.parse();
}

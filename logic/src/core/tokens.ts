import { LexError } from "./errors.js";

/**
 * Token types supported by the DSL.
 */
export enum TokenType {
  INT = "INT",
  PLUS = "PLUS",
  MINUS = "MINUS",
  STAR = "STAR",
  SLASH = "SLASH",
  LPAREN = "LPAREN",
  RPAREN = "RPAREN",
  EOF = "EOF",
}

/**
 * Represents a single token in the source code.
 */
export interface Token {
  type: TokenType;
  value: string;
  index: number;
}

/**
 * Tokenizes the source string into an array of tokens.
 * 
 * @param source - The input expression string to tokenize
 * @returns Array of tokens including EOF at the end
 * @throws {LexError} If an unexpected character is encountered
 */
export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < source.length) {
    const char = source[index];

    // Skip whitespace
    if (/\s/.test(char)) {
      index++;
      continue;
    }

    // Match digits (positive integers)
    if (/\d/.test(char)) {
      const startIndex = index;
      let numStr = "";
      while (index < source.length && /\d/.test(source[index])) {
        numStr += source[index];
        index++;
      }
      tokens.push({
        type: TokenType.INT,
        value: numStr,
        index: startIndex,
      });
      continue;
    }

    // Match single-character tokens
    const tokenMap: Record<string, TokenType> = {
      "+": TokenType.PLUS,
      "-": TokenType.MINUS,
      "*": TokenType.STAR,
      "/": TokenType.SLASH,
      "(": TokenType.LPAREN,
      ")": TokenType.RPAREN,
    };

    if (char in tokenMap) {
      tokens.push({
        type: tokenMap[char],
        value: char,
        index,
      });
      index++;
      continue;
    }

    // Unexpected character
    throw new LexError(`Unexpected character '${char}' at index ${index}`, index);
  }

  // Add EOF token
  tokens.push({
    type: TokenType.EOF,
    value: "",
    index: source.length,
  });

  return tokens;
}

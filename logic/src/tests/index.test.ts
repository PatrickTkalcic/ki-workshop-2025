
import { test, expect, describe } from "vitest";
import { evaluateExpression, LexError, ParseError, EvalError } from "../index.js";

describe("DSL Expression Evaluator", () => {
  describe("Integer Literals", () => {
    test("evaluates single digit", () => {
      expect(evaluateExpression("0")).toBe(0);
      expect(evaluateExpression("7")).toBe(7);
      expect(evaluateExpression("42")).toBe(42);
    });

    test("evaluates negative literals via unary minus", () => {
      expect(evaluateExpression("-7")).toBe(-7);
      expect(evaluateExpression("-42")).toBe(-42);
    });

    test("evaluates zero", () => {
      expect(evaluateExpression("0")).toBe(0);
    });
  });

  describe("Basic Arithmetic - Precedence", () => {
    test("addition", () => {
      expect(evaluateExpression("2 + 3")).toBe(5);
      expect(evaluateExpression("10 + 5")).toBe(15);
    });

    test("subtraction", () => {
      expect(evaluateExpression("5 - 3")).toBe(2);
      expect(evaluateExpression("10 - 15")).toBe(-5);
    });

    test("multiplication", () => {
      expect(evaluateExpression("3 * 4")).toBe(12);
      expect(evaluateExpression("7 * 0")).toBe(0);
    });

    test("division with truncation toward zero", () => {
      expect(evaluateExpression("7 / 3")).toBe(2);
      expect(evaluateExpression("-7 / 3")).toBe(-2);
      expect(evaluateExpression("7 / -3")).toBe(-2);
      expect(evaluateExpression("-7 / -3")).toBe(2);
      expect(evaluateExpression("10 / 5")).toBe(2);
    });

    test("respects operator precedence (* and / before + and -)", () => {
      expect(evaluateExpression("2 + 3 * 4")).toBe(14); // 2 + 12
      expect(evaluateExpression("10 - 6 / 2")).toBe(7); // 10 - 3
      expect(evaluateExpression("2 * 3 + 4 * 5")).toBe(26); // 6 + 20
    });
  });

  describe("Parentheses", () => {
    test("overrides precedence", () => {
      expect(evaluateExpression("(2 + 3) * 4")).toBe(20);
      expect(evaluateExpression("2 * (3 + 4)")).toBe(14);
    });

    test("nested parentheses", () => {
      expect(evaluateExpression("((1 + 2) * (3 - 1))")).toBe(6); // (3 * 2)
      expect(evaluateExpression("(((5)))")).toBe(5);
    });

    test("multiple levels", () => {
      expect(evaluateExpression("((2 + 3) * (4 - 1)) / 3")).toBe(5); // (5 * 3) / 3 = 15 / 3
    });
  });

  describe("Unary Minus", () => {
    test("simple unary minus", () => {
      expect(evaluateExpression("-5")).toBe(-5);
      // Note: -0 in JavaScript is distinct from +0, so we use -0
      expect(evaluateExpression("-0")).toBe(-0);
    });

    test("unary minus with addition", () => {
      expect(evaluateExpression("-5 + 3")).toBe(-2);
      expect(evaluateExpression("3 + -5")).toBe(-2);
    });

    test("unary minus with parentheses", () => {
      expect(evaluateExpression("-(2 + 3)")).toBe(-5);
      expect(evaluateExpression("-(5 - 8)")).toBe(3);
    });

    test("double unary minus", () => {
      expect(evaluateExpression("--5")).toBe(5);
      expect(evaluateExpression("---5")).toBe(-5);
    });

    test("unary minus in complex expression", () => {
      expect(evaluateExpression("-2 * -3")).toBe(6);
      expect(evaluateExpression("-(3 + 4 * 2) / 5")).toBe(-2); // -(3 + 8) / 5 = -11 / 5 = -2
    });
  });

  describe("Left Associativity", () => {
    test("chained subtraction", () => {
      expect(evaluateExpression("1 - 2 - 3")).toBe(-4); // (1 - 2) - 3 = -1 - 3
    });

    test("chained division", () => {
      expect(evaluateExpression("20 / 4 / 2")).toBe(2); // (20 / 4) / 2 = 5 / 2 = 2
    });

    test("chained addition", () => {
      expect(evaluateExpression("1 + 2 + 3 + 4")).toBe(10);
    });
  });

  describe("Complex Expressions", () => {
    test("mixed operations", () => {
      expect(evaluateExpression("2 + 3 * 4 - 5")).toBe(9); // 2 + 12 - 5
      expect(evaluateExpression("100 / 5 + 3 * 2")).toBe(26); // 20 + 6
    });

    test("deeply nested", () => {
      expect(evaluateExpression("((10 - 5) * (3 + 2)) / (1 + 4)")).toBe(5); // (5 * 5) / 5
    });

    test("whitespace handling", () => {
      expect(evaluateExpression("  2  +  3  ")).toBe(5);
      expect(evaluateExpression("(  1 + 2  ) * 3")).toBe(9);
    });
  });

  describe("Property Tests", () => {
    test("identity properties", () => {
      // n + 0 = n
      expect(evaluateExpression("42 + 0")).toBe(42);
      expect(evaluateExpression("0 + 42")).toBe(42);

      // n * 1 = n
      expect(evaluateExpression("42 * 1")).toBe(42);
      expect(evaluateExpression("1 * 42")).toBe(42);

      // n - n = 0
      expect(evaluateExpression("42 - 42")).toBe(0);

      // n / n = 1 (for non-zero n)
      expect(evaluateExpression("42 / 42")).toBe(1);
    });

    test("associativity for addition", () => {
      // (a + b) + c = a + (b + c)
      const a = 5, b = 7, c = 3;
      expect(evaluateExpression(`(${a} + ${b}) + ${c}`)).toBe(evaluateExpression(`${a} + (${b} + ${c})`));
    });
  });

  describe("Error Handling - Lexical Errors", () => {
    test("throws LexError for invalid characters", () => {
      expect(() => evaluateExpression("abc")).toThrow(LexError);
      expect(() => evaluateExpression("2 + x")).toThrow(LexError);
      expect(() => evaluateExpression("2 & 3")).toThrow(LexError);
      expect(() => evaluateExpression("@")).toThrow(LexError);
    });

    test("LexError contains position information", () => {
      try {
        evaluateExpression("2 + x");
        expect.fail("Should have thrown LexError");
      } catch (e) {
        expect(e).toBeInstanceOf(LexError);
        expect((e as LexError).index).toBe(4); // 'x' is at index 4
        expect((e as LexError).message).toContain("x");
      }
    });
  });

  describe("Error Handling - Parse Errors", () => {
    test("throws ParseError for unexpected tokens", () => {
      expect(() => evaluateExpression("2 + * 3")).toThrow(ParseError);
      expect(() => evaluateExpression("+ 5")).toThrow(ParseError);
      expect(() => evaluateExpression("5 +")).toThrow(ParseError);
    });

    test("throws ParseError for mismatched parentheses", () => {
      expect(() => evaluateExpression("(1 + 2")).toThrow(ParseError);
      expect(() => evaluateExpression("1 + 2)")).toThrow(ParseError);
      expect(() => evaluateExpression("((1 + 2)")).toThrow(ParseError);
    });

    test("ParseError contains position information", () => {
      try {
        evaluateExpression("(1 + 2");
        expect.fail("Should have thrown ParseError");
      } catch (e) {
        expect(e).toBeInstanceOf(ParseError);
        expect((e as ParseError).message).toContain(")");
      }
    });
  });

  describe("Error Handling - Evaluation Errors", () => {
    test("throws EvalError for division by zero", () => {
      expect(() => evaluateExpression("5 / 0")).toThrow(EvalError);
      expect(() => evaluateExpression("10 / (5 - 5)")).toThrow(EvalError);
      expect(() => evaluateExpression("1 / (2 - 2)")).toThrow(EvalError);
    });

    test("EvalError contains message", () => {
      try {
        evaluateExpression("5 / 0");
        expect.fail("Should have thrown EvalError");
      } catch (e) {
        expect(e).toBeInstanceOf(EvalError);
        expect((e as EvalError).message).toContain("Division by zero");
      }
    });
  });

  describe("Edge Cases", () => {
    test("handles large numbers within integer range", () => {
      expect(evaluateExpression("1000000 + 1000000")).toBe(2000000);
      expect(evaluateExpression("999999 * 2")).toBe(1999998);
    });

    test("handles expression with only parentheses", () => {
      expect(evaluateExpression("(((42)))")).toBe(42);
    });

    test("empty spaces only should fail", () => {
      expect(() => evaluateExpression("   ")).toThrow();
    });

    test("incomplete expressions with trailing operators", () => {
      expect(() => evaluateExpression("1 +")).toThrow(ParseError);
      expect(() => evaluateExpression("1 -")).toThrow(ParseError);
      expect(() => evaluateExpression("1 *")).toThrow(ParseError);
      expect(() => evaluateExpression("1 /")).toThrow(ParseError);
      expect(() => evaluateExpression("8 + 9 - 5 + 7 +")).toThrow(ParseError);
    });

    test("incomplete expressions have helpful error messages", () => {
      try {
        evaluateExpression("8 + 9 - 5 + 7 +");
        expect.fail("Should have thrown ParseError");
      } catch (e) {
        expect(e).toBeInstanceOf(ParseError);
        expect((e as ParseError).message).toContain("Expected expression after '+'");
      }
    });
  });
});
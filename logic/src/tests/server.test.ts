import { describe, test, expect } from "vitest";
import request from "supertest";
import { app } from "../api/server.js";

describe("DSL REST API", () => {
  describe("GET /health", () => {
    test("returns health status", async () => {
      const response = await request(app).get("/health");
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "ok");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("GET /api/info", () => {
    test("returns API information", async () => {
      const response = await request(app).get("/api/info");
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("version");
      expect(response.body).toHaveProperty("endpoints");
      expect(Array.isArray(response.body.endpoints)).toBe(true);
    });
  });

  describe("POST /api/evaluate", () => {
    test("evaluates simple expression", async () => {
      const response = await request(app)
        .post("/api/evaluate")
        .send({ expression: "2 + 3" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        result: 5,
        expression: "2 + 3",
      });
    });

    test("evaluates complex expression with precedence", async () => {
      const response = await request(app)
        .post("/api/evaluate")
        .send({ expression: "2 + 3 * 4" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(14);
    });

    test("evaluates expression with parentheses", async () => {
      const response = await request(app)
        .post("/api/evaluate")
        .send({ expression: "(2 + 3) * 4" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(20);
    });

    test("evaluates expression with unary minus", async () => {
      const response = await request(app)
        .post("/api/evaluate")
        .send({ expression: "-(3 + 4*2) / 5" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(-2);
    });

    test("evaluates division with truncation", async () => {
      const response = await request(app)
        .post("/api/evaluate")
        .send({ expression: "7 / 3" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(2);
    });

    test("returns 400 for missing expression", async () => {
      const response = await request(app)
        .post("/api/evaluate")
        .send({})
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(400);
      expect(response.body.error.type).toBe("ValidationError");
    });

    test("returns 400 for empty expression", async () => {
      const response = await request(app)
        .post("/api/evaluate")
        .send({ expression: "   " })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(400);
      expect(response.body.error.type).toBe("ValidationError");
    });

    test("returns 400 for invalid characters (LexError)", async () => {
      const response = await request(app)
        .post("/api/evaluate")
        .send({ expression: "2 + x" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(400);
      expect(response.body.error.type).toBe("LexError");
      expect(response.body.error.message).toContain("x");
      expect(response.body.error.index).toBe(4);
    });

    test("returns 400 for syntax errors (ParseError)", async () => {
      const response = await request(app)
        .post("/api/evaluate")
        .send({ expression: "2 + * 3" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(400);
      expect(response.body.error.type).toBe("ParseError");
    });

    test("returns 400 for mismatched parentheses", async () => {
      const response = await request(app)
        .post("/api/evaluate")
        .send({ expression: "(1 + 2" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(400);
      expect(response.body.error.type).toBe("ParseError");
      expect(response.body.error.message).toContain(")");
    });

    test("returns 400 for division by zero (EvalError)", async () => {
      const response = await request(app)
        .post("/api/evaluate")
        .send({ expression: "5 / 0" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(400);
      expect(response.body.error.type).toBe("EvalError");
      expect(response.body.error.message).toContain("Division by zero");
    });
  });

  describe("POST /api/tokenize", () => {
    test("tokenizes simple expression", async () => {
      const response = await request(app)
        .post("/api/tokenize")
        .send({ expression: "2 + 3" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(200);
      expect(response.body.expression).toBe("2 + 3");
      expect(Array.isArray(response.body.tokens)).toBe(true);
      expect(response.body.tokens.length).toBe(4); // INT, PLUS, INT, EOF
      expect(response.body.tokens[0].type).toBe("INT");
      expect(response.body.tokens[0].value).toBe("2");
      expect(response.body.tokens[1].type).toBe("PLUS");
      expect(response.body.tokens[2].type).toBe("INT");
      expect(response.body.tokens[2].value).toBe("3");
      expect(response.body.tokens[3].type).toBe("EOF");
    });

    test("tokenizes expression with all operators", async () => {
      const response = await request(app)
        .post("/api/tokenize")
        .send({ expression: "1 + 2 - 3 * 4 / 5" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(200);
      expect(response.body.tokens.length).toBe(10); // 5 numbers + 4 operators + EOF
    });

    test("tokenizes expression with parentheses", async () => {
      const response = await request(app)
        .post("/api/tokenize")
        .send({ expression: "(2 + 3)" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(200);
      expect(response.body.tokens[0].type).toBe("LPAREN");
      expect(response.body.tokens[4].type).toBe("RPAREN");
    });

    test("returns 400 for invalid characters", async () => {
      const response = await request(app)
        .post("/api/tokenize")
        .send({ expression: "2 @ 3" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(400);
      expect(response.body.error.type).toBe("LexError");
    });

    test("returns 400 for missing expression", async () => {
      const response = await request(app)
        .post("/api/tokenize")
        .send({})
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(400);
      expect(response.body.error.type).toBe("ValidationError");
    });
  });

  describe("POST /api/parse", () => {
    test("parses simple expression into AST", async () => {
      const response = await request(app)
        .post("/api/parse")
        .send({ expression: "2 + 3" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(200);
      expect(response.body.expression).toBe("2 + 3");
      expect(response.body.ast).toBeDefined();
      expect(response.body.ast.kind).toBe("BinaryExpr");
      expect(response.body.ast.operator).toBe("+");
    });

    test("parses literal into AST", async () => {
      const response = await request(app)
        .post("/api/parse")
        .send({ expression: "42" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(200);
      expect(response.body.ast.kind).toBe("IntegerLiteral");
      expect(response.body.ast.value).toBe(42);
    });

    test("parses unary expression", async () => {
      const response = await request(app)
        .post("/api/parse")
        .send({ expression: "-5" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(200);
      expect(response.body.ast.kind).toBe("UnaryExpr");
      expect(response.body.ast.operator).toBe("-");
    });

    test("parses nested expression", async () => {
      const response = await request(app)
        .post("/api/parse")
        .send({ expression: "(2 + 3) * 4" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(200);
      expect(response.body.ast.kind).toBe("BinaryExpr");
      expect(response.body.ast.operator).toBe("*");
      expect(response.body.ast.left.kind).toBe("BinaryExpr");
    });

    test("returns 400 for syntax errors", async () => {
      const response = await request(app)
        .post("/api/parse")
        .send({ expression: "2 +" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(400);
      expect(response.body.error.type).toBe("ParseError");
    });

    test("returns 400 for invalid characters", async () => {
      const response = await request(app)
        .post("/api/parse")
        .send({ expression: "abc" })
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(400);
      expect(response.body.error.type).toBe("LexError");
    });

    test("returns 400 for missing expression", async () => {
      const response = await request(app)
        .post("/api/parse")
        .send({})
        .set("Content-Type", "application/json");
      
      expect(response.status).toBe(400);
      expect(response.body.error.type).toBe("ValidationError");
    });
  });

  describe("404 Handler", () => {
    test("returns 404 for unknown routes", async () => {
      const response = await request(app).get("/unknown");
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    test("returns 404 for unknown POST routes", async () => {
      const response = await request(app).post("/api/unknown");
      
      expect(response.status).toBe(404);
    });
  });

  describe("CORS Headers", () => {
    test("includes CORS headers in response", async () => {
      const response = await request(app)
        .post("/api/evaluate")
        .send({ expression: "1 + 1" });
      
      expect(response.headers["access-control-allow-origin"]).toBe("*");
    });

    test("handles OPTIONS preflight request", async () => {
      const response = await request(app).options("/api/evaluate");
      
      expect(response.status).toBe(200);
    });
  });
});

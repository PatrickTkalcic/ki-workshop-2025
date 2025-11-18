import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { evaluateExpression, tokenize, parse } from "../index.js";
import { LexError, ParseError, EvalError } from "../core/errors.js";
import {
  EvaluateRequest,
  EvaluateResponse,
  TokenizeRequest,
  TokenizeResponse,
  ParseRequest,
  ParseResponse,
  ErrorResponse,
} from "./api-types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Load Swagger documentation
const swaggerDocument = JSON.parse(
  readFileSync(join(__dirname, "../../swagger.json"), "utf-8")
);

// Middleware
app.use(express.json());

// CORS middleware for frontend integration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Swagger UI documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: "DSL API Documentation",
  customCss: ".swagger-ui .topbar { display: none }",
}));

/**
 * GET / - Redirect to API documentation
 */
app.get("/", (req: Request, res: Response) => {
  res.redirect("/api-docs");
});

/**
 * Health check endpoint
 */
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * GET /api/info - Get API information
 */
app.get("/api/info", (req: Request, res: Response) => {
  res.json({
    name: "DSL Expression Evaluator API",
    version: "1.0.0",
    description: "REST API for evaluating mathematical expressions",
    endpoints: [
      { method: "POST", path: "/api/evaluate", description: "Evaluate an expression and return the result" },
      { method: "POST", path: "/api/tokenize", description: "Tokenize an expression into tokens" },
      { method: "POST", path: "/api/parse", description: "Parse an expression into an AST" },
    ],
    supportedOperators: ["+", "-", "*", "/"],
    features: ["Integer arithmetic", "Operator precedence", "Parentheses", "Unary minus", "Error handling"],
  });
});

/**
 * POST /api/evaluate - Evaluate an expression
 * 
 * Request body: { expression: string }
 * Response: { result: number, expression: string }
 */
app.post("/api/evaluate", (req: Request<{}, {}, EvaluateRequest>, res: Response<EvaluateResponse | ErrorResponse>) => {
  const { expression } = req.body;

  if (!expression || typeof expression !== "string") {
    return res.status(400).json({
      error: {
        type: "ValidationError",
        message: "Expression is required and must be a string",
      },
    });
  }

  if (expression.trim().length === 0) {
    return res.status(400).json({
      error: {
        type: "ValidationError",
        message: "Expression cannot be empty",
      },
    });
  }

  try {
    const result = evaluateExpression(expression);
    res.json({ result, expression });
  } catch (error) {
    handleDSLError(error, expression, res);
  }
});

/**
 * POST /api/tokenize - Tokenize an expression
 * 
 * Request body: { expression: string }
 * Response: { tokens: Token[], expression: string }
 */
app.post("/api/tokenize", (req: Request<{}, {}, TokenizeRequest>, res: Response<TokenizeResponse | ErrorResponse>) => {
  const { expression } = req.body;

  if (!expression || typeof expression !== "string") {
    return res.status(400).json({
      error: {
        type: "ValidationError",
        message: "Expression is required and must be a string",
      },
    });
  }

  try {
    const tokens = tokenize(expression);
    res.json({ tokens, expression });
  } catch (error) {
    handleDSLError(error, expression, res);
  }
});

/**
 * POST /api/parse - Parse an expression into AST
 * 
 * Request body: { expression: string }
 * Response: { ast: ASTNode, expression: string }
 */
app.post("/api/parse", (req: Request<{}, {}, ParseRequest>, res: Response<ParseResponse | ErrorResponse>) => {
  const { expression } = req.body;

  if (!expression || typeof expression !== "string") {
    return res.status(400).json({
      error: {
        type: "ValidationError",
        message: "Expression is required and must be a string",
      },
    });
  }

  try {
    const tokens = tokenize(expression);
    const ast = parse(tokens);
    res.json({ ast, expression });
  } catch (error) {
    handleDSLError(error, expression, res);
  }
});

/**
 * Helper function to handle DSL-specific errors
 */
function handleDSLError(error: unknown, expression: string, res: Response<ErrorResponse>): void {
  if (error instanceof LexError) {
    res.status(400).json({
      error: {
        type: "LexError",
        message: error.message,
        index: error.index,
        expression,
      },
    });
  } else if (error instanceof ParseError) {
    res.status(400).json({
      error: {
        type: "ParseError",
        message: error.message,
        index: error.index,
        expression,
      },
    });
  } else if (error instanceof EvalError) {
    res.status(400).json({
      error: {
        type: "EvalError",
        message: error.message,
        index: error.index,
        expression,
      },
    });
  } else {
    console.error("Unexpected error:", error);
    res.status(500).json({
      error: {
        type: "ServerError",
        message: "An unexpected error occurred",
      },
    });
  }
}

/**
 * Global error handler middleware
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: {
      type: "ServerError",
      message: "Internal server error",
    },
  } as ErrorResponse);
});

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      type: "ServerError",
      message: `Route ${req.method} ${req.path} not found`,
    },
  } as ErrorResponse);
});

/**
 * Start the server
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`🚀 DSL API Server running on http://localhost:${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`📚 API Info: http://localhost:${PORT}/api/info`);
    console.log(`❤️  Health: http://localhost:${PORT}/health`);
  });
}

export { app };

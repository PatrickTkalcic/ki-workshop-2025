# DSL Expression Evaluator REST API

REST API für die Evaluierung mathematischer Ausdrücke mit der domain-spezifischen Expression Language (DSL).

## Installation

```bash
npm install
```

## Development

Starte den Development-Server mit Hot-Reload:

```bash
npm run dev
```

Der Server läuft standardmäßig auf `http://localhost:3000`

## Production

Build und starte den Production-Server:

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- **GET** `/health`
- Gibt den Server-Status zurück

### API Information
- **GET** `/api/info`
- Gibt Informationen über verfügbare Endpoints zurück

### Expression Evaluation
- **POST** `/api/evaluate`
- Evaluiert einen mathematischen Ausdruck

**Request Body:**
```json
{
  "expression": "2 + 3 * 4"
}
```

**Response:**
```json
{
  "result": 14,
  "expression": "2 + 3 * 4"
}
```

### Tokenization
- **POST** `/api/tokenize`
- Tokenisiert einen Ausdruck

**Request Body:**
```json
{
  "expression": "2 + 3"
}
```

**Response:**
```json
{
  "tokens": [
    { "type": "INT", "value": "2", "index": 0 },
    { "type": "PLUS", "value": "+", "index": 2 },
    { "type": "INT", "value": "3", "index": 4 },
    { "type": "EOF", "value": "", "index": 5 }
  ],
  "expression": "2 + 3"
}
```

### Parsing
- **POST** `/api/parse`
- Parsed einen Ausdruck in einen Abstract Syntax Tree (AST)

**Request Body:**
```json
{
  "expression": "2 + 3"
}
```

**Response:**
```json
{
  "ast": {
    "kind": "BinaryExpr",
    "operator": "+",
    "left": {
      "kind": "IntegerLiteral",
      "value": 2,
      "index": 0
    },
    "right": {
      "kind": "IntegerLiteral",
      "value": 3,
      "index": 4
    },
    "index": 2
  },
  "expression": "2 + 3"
}
```

## Error Handling

Bei Fehlern gibt die API eine strukturierte Error-Response zurück:

```json
{
  "error": {
    "type": "LexError" | "ParseError" | "EvalError" | "ValidationError" | "ServerError",
    "message": "Error description",
    "index": 5,
    "expression": "2 + x"
  }
}
```

### Error-Typen:

- **LexError (400)**: Ungültiges Zeichen im Ausdruck
- **ParseError (400)**: Syntax-Fehler (z.B. fehlende Klammern)
- **EvalError (400)**: Runtime-Fehler (z.B. Division durch Null)
- **ValidationError (400)**: Ungültige Request-Daten
- **ServerError (500)**: Interner Server-Fehler

## Beispiele

### cURL

```bash
# Evaluate
curl -X POST http://localhost:3000/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{"expression": "-(3 + 4*2) / 5"}'

# Tokenize
curl -X POST http://localhost:3000/api/tokenize \
  -H "Content-Type: application/json" \
  -d '{"expression": "(2 + 3) * 4"}'

# Parse
curl -X POST http://localhost:3000/api/parse \
  -H "Content-Type: application/json" \
  -d '{"expression": "7 / 3"}'
```

### JavaScript (Fetch API)

```javascript
// Evaluate expression
const response = await fetch('http://localhost:3000/api/evaluate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ expression: '2 + 3 * 4' })
});
const data = await response.json();
console.log(data.result); // 14
```

## Features

- ✅ Integer-Arithmetik (+, -, *, /)
- ✅ Operator-Präzedenz (* und / vor + und -)
- ✅ Klammerung
- ✅ Unary Minus
- ✅ Division mit Truncation-toward-Zero
- ✅ Detailliertes Error-Handling mit Positionsangaben
- ✅ CORS-Support für Frontend-Integration
- ✅ TypeScript Type-Safety

## Tests

```bash
npm test
```

## Environment Variables

- `PORT`: Server-Port (Standard: 3000)

```bash
PORT=8080 npm run dev
```

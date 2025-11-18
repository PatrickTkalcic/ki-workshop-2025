# OpenAPI (Swagger) Dokumentation

Vollständige OpenAPI 3.0 Spezifikation für die DSL Expression Evaluator API.

## Verwendung

### 1. Interaktive Dokumentation (Swagger UI)

Starte den Server und öffne die Swagger UI im Browser:

```bash
npm run dev
```

Dann öffne: **http://localhost:3000/api-docs**

Die Swagger UI bietet:
- ✅ Interaktive API-Exploration
- ✅ "Try it out" Funktionalität für alle Endpoints
- ✅ Vollständige Schema-Dokumentation
- ✅ Beispiele für Request/Response
- ✅ Detaillierte Error-Dokumentation

### 2. JSON Schema

Die OpenAPI-Spezifikation ist in `swagger.json` verfügbar und kann mit verschiedenen Tools verwendet werden:

#### Import in Postman
1. Öffne Postman
2. Klicke auf "Import"
3. Wähle `swagger.json`
4. Alle Endpoints werden automatisch importiert

#### Import in Insomnia
1. Öffne Insomnia
2. Klicke auf "Import/Export"
3. Wähle "Import Data" → "From File"
4. Wähle `swagger.json`

#### Code-Generierung
```bash
# Client-Code generieren (verschiedene Sprachen)
npx @openapitools/openapi-generator-cli generate \
  -i swagger.json \
  -g typescript-fetch \
  -o ./generated-client
```

### 3. Direkt vom Server

Die Swagger-JSON ist auch zur Laufzeit verfügbar:

```bash
curl http://localhost:3000/api-docs/swagger.json
```

## API Übersicht

### Endpoints

| Method | Endpoint | Beschreibung |
|--------|----------|--------------|
| GET | `/health` | Health Check |
| GET | `/api/info` | API Informationen |
| POST | `/api/evaluate` | Expression evaluieren |
| POST | `/api/tokenize` | Expression tokenisieren |
| POST | `/api/parse` | Expression in AST parsen |
| GET | `/api-docs` | Swagger UI Dokumentation |

### Schemas

Die API definiert folgende Hauptschemas:

- **EvaluateRequest/Response** - Expression-Evaluation
- **TokenizeRequest/Response** - Tokenisierung
- **ParseRequest/Response** - AST-Generierung
- **Token** - Token-Definition mit Type, Value, Index
- **ASTNode** - Abstract Syntax Tree Nodes
  - `IntegerLiteral` - Integer-Wert
  - `BinaryExpr` - Binäre Operation (+, -, *, /)
  - `UnaryExpr` - Unäre Operation (-)
- **ErrorResponse** - Strukturierte Fehlerantworten

### Error Types

Alle Fehler folgen einem einheitlichen Format:

```json
{
  "error": {
    "type": "LexError" | "ParseError" | "EvalError" | "ValidationError" | "ServerError",
    "message": "Detailed error message",
    "index": 4,
    "expression": "2 + x"
  }
}
```

## Beispiele

### cURL Beispiele aus Swagger

```bash
# Evaluate Expression
curl -X POST "http://localhost:3000/api/evaluate" \
  -H "Content-Type: application/json" \
  -d '{"expression": "2 + 3 * 4"}'

# Response: {"result": 14, "expression": "2 + 3 * 4"}
```

```bash
# Tokenize Expression
curl -X POST "http://localhost:3000/api/tokenize" \
  -H "Content-Type: application/json" \
  -d '{"expression": "(2 + 3) * 4"}'

# Response: Detailed token array
```

```bash
# Parse Expression
curl -X POST "http://localhost:3000/api/parse" \
  -H "Content-Type: application/json" \
  -d '{"expression": "-(3 + 4*2) / 5"}'

# Response: Complete AST structure
```

### JavaScript/TypeScript Client

Mit der Swagger-Spec können Sie automatisch typsichere Clients generieren:

```typescript
// Generierter TypeScript Client
import { DefaultApi, Configuration } from './generated-client';

const api = new DefaultApi(
  new Configuration({ basePath: 'http://localhost:3000' })
);

// Vollständig typisierte API-Aufrufe
const result = await api.evaluateExpression({
  evaluateRequest: { expression: '2 + 3 * 4' }
});

console.log(result.result); // 14
```

## Features der OpenAPI Spec

✅ **OpenAPI 3.0.3** Standard  
✅ **Vollständige Schema-Definitionen** mit Discriminators  
✅ **Detaillierte Beispiele** für jeden Endpoint  
✅ **Error Response Examples** für alle Fehlertypen  
✅ **Request/Response Validierung**  
✅ **Type-Safe** Client-Generierung möglich  
✅ **Tags** für logische Gruppierung  
✅ **Reusable Components** (Schemas, Responses)

## Validierung

Die Swagger-Spezifikation kann validiert werden:

```bash
# Mit swagger-cli
npx swagger-cli validate swagger.json

# Mit openapi-generator
npx @openapitools/openapi-generator-cli validate -i swagger.json
```

## Erweiterung

Um neue Endpoints zur Dokumentation hinzuzufügen:

1. **Füge den Endpoint in `swagger.json` hinzu**:
   ```json
   "/api/new-endpoint": {
     "post": {
       "tags": ["NewFeature"],
       "summary": "Description",
       ...
     }
   }
   ```

2. **Definiere Request/Response Schemas** in `components/schemas`

3. **Füge Beispiele hinzu** für bessere Dokumentation

4. **Implementiere den Endpoint** in `src/api/server.ts`

5. **Swagger UI aktualisiert sich automatisch** beim nächsten Start

## Externe Tools

Die Swagger-Spec ist kompatibel mit:
- **Swagger Editor** - Online Editor für OpenAPI
- **Postman** - API Testing
- **Insomnia** - API Client
- **OpenAPI Generator** - Code-Generierung für 50+ Sprachen
- **Redoc** - Alternative Dokumentations-UI
- **Stoplight** - API Design Platform

## Links

- [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.3)
- [Swagger Editor](https://editor.swagger.io/)
- [OpenAPI Generator](https://openapi-generator.tech/)

# Logic Package - Ordnerstruktur

Optimierte Ordnerstruktur für das DSL-Backend mit klarer Separation of Concerns.

## Ordnerstruktur

```
logic/src/
├── core/                   # DSL Kernlogik
│   ├── index.ts           # Core Module Exports
│   ├── errors.ts          # Custom Error-Klassen (LexError, ParseError, EvalError)
│   ├── tokens.ts          # Tokenizer/Lexer
│   ├── ast.ts             # AST Node-Definitionen
│   ├── parser.ts          # Recursive-Descent Parser
│   └── evaluator.ts       # AST Evaluator
│
├── api/                    # REST API
│   ├── index.ts           # API Module Exports
│   ├── server.ts          # Express Server mit Endpoints
│   └── api-types.ts       # TypeScript Types für Request/Response
│
├── tests/                  # Test-Dateien
│   ├── index.test.ts      # Core DSL Tests (34 Tests)
│   └── server.test.ts     # API Endpoint Tests (29 Tests)
│
└── index.ts               # Main Entry Point (Public API)
```

## Module

### 📦 **core/** - DSL Kernlogik

Enthält die komplette Implementierung der Expression Language:
- **Tokenizer**: Konvertiert Strings in Token-Arrays
- **Parser**: Erstellt AST aus Tokens (Recursive-Descent)
- **Evaluator**: Berechnet Ergebnisse aus AST
- **Errors**: Strukturierte Fehlerbehandlung mit Position-Tracking

**Verwendung:**
```typescript
import { evaluateExpression, tokenize, parse } from './core';
```

### 🌐 **api/** - REST API

Express-basierte REST API für Frontend-Integration:
- **server.ts**: API Endpoints (`/api/evaluate`, `/api/tokenize`, `/api/parse`)
- **api-types.ts**: TypeScript Interfaces für Request/Response

**Verwendung:**
```typescript
import { app } from './api';
```

### 🧪 **tests/** - Test Suite

Umfassende Tests für alle Funktionalitäten:
- **index.test.ts**: Unit-Tests für DSL-Core (Literale, Operatoren, Fehler)
- **server.test.ts**: Integration-Tests für API-Endpoints

**Ausführen:**
```bash
npm test
```

## Public API (index.ts)

Der Main Entry Point exportiert alle wichtigen Funktionen:

```typescript
// DSL Core
export { evaluateExpression, tokenize, parse, evaluate } from './core';

// Types
export type { Token, ASTNode, BinaryExpr, UnaryExpr } from './core';

// Errors
export { LexError, ParseError, EvalError } from './core';
```

## Vorteile der Struktur

✅ **Klare Separation**: Core-Logik getrennt von API-Code  
✅ **Modulare Organisation**: Jeder Ordner hat einen klaren Zweck  
✅ **Einfaches Testing**: Tests sind zentral organisiert  
✅ **Skalierbar**: Neue Features können einfach hinzugefügt werden  
✅ **Type-Safe**: Vollständige TypeScript-Unterstützung  
✅ **Tree-Shakeable**: Ungenutzte Module werden beim Build eliminiert

## Import-Patterns

### Von außerhalb des Packages:
```typescript
// Hauptfunktion
import { evaluateExpression } from 'logic';

// Low-Level API
import { tokenize, parse, evaluate } from 'logic';

// Types
import type { Token, ASTNode } from 'logic';
```

### Innerhalb des Packages:
```typescript
// Core-Module verwenden relative Imports untereinander
import { LexError } from './errors.js';

// API-Module importieren aus core
import { tokenize } from '../core/index.js';

// Tests importieren aus Parent
import { evaluateExpression } from '../index.js';
```

## Erweiterung

### Neue Core-Funktionalität hinzufügen:
1. Datei in `core/` erstellen
2. In `core/index.ts` exportieren
3. Tests in `tests/` hinzufügen

### Neuen API-Endpoint hinzufügen:
1. Endpoint in `api/server.ts` definieren
2. Types in `api/api-types.ts` hinzufügen
3. Tests in `tests/server.test.ts` schreiben

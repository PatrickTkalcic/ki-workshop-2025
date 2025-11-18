# DSL Expression Evaluator - Frontend Specification for v0

## Project Overview

Build a modern, interactive web application for evaluating mathematical expressions using a custom Domain-Specific Language (DSL). The frontend should provide a calculator-like interface with real-time expression evaluation, syntax highlighting, and detailed error feedback.

## API Integration

**Base URL:** `http://localhost:3000`

### Available Endpoints:

1. **POST `/api/evaluate`**
   - Evaluates a mathematical expression
   - Request: `{ "expression": string }`
   - Response: `{ "result": number, "expression": string }`

2. **POST `/api/tokenize`**
   - Tokenizes an expression into lexical tokens
   - Request: `{ "expression": string }`
   - Response: `{ "tokens": Token[], "expression": string }`

3. **POST `/api/parse`**
   - Parses an expression into an Abstract Syntax Tree
   - Request: `{ "expression": string }`
   - Response: `{ "ast": ASTNode, "expression": string }`

4. **GET `/health`**
   - Health check endpoint
   - Response: `{ "status": "ok", "timestamp": string }`

### Error Handling:

All endpoints return errors in this format (HTTP 400/500):
```json
{
  "error": {
    "type": "LexError" | "ParseError" | "EvalError" | "ValidationError" | "ServerError",
    "message": string,
    "index": number (optional),
    "expression": string (optional)
  }
}
```

## UI/UX Requirements

### 1. Main Calculator Interface

**Layout:**
- Clean, modern calculator design with dark/light mode toggle
- Large input field for expression entry (monospace font)
- Prominent result display with large, bold numbers
- Expression history sidebar (collapsible)
- Feature tabs: "Calculator", "Tokenizer", "Parser"

**Input Field:**
- Monospace font (e.g., 'Fira Code', 'Monaco', 'Consolas')
- Real-time syntax highlighting:
  - Numbers: Blue (#2563eb)
  - Operators (+, -, *, /): Orange (#ea580c)
  - Parentheses: Purple (#9333ea)
  - Invalid characters: Red underline
- Placeholder: "Enter expression (e.g., 2 + 3 * 4)"
- Auto-focus on page load
- Support keyboard shortcuts (Enter to evaluate, Ctrl+L to clear)

**Result Display:**
- Large, bold font (3-4rem size)
- Animate result changes (fade-in effect)
- Show intermediate calculation steps if possible
- Copy result button (with toast notification)

**Error Display:**
- Show errors inline below input field
- Red background with white text
- Display error type badge (LexError, ParseError, etc.)
- Show error position with a visual pointer/caret in the expression
- Helpful error messages with suggestions

### 2. Button Panel

**Number Buttons (0-9):**
- Grid layout (3x4)
- Large, touchable buttons
- Hover effects with scale animation

**Operator Buttons:**
- `+` Addition
- `-` Subtraction  
- `*` Multiplication
- `/` Division
- Visual distinction (different color, e.g., orange/amber)

**Special Buttons:**
- `(` and `)` - Parentheses (purple)
- `C` - Clear (red)
- `⌫` - Backspace (gray)
- `=` - Evaluate (green, prominent)
- `±` - Toggle sign (gray)

### 3. History Panel (Sidebar)

**Features:**
- List of previous calculations (last 20)
- Each entry shows: expression → result
- Click to reuse expression
- Delete individual history items
- Clear all history button
- Local storage persistence
- Timestamps (relative, e.g., "2 minutes ago")

**Example Entry:**
```
2 + 3 * 4 = 14
2 minutes ago
[Reuse] [Delete]
```

### 4. Tokenizer View (Tab)

**Purpose:** Educational view showing how expressions are tokenized

**Display:**
- Input expression at top
- Grid/table of tokens below:
  - Token Type (badge with color coding)
  - Token Value
  - Position Index
- Color coding:
  - INT: Blue
  - Operators: Orange
  - Parentheses: Purple
  - EOF: Gray

**Example:**
```
Expression: 2 + 3

┌─────────┬───────┬───────┐
│  Type   │ Value │ Index │
├─────────┼───────┼───────┤
│ [INT]   │   2   │   0   │
│ [PLUS]  │   +   │   2   │
│ [INT]   │   3   │   4   │
│ [EOF]   │       │   5   │
└─────────┴───────┴───────┘
```

### 5. Parser View (Tab)

**Purpose:** Visualize Abstract Syntax Tree

**Display:**
- Tree visualization with interactive nodes
- Collapsible/expandable branches
- Node types with icons:
  - IntegerLiteral: 🔢
  - BinaryExpr: ⚡
  - UnaryExpr: ➖
- Hover to see full node details
- JSON view toggle for developers

**Tree Visualization:**
```
         [BinaryExpr: *]
         /            \
    [BinaryExpr: +]   [IntegerLiteral: 4]
      /        \
[IntLit: 2]  [IntLit: 3]

Expression: (2 + 3) * 4 = 20
```

### 6. Example Gallery

**Pre-built Examples:**
- Simple: "2 + 3" → 5
- Precedence: "2 + 3 * 4" → 14
- Parentheses: "(2 + 3) * 4" → 20
- Unary: "-(3 + 4*2) / 5" → -2
- Division: "7 / 3" → 2
- Complex: "((10 - 5) * (3 + 2)) / (1 + 4)" → 5

**Display:**
- Card-based layout
- Click to load example
- Shows expression, expected result, and description
- Tag with "beginner", "intermediate", "advanced"

### 7. Settings/Info Panel

**Features:**
- Theme toggle (light/dark)
- API endpoint configuration (for development)
- About section with:
  - Supported operators: +, -, *, /
  - Precedence rules
  - Integer arithmetic info
  - Division truncation explanation
- Keyboard shortcuts help
- Link to API documentation (Swagger)

## Technical Requirements

### Stack:
- **Framework:** React with TypeScript (or Next.js)
- **Styling:** Tailwind CSS
- **State Management:** React Context or Zustand
- **API Client:** fetch or axios
- **Icons:** Lucide React or Hero Icons
- **Animations:** Framer Motion
- **Storage:** localStorage for history

### Component Structure:

```
App
├── Header (title, theme toggle, info button)
├── TabNavigation (Calculator | Tokenizer | Parser)
├── CalculatorTab
│   ├── ExpressionInput (with syntax highlighting)
│   ├── ResultDisplay
│   ├── ErrorDisplay
│   ├── ButtonGrid
│   └── HistoryPanel
├── TokenizerTab
│   ├── ExpressionInput
│   └── TokenTable
├── ParserTab
│   ├── ExpressionInput
│   └── ASTVisualization (tree or JSON)
└── ExampleGallery (modal or bottom sheet)
```

### Key Features to Implement:

1. **Real-time Evaluation:**
   - Debounced API calls (300ms after typing stops)
   - Optional: Show "Calculating..." indicator
   - Handle network errors gracefully

2. **Syntax Highlighting:**
   - Use regex or simple parser to highlight as user types
   - Highlight matching parentheses on hover

3. **Error Visualization:**
   - Show error position with caret: `2 + x` → `    ^` (under the error)
   - Animate error appearance

4. **Keyboard Support:**
   - All number keys (0-9)
   - Operator keys (+, -, *, /)
   - Enter/Return to evaluate
   - Escape to clear
   - Backspace to delete
   - Arrow keys for cursor navigation

5. **Responsive Design:**
   - Mobile-first approach
   - Touch-friendly buttons (min 44px tap target)
   - Collapsible history on mobile
   - Stacked layout for small screens

6. **Accessibility:**
   - ARIA labels for all buttons
   - Keyboard navigation
   - Screen reader announcements for results/errors
   - High contrast mode support

7. **Performance:**
   - Lazy load tabs
   - Virtualized history list for long lists
   - Memoized expensive calculations

## Example API Calls (TypeScript)

```typescript
// Evaluate expression
async function evaluateExpression(expression: string) {
  const response = await fetch('http://localhost:3000/api/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
  
  return await response.json(); // { result: number, expression: string }
}

// Tokenize expression
async function tokenizeExpression(expression: string) {
  const response = await fetch('http://localhost:3000/api/tokenize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression })
  });
  
  return await response.json(); // { tokens: Token[], expression: string }
}

// Parse expression
async function parseExpression(expression: string) {
  const response = await fetch('http://localhost:3000/api/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression })
  });
  
  return await response.json(); // { ast: ASTNode, expression: string }
}
```

## TypeScript Types

```typescript
type TokenType = 'INT' | 'PLUS' | 'MINUS' | 'STAR' | 'SLASH' | 'LPAREN' | 'RPAREN' | 'EOF';

interface Token {
  type: TokenType;
  value: string;
  index: number;
}

type ASTNode = IntegerLiteral | BinaryExpr | UnaryExpr;

interface IntegerLiteral {
  kind: 'IntegerLiteral';
  value: number;
  index: number;
}

interface BinaryExpr {
  kind: 'BinaryExpr';
  operator: '+' | '-' | '*' | '/';
  left: ASTNode;
  right: ASTNode;
  index: number;
}

interface UnaryExpr {
  kind: 'UnaryExpr';
  operator: '-';
  operand: ASTNode;
  index: number;
}

interface ErrorResponse {
  error: {
    type: 'LexError' | 'ParseError' | 'EvalError' | 'ValidationError' | 'ServerError';
    message: string;
    index?: number;
    expression?: string;
  };
}
```

## Design Inspiration

**Color Palette (Dark Mode):**
- Background: #0f172a (slate-900)
- Surface: #1e293b (slate-800)
- Primary: #3b82f6 (blue-500)
- Accent: #f59e0b (amber-500)
- Error: #ef4444 (red-500)
- Success: #10b981 (green-500)
- Text: #f1f5f9 (slate-100)

**Color Palette (Light Mode):**
- Background: #ffffff
- Surface: #f8fafc (slate-50)
- Primary: #2563eb (blue-600)
- Accent: #ea580c (orange-600)
- Error: #dc2626 (red-600)
- Success: #059669 (green-600)
- Text: #0f172a (slate-900)

**Typography:**
- Headings: 'Inter' or 'System UI'
- Body: 'Inter' or 'System UI'
- Code/Monospace: 'Fira Code' or 'Monaco'

**Spacing:**
- Use consistent 4px/8px grid system
- Generous padding for touch targets
- Visual breathing room between sections

## User Flow

1. **First Visit:**
   - See clean calculator interface
   - Placeholder text guides user
   - Example gallery visible/accessible

2. **Basic Calculation:**
   - User types or clicks "2 + 3"
   - Real-time syntax highlighting
   - Press Enter or "=" button
   - Result animates in
   - Calculation added to history

3. **Exploring Features:**
   - Switch to Tokenizer tab → see token breakdown
   - Switch to Parser tab → see AST visualization
   - Click example from gallery → auto-fill and evaluate

4. **Error Handling:**
   - User types "2 + x"
   - Error appears: "Unexpected character 'x' at index 4"
   - Visual indicator under 'x'
   - Error type badge shows "LexError"

5. **History Usage:**
   - Browse previous calculations
   - Click to reuse
   - Delete unwanted entries
   - History persists across sessions

## Additional Features (Optional Enhancements)

- **Step-by-step Evaluation:** Show how expression is evaluated (precedence visualization)
- **Share Functionality:** Generate shareable link with expression
- **Export Results:** Download history as CSV/JSON
- **Dark/Light/Auto Theme:** Follow system preference
- **Animations:** Smooth transitions between tabs and result changes
- **PWA Support:** Installable web app
- **Offline Mode:** Cache and work without connection (with warning)
- **Custom Themes:** User can customize colors
- **Expression Library:** Save favorite expressions
- **Tutorial Mode:** Interactive guide for new users

## Testing Scenarios

Ensure the frontend handles these cases:

1. **Valid Expressions:**
   - "42" → 42
   - "2 + 3" → 5
   - "10 - 15" → -5
   - "3 * 4" → 12
   - "7 / 3" → 2
   - "(2 + 3) * 4" → 20
   - "-(3 + 4*2) / 5" → -2

2. **Error Cases:**
   - "2 + x" → LexError
   - "(1 + 2" → ParseError (missing closing paren)
   - "2 + * 3" → ParseError (unexpected operator)
   - "5 / 0" → EvalError (division by zero)
   - "" → ValidationError (empty expression)

3. **Edge Cases:**
   - Very long expressions
   - Multiple spaces "2   +   3"
   - Negative numbers "-5 + 3"
   - Nested parentheses "((1+2)*(3-1))"

## Success Criteria

The frontend should:
- ✅ Successfully evaluate all valid expressions
- ✅ Display clear, helpful error messages
- ✅ Provide smooth, responsive user experience
- ✅ Work on mobile and desktop devices
- ✅ Maintain calculation history across sessions
- ✅ Show tokenization and AST visualization
- ✅ Support keyboard and mouse input
- ✅ Be accessible to screen readers
- ✅ Have fast load times (<2s)
- ✅ Handle API errors gracefully

---

**Note for v0:** Please create a modern, polished calculator interface with the three main views (Calculator, Tokenizer, Parser). Focus on clean design, smooth animations, and excellent error handling. The UI should feel professional and educational, suitable for both casual users and developers learning about expression parsing.

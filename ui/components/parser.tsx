'use client'

import { useState, useEffect } from 'react'

interface ASTNode {
  kind: string
  value?: number
  operator?: string
  left?: ASTNode
  right?: ASTNode
  operand?: ASTNode
  index: number
}

interface ParserProps {
  expression: string
}

export default function Parser({ expression }: ParserProps) {
  const [ast, setAst] = useState<ASTNode | null>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [jsonView, setJsonView] = useState(false)

  useEffect(() => {
    if (!expression.trim()) {
      setAst(null)
      setError(null)
      return
    }

    const parse = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('http://localhost:3001/api/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expression }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          setError(errorData.error)
          setAst(null)
          return
        }

        const data = await response.json()
        setAst(data.ast)
      } catch (err) {
        setError({ type: 'NetworkError', message: 'Failed to parse' })
        setAst(null)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(parse, 300)
    return () => clearTimeout(timer)
  }, [expression])

  const TreeNode = ({ node }: { node: ASTNode }) => {
    const [expanded, setExpanded] = useState(true)
    const isLeaf = !node.left && !node.right && !node.operand

    const getIcon = () => {
      switch (node.kind) {
        case 'IntegerLiteral':
          return '🔢'
        case 'BinaryExpr':
          return '⚡'
        case 'UnaryExpr':
          return '➖'
        default:
          return '❓'
      }
    }

    return (
      <div className="ml-4">
        <div className="minecraft-block bg-input p-3 mb-2 cursor-pointer hover:bg-secondary" onClick={() => setExpanded(!expanded)}>
          <span className="text-xl mr-2">{getIcon()}</span>
          <span className="font-bold">{node.kind}</span>
          {node.kind === 'IntegerLiteral' && <span className="text-accent ml-2">= {node.value}</span>}
          {node.kind === 'UnaryExpr' && <span className="text-accent ml-2">op: {node.operator}</span>}
          {node.kind === 'BinaryExpr' && <span className="text-accent ml-2">op: {node.operator}</span>}
          {!isLeaf && <span className="ml-2 text-muted">[{expanded ? '−' : '+'}]</span>}
        </div>
        {expanded && (
          <>
            {node.left && <TreeNode node={node.left} />}
            {node.right && <TreeNode node={node.right} />}
            {node.operand && <TreeNode node={node.operand} />}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="minecraft-block bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">AST TREE</h2>
        <button
          onClick={() => setJsonView(!jsonView)}
          className="minecraft-button bg-secondary text-sm"
        >
          {jsonView ? 'TREE VIEW' : 'JSON VIEW'}
        </button>
      </div>

      {error && (
        <div className="minecraft-block bg-destructive p-4 mb-6 text-destructive-foreground">
          <div className="text-sm font-bold">{error.type}</div>
          <div>{error.message}</div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-muted animate-pulse">PARSING...</div>
      )}

      {ast && (
        <div className="minecraft-block bg-input p-4 overflow-auto max-h-96">
          {jsonView ? (
            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-words">
              {JSON.stringify(ast, null, 2)}
            </pre>
          ) : (
            <TreeNode node={ast} />
          )}
        </div>
      )}

      {!ast && !error && !loading && (
        <div className="text-center py-12 text-muted">
          Enter an expression to see the parse tree
        </div>
      )}
    </div>
  )
}

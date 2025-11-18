'use client'

import { useState, useEffect } from 'react'

interface Token {
  type: string
  value: string
  index: number
}

interface TokenizerProps {
  expression: string
}

export default function Tokenizer({ expression }: TokenizerProps) {
  const [tokens, setTokens] = useState<Token[]>([])
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!expression.trim()) {
      setTokens([])
      setError(null)
      return
    }

    const tokenize = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('http://localhost:3001/api/tokenize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expression }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          setError(errorData.error)
          setTokens([])
          return
        }

        const data = await response.json()
        setTokens(data.tokens)
      } catch (err) {
        setError({ type: 'NetworkError', message: 'Failed to tokenize' })
        setTokens([])
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(tokenize, 300)
    return () => clearTimeout(timer)
  }, [expression])

  const getTokenColor = (type: string) => {
    switch (type) {
      case 'INT':
        return 'bg-blue-900 text-blue-200'
      case 'PLUS':
      case 'MINUS':
      case 'STAR':
      case 'SLASH':
        return 'bg-amber-900 text-amber-200'
      case 'LPAREN':
      case 'RPAREN':
        return 'bg-purple-900 text-purple-200'
      case 'EOF':
        return 'bg-gray-700 text-gray-300'
      default:
        return 'bg-primary text-primary-foreground'
    }
  }

  return (
    <div className="minecraft-block bg-card p-6">
      <h2 className="text-2xl font-bold mb-6">TOKENIZATION</h2>

      {error && (
        <div className="minecraft-block bg-destructive p-4 mb-6 text-destructive-foreground">
          <div className="text-sm font-bold">{error.type}</div>
          <div>{error.message}</div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-muted animate-pulse">TOKENIZING...</div>
      )}

      {tokens.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-2 border-primary">
            <thead>
              <tr className="bg-secondary">
                <th className="border-2 border-primary p-3 text-left">TYPE</th>
                <th className="border-2 border-primary p-3 text-left">VALUE</th>
                <th className="border-2 border-primary p-3 text-left">INDEX</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, i) => (
                <tr key={i} className="hover:bg-input transition-colors">
                  <td className="border-2 border-primary p-3">
                    <span className={`inline-block px-2 py-1 font-bold text-sm minecraft-block ${getTokenColor(token.type)}`}>
                      {token.type}
                    </span>
                  </td>
                  <td className="border-2 border-primary p-3 font-mono text-accent">
                    "{token.value}"
                  </td>
                  <td className="border-2 border-primary p-3 text-muted">{token.index}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tokens.length === 0 && !error && !loading && (
        <div className="text-center py-12 text-muted">
          Enter an expression to see tokens
        </div>
      )}
    </div>
  )
}

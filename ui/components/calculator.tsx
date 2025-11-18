'use client'

import { useState } from 'react'
import { Copy, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface CalculatorProps {
  expression: string
  onExpressionChange: (expr: string) => void
}

interface History {
  expression: string
  result: number
  timestamp: Date
}

export default function Calculator({ expression, onExpressionChange }: CalculatorProps) {
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<History[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3']
  const operators = ['+', '-', '*', '/']

  const evaluate = async (expr: string) => {
    if (!expr.trim()) {
      setResult(null)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:3001/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: expr }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error)
        setResult(null)
        return
      }

      const data = await response.json()
      setResult(data.result)
      setHistory(prev => [
        { expression: expr, result: data.result, timestamp: new Date() },
        ...prev.slice(0, 19)
      ])
    } catch (err) {
      setError({ type: 'NetworkError', message: 'Failed to connect to server' })
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleNumberClick = (num: string) => {
    onExpressionChange(expression + num)
  }

  const handleOperatorClick = (op: string) => {
    onExpressionChange(expression + ' ' + op + ' ')
  }

  const handleParenthesis = (paren: string) => {
    onExpressionChange(expression + paren)
  }

  const handleClear = () => {
    onExpressionChange('')
    setResult(null)
    setError(null)
  }

  const handleBackspace = () => {
    onExpressionChange(expression.slice(0, -1))
  }

  const copyResult = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toString())
    }
  }

  const replayHistory = (item: History) => {
    onExpressionChange(item.expression)
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Calculator */}
      <div className="lg:col-span-3 minecraft-block bg-emerald-700 border-black p-6 shadow-2xl">
        <div className="minecraft-block bg-black border-black mb-6 p-4 min-h-16 flex items-center justify-end overflow-x-auto">
          <input
            type="text"
            value={expression}
            onChange={(e) => onExpressionChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') evaluate(expression)
              if (e.key === 'Escape') handleClear()
            }}
            placeholder="Enter expression"
            className="w-full bg-transparent text-right text-2xl font-mono text-yellow-300 placeholder-gray-500 focus:outline-none"
            autoFocus
          />
        </div>

        {result !== null && !error && (
          <div className="minecraft-block bg-amber-600 border-black p-6 mb-6 text-center shadow-lg">
            <div className="text-lg text-black font-bold mb-2">RESULT</div>
            <div className="text-5xl font-bold text-yellow-300 mb-4" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>{result}</div>
            <button
              onClick={copyResult}
              className="minecraft-button bg-yellow-400 text-black border-black inline-flex items-center gap-2"
            >
              <Copy size={20} /> COPY
            </button>
          </div>
        )}

        {error && (
          <div className="minecraft-block bg-red-600 border-black p-6 mb-6 text-white font-bold shadow-lg">
            <div className="text-sm mb-2">{error.type}</div>
            <div className="text-lg mb-4">{error.message}</div>
            {error.index !== undefined && (
              <div className="font-mono text-sm">
                <div>{expression}</div>
                <div>{' '.repeat(error.index)}^</div>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="minecraft-block bg-muted p-6 mb-6 text-center">
            <div className="animate-pulse text-lg">PROCESSING...</div>
          </div>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {numbers.map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="minecraft-button bg-amber-700 border-black text-white text-lg h-16 font-bold shadow-lg hover:bg-amber-600"
            >
              {num}
            </button>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            onClick={() => handleNumberClick('0')}
            className="minecraft-button bg-amber-700 border-black text-white text-lg h-16 font-bold shadow-lg hover:bg-amber-600"
          >
            0
          </button>
          <button
            onClick={() => handleOperatorClick('/')}
            className="minecraft-button bg-yellow-400 border-black text-black text-lg h-16 font-bold shadow-lg hover:bg-yellow-300"
          >
            /
          </button>
          <button
            onClick={() => evaluate(expression)}
            className="minecraft-button bg-emerald-500 border-black text-white text-lg h-16 font-bold shadow-lg hover:bg-emerald-400"
          >
            =
          </button>
        </div>

        {/* Operator Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {['+', '-', '*', '/'].map(op => (
            <button
              key={op}
              onClick={() => handleOperatorClick(op)}
              className="minecraft-button bg-yellow-400 border-black text-black text-lg h-12 font-bold shadow-lg hover:bg-yellow-300"
            >
              {op}
            </button>
          ))}
        </div>

        {/* Parentheses & Control */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleParenthesis('(')}
            className="minecraft-button bg-amber-700 border-black text-white text-lg h-12 font-bold shadow-lg hover:bg-amber-600"
          >
            (
          </button>
          <button
            onClick={() => handleParenthesis(')')}
            className="minecraft-button bg-amber-700 border-black text-white text-lg h-12 font-bold shadow-lg hover:bg-amber-600"
          >
            )
          </button>
          <button
            onClick={handleBackspace}
            className="minecraft-button bg-red-600 border-black text-white text-lg h-12 font-bold shadow-lg hover:bg-red-500"
          >
            ← BACK
          </button>
        </div>

        <button
          onClick={handleClear}
          className="minecraft-button w-full bg-red-600 border-black text-white text-lg h-14 font-bold mt-4 shadow-lg hover:bg-red-500"
        >
          CLEAR
        </button>
      </div>

      {/* History Sidebar */}
      <div className="minecraft-block bg-emerald-700 border-black p-4 shadow-2xl">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full minecraft-button bg-amber-600 border-black text-white mb-4 flex items-center justify-between font-bold shadow-lg hover:bg-amber-500"
        >
          <span>HISTORY</span>
          {showHistory ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showHistory && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-white text-sm text-center py-4 font-bold">No history</div>
            ) : (
              <>
                {history.map((item, i) => (
                  <div
                    key={i}
                    className="minecraft-block bg-black border-black p-3 cursor-pointer hover:bg-gray-800 transition-colors shadow-md"
                    onClick={() => replayHistory(item)}
                  >
                    <div className="font-mono text-xs text-gray-400 mb-1">
                      {item.timestamp.toLocaleTimeString()}
                    </div>
                    <div className="text-sm text-yellow-300">{item.expression}</div>
                    <div className="text-lg font-bold text-green-300">=  {item.result}</div>
                  </div>
                ))}
                <button
                  onClick={clearHistory}
                  className="minecraft-button w-full bg-red-600 border-black text-white text-xs h-10 mt-4 font-bold shadow-md hover:bg-red-500"
                >
                  CLEAR ALL
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

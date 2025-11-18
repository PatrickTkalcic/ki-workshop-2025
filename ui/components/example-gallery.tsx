'use client'

interface ExampleGalleryProps {
  onSelectExample: (expr: string) => void
}

export default function ExampleGallery({ onSelectExample }: ExampleGalleryProps) {
  const examples = [
    { expr: '2 + 3', desc: 'Simple Addition' },
    { expr: '2 + 3 * 4', desc: 'Operator Precedence' },
    { expr: '(2 + 3) * 4', desc: 'Parentheses' },
    { expr: '-(3 + 4*2) / 5', desc: 'Unary Minus' },
    { expr: '7 / 3', desc: 'Integer Division' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
      {examples.map((example, i) => (
        <button
          key={i}
          onClick={() => onSelectExample(example.expr)}
          className="minecraft-block bg-accent text-accent-foreground p-4 hover:brightness-110 transition-all text-center"
        >
          <div className="font-bold text-sm mb-1">{example.desc}</div>
          <div className="font-mono text-xs">{example.expr}</div>
        </button>
      ))}
    </div>
  )
}

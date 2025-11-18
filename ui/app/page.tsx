'use client'

import { useState, useCallback, useEffect } from 'react'
import Calculator from '@/components/calculator'
import Tokenizer from '@/components/tokenizer'
import Parser from '@/components/parser'
import ExampleGallery from '@/components/example-gallery'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Home() {
  const [expression, setExpression] = useState('')
  const [activeTab, setActiveTab] = useState('calculator')

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Minecraft landscape background with sky, clouds, grass, and terrain */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100" />
        
        {/* Clouds - pixelated style */}
        <div className="absolute top-12 left-10 w-24 h-8 bg-white opacity-80 rounded-full blur-sm" 
             style={{
               clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
               imageRendering: 'pixelated'
             }} />
        <div className="absolute top-20 right-20 w-32 h-10 bg-white opacity-70 rounded-full blur-sm"
             style={{
               clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
               imageRendering: 'pixelated'
             }} />
        
        {/* Terrain layers at bottom */}
        <div className="absolute bottom-0 w-full h-48">
          {/* Grass layer */}
          <div className="w-full h-12 bg-gradient-to-b from-emerald-500 to-emerald-600" 
               style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(0,0,0,0.1) 16px, rgba(0,0,0,0.1) 32px)' }} />
          
          {/* Dirt layer */}
          <div className="w-full h-32 bg-gradient-to-b from-amber-700 to-amber-800"
               style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(0,0,0,0.15) 16px, rgba(0,0,0,0.15) 32px)' }} />
        </div>

        {/* Decorative grass tufts */}
        <div className="absolute bottom-12 left-1/4 w-3 h-4 bg-emerald-400" style={{ clipPath: 'polygon(20% 100%, 40% 30%, 50% 0%, 60% 30%, 80% 100%)' }} />
        <div className="absolute bottom-12 right-1/3 w-3 h-4 bg-emerald-400" style={{ clipPath: 'polygon(20% 100%, 40% 30%, 50% 0%, 60% 30%, 80% 100%)' }} />
        <div className="absolute bottom-12 right-1/4 w-3 h-4 bg-emerald-400" style={{ clipPath: 'polygon(20% 100%, 40% 30%, 50% 0%, 60% 30%, 80% 100%)' }} />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-2 minecraft-block inline-block px-8 py-6 bg-emerald-600 border-black text-white shadow-lg"
              style={{ 
                textShadow: '3px 3px 0px rgba(0,0,0,0.5)',
                letterSpacing: '2px'
              }}>
            BLOCK CALC
          </h1>
          <p className="text-lg mt-6 font-bold text-black drop-shadow-lg">Minecraft-styled DSL Expression Evaluator</p>
        </div>

        {/* Example Gallery */}
        <div className="mb-8">
          <ExampleGallery onSelectExample={setExpression} />
        </div>

        {/* Main Tabs */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 minecraft-block bg-emerald-700 border-black">
              <TabsTrigger
                value="calculator"
                className="minecraft-block bg-amber-700 border-black data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:border-black font-bold text-white data-[state=active]:shadow-lg"
              >
                CALC
              </TabsTrigger>
              <TabsTrigger
                value="tokenizer"
                className="minecraft-block bg-amber-700 border-black data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:border-black font-bold text-white data-[state=active]:shadow-lg"
              >
                TOKENS
              </TabsTrigger>
              <TabsTrigger
                value="parser"
                className="minecraft-block bg-amber-700 border-black data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:border-black font-bold text-white data-[state=active]:shadow-lg"
              >
                TREE
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="mt-6">
              <Calculator expression={expression} onExpressionChange={setExpression} />
            </TabsContent>

            <TabsContent value="tokenizer" className="mt-6">
              <Tokenizer expression={expression} />
            </TabsContent>

            <TabsContent value="parser" className="mt-6">
              <Parser expression={expression} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

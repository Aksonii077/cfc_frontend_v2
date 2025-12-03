'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'

interface TypewriterTextProps {
  text: string
  speed?: number // Characters per second
  onComplete?: () => void
  className?: string
  startDelay?: number
}

export function TypewriterText({ 
  text, 
  speed = 30, // Slower default speed (30 chars/second)
  onComplete,
  className = '',
  startDelay = 0
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isStarted, setIsStarted] = useState(false)

  useEffect(() => {
    if (startDelay > 0) {
      const startTimer = setTimeout(() => {
        setIsStarted(true)
      }, startDelay)
      return () => clearTimeout(startTimer)
    } else {
      setIsStarted(true)
    }
  }, [startDelay])

  useEffect(() => {
    if (!isStarted) return

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 1000 / speed) // Convert speed to interval

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete, isStarted])

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('')
    setCurrentIndex(0)
    setIsStarted(startDelay === 0)
  }, [text, startDelay])

  return (
    <div className={className}>
      <span className="whitespace-pre-wrap">{displayedText}</span>
      {currentIndex < text.length && (
        <motion.span
          className="inline-block w-0.5 h-5 bg-current ml-0.5"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  )
}
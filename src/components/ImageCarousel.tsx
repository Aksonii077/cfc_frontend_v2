'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ImageWithFallback } from './figma/ImageWithFallback'

const carouselItems = [
  {
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    tagline: 'From Idea to IPO',
    subtitle: 'AI-powered guidance to transform your entrepreneurial dreams into thriving businesses'
  },
  {
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
    tagline: 'Validate & Scale Smart',
    subtitle: 'Get data-driven insights to validate your market and build scalable business models'
  },
  {
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
    tagline: 'Expert AI Mentorship',
    subtitle: 'Access specialized sub-agents for fundraising, marketing, operations, and strategic planning'
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    tagline: 'Join the Startup Revolution',
    subtitle: 'Connect with fellow entrepreneurs and turn your innovative ideas into market leaders'
  }
]

export function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
    }, 4500) // Auto-advance every 4.5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src={carouselItems[currentIndex].image}
            alt={carouselItems[currentIndex].tagline}
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* StratoScale Branding Overlay */}
      

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="mb-4 text-4xl font-medium">
              {carouselItems[currentIndex].tagline}
            </h2>
            <p className="text-lg text-white/90 max-w-lg leading-relaxed">
              {carouselItems[currentIndex].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress indicators */}
      <div className="absolute bottom-8 left-12 flex space-x-2">
        {carouselItems.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/40 w-2'
            }`}
            animate={{ 
              width: index === currentIndex ? 32 : 8,
              opacity: index === currentIndex ? 1 : 0.4 
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            delay: 0
          }}
          className="absolute top-1/4 right-1/4 w-2 h-2 bg-white/30 rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            delay: 1
          }}
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-300/40 rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, -25, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 3.5,
            repeat: Infinity,
            delay: 2
          }}
          className="absolute top-2/3 right-1/5 w-1.5 h-1.5 bg-blue-300/50 rounded-full"
        />
      </div>
    </div>
  )
}
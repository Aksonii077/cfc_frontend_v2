'use client'

import { motion } from 'motion/react'
import { Sparkles, Brain, Eye, Lightbulb, Zap, Heart, Star, Coffee, CheckCircle, Target } from 'lucide-react'

interface AIAvatarProps {
  emotion?: 'neutral' | 'excited' | 'thinking' | 'happy' | 'celebrating' | 'encouraging' | 'analytical' | 'welcoming'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isAnimating?: boolean
  className?: string
}

export function AIAvatar({ 
  emotion = 'neutral', 
  size = 'md', 
  isAnimating = false,
  className = '' 
}: AIAvatarProps) {
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  }

  const getEmotionConfig = () => {
    switch (emotion) {
      case 'excited':
        return {
          icon: Zap,
          gradient: 'from-[#3CE5A7] via-[#06CB1D] to-[#059e17]',
          glow: 'shadow-[#3CE5A7]/50',
          animation: {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
            transition: { duration: 0.6, repeat: isAnimating ? Infinity : 0 }
          },
          particles: true
        }
      
      case 'thinking':
        return {
          icon: Brain,
          gradient: 'from-[#114DFF] via-[#0d3eb8] to-[#0a2f8a]',
          glow: 'shadow-[#114DFF]/50',
          animation: {
            scale: [1, 1.05, 1],
            transition: { duration: 2, repeat: isAnimating ? Infinity : 0, ease: 'easeInOut' }
          },
          pulse: true
        }
      
      case 'happy':
        return {
          icon: Heart,
          gradient: 'from-[#3CE5A7] via-[#2bc78f] to-[#06CB1D]',
          glow: 'shadow-[#3CE5A7]/50',
          animation: {
            scale: [1, 1.08, 1],
            y: [0, -2, 0],
            transition: { duration: 0.8, repeat: isAnimating ? Infinity : 0 }
          }
        }
      
      case 'celebrating':
        return {
          icon: Star,
          gradient: 'from-[#06CB1D] via-[#3CE5A7] to-[#114DFF]',
          glow: 'shadow-[#06CB1D]/60',
          animation: {
            scale: [1, 1.2, 1.1, 1],
            rotate: [0, 360],
            transition: { duration: 1, repeat: isAnimating ? Infinity : 0 }
          },
          confetti: true
        }
      
      case 'encouraging':
        return {
          icon: CheckCircle,
          gradient: 'from-[#06CB1D] via-[#059e17] to-[#3CE5A7]',
          glow: 'shadow-[#06CB1D]/50',
          animation: {
            scale: [1, 1.06, 1],
            transition: { duration: 1.2, repeat: isAnimating ? Infinity : 0 }
          }
        }
      
      case 'analytical':
        return {
          icon: Target,
          gradient: 'from-[#114DFF] via-[#0d3eb8] to-[#3CE5A7]',
          glow: 'shadow-[#114DFF]/50',
          animation: {
            rotate: [0, 180, 360],
            transition: { duration: 3, repeat: isAnimating ? Infinity : 0, ease: 'linear' }
          }
        }
      
      case 'welcoming':
        return {
          icon: Coffee,
          gradient: 'from-[#3CE5A7] via-[#2bc78f] to-[#06CB1D]',
          glow: 'shadow-[#3CE5A7]/50',
          animation: {
            scale: [1, 1.1, 1],
            y: [0, -3, 0],
            transition: { duration: 1, repeat: isAnimating ? Infinity : 0 }
          },
          wave: true
        }
      
      default: // neutral
        return {
          icon: Sparkles,
          gradient: 'from-[#114DFF] to-[#3CE5A7]',
          glow: 'shadow-[#114DFF]/40',
          animation: isAnimating ? {
            scale: [1, 1.02, 1],
            transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          } : {}
        }
    }
  }

  const config = getEmotionConfig()
  const IconComponent = config.icon

  return (
    <div className={`relative ${className}`}>
      {/* Main Avatar */}
      <motion.div
        className={`
          ${sizeClasses[size]} 
          bg-gradient-to-br ${config.gradient} 
          rounded-2xl flex items-center justify-center 
          shadow-lg ${config.glow}
          relative overflow-hidden
        `}
        animate={config.animation}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Background Effects */}
        {config.pulse && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: isAnimating ? Infinity : 0,
              ease: 'easeInOut'
            }}
          />
        )}

        {/* Icon */}
        <motion.div
          animate={emotion === 'thinking' ? {
            rotate: [0, 10, -10, 0],
            transition: { duration: 1.5, repeat: isAnimating ? Infinity : 0 }
          } : {}}
        >
          <IconComponent className={`${size === 'xl' ? 'w-16 h-16' : size === 'lg' ? 'w-10 h-10' : size === 'md' ? 'w-6 h-6' : 'w-4 h-4'} text-white`} />
        </motion.div>

        {/* Wave Effect for Welcoming */}
        {config.wave && (
          <motion.div
            className="absolute -right-1 -top-1 w-3 h-3 text-white"
            animate={{
              rotate: [0, 20, -10, 20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 0.8,
              repeat: isAnimating ? Infinity : 0,
              ease: 'easeInOut'
            }}
          >
            👋
          </motion.div>
        )}
      </motion.div>

      {/* Particles for Excited State */}
      {config.particles && isAnimating && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#3CE5A7] rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 60],
                y: [0, (Math.random() - 0.5) * 60],
                opacity: [1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeOut'
              }}
            />
          ))}
        </>
      )}

      {/* Confetti for Celebrating State */}
      {config.confetti && isAnimating && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${
                ['bg-[#06CB1D]', 'bg-[#3CE5A7]', 'bg-[#114DFF]', 'bg-[#0d3eb8]'][i % 4]
              }`}
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 80],
                y: [0, -40 - Math.random() * 20],
                opacity: [1, 0],
                rotate: [0, 360],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeOut'
              }}
            />
          ))}
        </>
      )}

      {/* Glow Effect */}
      <motion.div
        className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-br ${config.gradient} rounded-2xl blur-md opacity-30 -z-10`}
        animate={isAnimating ? {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        } : {}}
        transition={{
          duration: 2,
          repeat: isAnimating ? Infinity : 0,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}
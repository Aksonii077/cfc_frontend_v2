import { motion } from 'motion/react'
import { Sparkles, Zap } from 'lucide-react'

interface SetupTransitionProps {
  type: 'signup' | 'login'
}

export function SetupTransition({ type }: SetupTransitionProps) {
  const message = type === 'signup' 
    ? 'Setting up the platform as per user'
    : 'Ensuring we setup things from where user left earlier'

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9FF] relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#114DFF]/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#3CE5A7]/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="text-center space-y-6 relative z-10">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-2xl flex items-center justify-center mx-auto relative shadow-lg"
        >
          {/* Rotating outer ring */}
          <motion.div
            className="absolute -inset-2 border-4 border-[#114DFF]/20 rounded-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Pulsing glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-2xl"
            animate={{ 
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Inner icon */}
          <motion.div
            className="relative z-10"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {type === 'signup' ? (
              <Zap className="w-10 h-10 text-white" />
            ) : (
              <Sparkles className="w-10 h-10 text-white" />
            )}
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-3 px-4"
        >
          <h2 className="text-2xl bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] bg-clip-text text-transparent">
            {type === 'signup' ? 'Welcome to RACE AI' : 'Welcome Back'}
          </h2>
          <p className="text-gray-700 max-w-md mx-auto">
            {message}
          </p>
        </motion.div>

        {/* Animated Progress Dots */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center space-x-2 pt-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-[#114DFF] rounded-full"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="w-48 h-1 bg-[#C8D6FF] rounded-full mx-auto overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  )
}

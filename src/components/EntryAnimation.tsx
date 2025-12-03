import { motion } from 'motion/react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { 
  Rocket, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  Users, 
  BarChart3,
  Sparkles,
  ArrowRight
} from 'lucide-react'

interface EntryAnimationProps {
  onComplete: () => void
  selectedSection?: 'idea-launch-pad' | 'growth-hub'
}

export function EntryAnimation({ onComplete, selectedSection }: EntryAnimationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => {
            // Auto-advance after animation completes
            setTimeout(onComplete, 4000)
          }}
        >
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
                  className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl font-bold mb-2"
                >
                  Welcome to RACE AI!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-lg opacity-90"
                >
                  Your AI-powered entrepreneurial companion is ready
                </motion.p>
              </div>

              {/* Main Content */}
              <div className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-center mb-8"
                >
                  {selectedSection ? (
                    <>
                      <h2 className="text-2xl font-semibold mb-3">
                        Welcome to {selectedSection === 'idea-launch-pad' ? 'Launch Pad' : 'Growth Hub'}!
                      </h2>
                      <p className="text-gray-600">
                        You've chosen the perfect section to {selectedSection === 'idea-launch-pad' ? 'launch your ideas' : 'grow your business'}. Here's what you can explore:
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-semibold mb-3">Discover Your Two Main Sections</h2>
                      <p className="text-gray-600">
                        Navigate between these powerful environments to grow your business
                      </p>
                    </>
                  )}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Launch Pad */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 }}
                  >
                    <Card className={`h-full ${
                      selectedSection === 'idea-launch-pad' 
                        ? 'bg-gradient-to-br from-purple-100 to-purple-200/50 border-purple-400 ring-2 ring-purple-300' 
                        : 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                            <Rocket className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 mb-1">
                              Launch
                            </Badge>
                            <h3 className="text-xl font-semibold">Launch Pad</h3>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-6">
                          Perfect for ideation, validation, and early-stage development. 
                          Get AI guidance to turn your concepts into viable business plans.
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Lightbulb className="w-4 h-4 mr-2 text-purple-500" />
                            AI Assistant & Strategy Building
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Target className="w-4 h-4 mr-2 text-purple-500" />
                            Market Research & Validation
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2 text-purple-500" />
                            Early Connections & Resources
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Growth Hub */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <Card className={`h-full ${
                      selectedSection === 'growth-hub' 
                        ? 'bg-gradient-to-br from-blue-100 to-blue-200/50 border-blue-400 ring-2 ring-blue-300' 
                        : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 mb-1">
                              Scale
                            </Badge>
                            <h3 className="text-xl font-semibold">Growth Hub</h3>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-6">
                          Advanced tools for established startups ready to scale. 
                          Access premium connections, funding opportunities, and growth strategies.
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                            Analytics & Performance Tracking
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2 text-blue-500" />
                            Investor & Partner Network
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Target className="w-4 h-4 mr-2 text-blue-500" />
                            Advanced Growth Tools
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="text-center mt-8"
                >
                  <div className="flex items-center justify-center text-purple-600 mb-2">
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                    <span className="text-lg font-medium ml-2">Getting ready...</span>
                  </div>
                  <p className="text-gray-500">
                    Your personalized dashboard will load momentarily
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
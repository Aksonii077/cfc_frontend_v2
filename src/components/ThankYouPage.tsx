import { motion } from 'motion/react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { CheckCircle2, Mail, Calendar, ArrowRight } from 'lucide-react'
import cofounderCircleLogo from 'figma:asset/410004b62b93127b8e248ebc3bc69d517631ee0f.png'

interface ThankYouPageProps {
  type: 'mentor' | 'waitlist'
  roleName: string
  email: string
  onContinue?: () => void
}

export function ThankYouPage({ type, roleName, email, onContinue }: ThankYouPageProps) {
  const isMentor = type === 'mentor'

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] via-[#EDF2FF] to-[#F5F5F5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm overflow-hidden max-w-3xl w-full">
          {/* Success Header - Compact */}
          <div className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] p-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-2"
            >
              <CheckCircle2 className="w-7 h-7 text-[#06CB1D]" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white mb-1"
              style={{ fontSize: '20px', fontWeight: 500 }}
            >
              {isMentor ? "Interest Submitted!" : "You're on the Waitlist!"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90"
              style={{ fontSize: '12px' }}
            >
              Thank you for your interest in joining RACE AI
            </motion.p>
          </div>

          <CardContent className="p-4 space-y-3">
            {/* Logo */}
            <div className="flex justify-center">
              <img 
                src={cofounderCircleLogo} 
                alt="CoFounder Circle" 
                className="h-7 w-auto opacity-50"
              />
            </div>

            {/* Confirmation Message */}
            <div className="text-center space-y-1.5">
              <h2 className="text-gray-900" style={{ fontSize: '15px' }}>
                {isMentor 
                  ? "We've received your mentor program application"
                  : `You're all set for ${roleName} early access`
                }
              </h2>
              <p className="text-gray-600" style={{ fontSize: '12px' }}>
                Confirmation email sent to:
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg">
                <Mail className="w-3 h-3 text-[#114DFF]" />
                <span className="text-gray-900" style={{ fontSize: '12px', fontWeight: 500 }}>{email}</span>
              </div>
            </div>

            {/* Two Column Layout for What's Next */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* What's Next Section */}
              <Card className="bg-gradient-to-br from-[#F7F9FF] to-[#EDF2FF] border-[#C8D6FF]">
                <CardContent className="p-3 space-y-2">
                  <h3 className="text-gray-900 flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500 }}>
                    <Calendar className="w-3.5 h-3.5 text-[#114DFF]" />
                    What Happens Next?
                  </h3>
                  
                  {isMentor ? (
                    <ol className="space-y-1.5" style={{ fontSize: '11px' }}>
                      <li className="flex gap-2 text-gray-600">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#114DFF] text-white flex-shrink-0" style={{ fontSize: '9px' }}>
                          1
                        </span>
                        <div>
                          <span className="text-gray-900" style={{ fontWeight: 500 }}>Review: </span>
                          <span>2-3 business days</span>
                        </div>
                      </li>
                      <li className="flex gap-2 text-gray-600">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#114DFF] text-white flex-shrink-0" style={{ fontSize: '9px' }}>
                          2
                        </span>
                        <div>
                          <span className="text-gray-900" style={{ fontWeight: 500 }}>Call: </span>
                          <span>If selected</span>
                        </div>
                      </li>
                      <li className="flex gap-2 text-gray-600">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#114DFF] text-white flex-shrink-0" style={{ fontSize: '9px' }}>
                          3
                        </span>
                        <div>
                          <span className="text-gray-900" style={{ fontWeight: 500 }}>Access: </span>
                          <span>Dashboard upon approval</span>
                        </div>
                      </li>
                      <li className="flex gap-2 text-gray-600">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#114DFF] text-white flex-shrink-0" style={{ fontSize: '9px' }}>
                          4
                        </span>
                        <div>
                          <span className="text-gray-900" style={{ fontWeight: 500 }}>Mentor: </span>
                          <span>Start reviewing applications</span>
                        </div>
                      </li>
                    </ol>
                  ) : (
                    <ol className="space-y-1.5" style={{ fontSize: '11px' }}>
                      <li className="flex gap-2 text-gray-600">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#114DFF] text-white flex-shrink-0" style={{ fontSize: '9px' }}>
                          1
                        </span>
                        <div>
                          <span className="text-gray-900" style={{ fontWeight: 500 }}>Email: </span>
                          <span>Welcome email sent</span>
                        </div>
                      </li>
                      <li className="flex gap-2 text-gray-600">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#114DFF] text-white flex-shrink-0" style={{ fontSize: '9px' }}>
                          2
                        </span>
                        <div>
                          <span className="text-gray-900" style={{ fontWeight: 500 }}>Build: </span>
                          <span>Perfecting for {roleName}s</span>
                        </div>
                      </li>
                      <li className="flex gap-2 text-gray-600">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#114DFF] text-white flex-shrink-0" style={{ fontSize: '9px' }}>
                          3
                        </span>
                        <div>
                          <span className="text-gray-900" style={{ fontWeight: 500 }}>Invite: </span>
                          <span>Early access (2-4 weeks)</span>
                        </div>
                      </li>
                      <li className="flex gap-2 text-gray-600">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#114DFF] text-white flex-shrink-0" style={{ fontSize: '9px' }}>
                          4
                        </span>
                        <div>
                          <span className="text-gray-900" style={{ fontWeight: 500 }}>Onboard: </span>
                          <span>Priority setup & benefits</span>
                        </div>
                      </li>
                    </ol>
                  )}
                </CardContent>
              </Card>

              {/* Timeline + CTA Column */}
              <div className="space-y-3">
                {/* Expected Timeline */}
                <Card className="bg-[#EDF2FF] border-[#C8D6FF]">
                  <CardContent className="p-2.5 text-center">
                    <p className="text-gray-600" style={{ fontSize: '11px' }}>
                      <span className="text-gray-900" style={{ fontWeight: 500 }}>Response: </span>
                      {isMentor ? '2-3 business days' : '2-4 weeks'}
                    </p>
                  </CardContent>
                </Card>

                {/* Call to Action */}
                {onContinue && (
                  <div>
                    <Button
                      onClick={onContinue}
                      className="w-full bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white h-8"
                      style={{ fontSize: '12px' }}
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        Explore Platform
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </Button>
                    <p className="text-center text-gray-500 mt-1.5" style={{ fontSize: '9px' }}>
                      Explore in limited mode while waiting
                    </p>
                  </div>
                )}

                {/* Footer Note */}
                <div className="text-center pt-2 border-t border-[#C8D6FF]">
                  <p className="text-gray-600" style={{ fontSize: '10px' }}>
                    Questions?{' '}
                    <a href="mailto:support@raceai.com" className="text-[#114DFF] hover:underline">
                      support@raceai.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

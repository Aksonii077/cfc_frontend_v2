import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar,
  FileText,
  Download,
  Users,
  Target,
  TrendingUp,
  DollarSign,
  Lightbulb,
  Scale,
  Briefcase,
  Network,
  Award,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

interface ApplicationData {
  // Basics (Step 1)
  contactName?: string
  email?: string
  phone?: string
  startupName?: string
  website?: string
  hqLocation?: string
  yearFounded?: string
  currentStage?: string
  oneLiner?: string
  summary?: string
  
  // Pitch Deck
  deckFile?: {
    name: string
    url: string
    size: number
  }
  
  // Team (Step 2)
  founders?: Array<{
    name: string
    role: string
    timeCommitment: string
    linkedin: string
    ownership: string
    isTechnical: boolean
  }>
  teamRationale?: string
  
  // Product (Step 3)
  problem?: string
  targetUser?: string
  solution?: string
  demoUrl?: string
  differentiation?: string
  productImages?: Array<{
    name: string
    url: string
  }>
  
  // Market & Competition (Step 4)
  tam?: string
  sam?: string
  som?: string
  whyNow?: string
  competitors?: Array<{
    name: string
    url: string
    differentiation: string
  }>
  
  // Traction & Financials (Step 5)
  monthlyRevenue?: Array<{
    month: string
    revenue: string
  }>
  mrr?: string
  arr?: string
  growthRate?: string
  mau?: string
  retention?: string
  cac?: string
  ltv?: string
  grossMargin?: string
  burn?: string
  runway?: string
  proofOfDemand?: string
  
  // Business Model & GTM (Step 6)
  pricing?: string
  salesCycle?: string
  partnerships?: string
  
  // Funding & Cap Table (Step 7)
  fundingRounds?: Array<{
    type: string
    date: string
    amount: string
    investors: string
  }>
  capTableSummary?: string
  raisingNow?: boolean
  targetAmount?: string
  useOfFunds?: string
  
  // Legal, IP & Compliance (Step 8)
  incorporated?: boolean
  jurisdiction?: string
  registrations?: string
  ipStatus?: string
  compliance?: string
  
  // Help Looking For (Step 10)
  primaryFocusArea?: string[]
  specificSupport?: string
  helpDescription?: string
  
  // Metadata
  submittedAt?: string
  applicationFlow?: 'deck-only' | 'full-details'
}

interface StartupApplicationOverviewProps {
  applicationId: string
  applicationData?: ApplicationData
}

export function StartupApplicationOverview({ applicationId, applicationData }: StartupApplicationOverviewProps) {
  const [data, setData] = useState<ApplicationData | null>(applicationData || null)
  const [loading, setLoading] = useState(!applicationData)

  useEffect(() => {
    // If no data provided, fetch from Supabase
    if (!applicationData) {
      // TODO: Implement actual fetch from Supabase
      // This should query the mentor_applications table for the full application form data
      // The data structure should match the ApplicationFormData interface
      // Example query:
      // const { data, error } = await supabase
      //   .from('mentor_application_forms')
      //   .select('*')
      //   .eq('application_id', applicationId)
      //   .single()
      
      setLoading(false)
    }
  }, [applicationId, applicationData])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-[#114DFF] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No Application Data</h3>
          <p className="text-gray-600">Unable to load application details</p>
        </CardContent>
      </Card>
    )
  }

  // Determine if this is a deck-only submission
  const isDeckOnly = data.applicationFlow === 'deck-only' || (data.deckFile && !data.founders)

  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <div className="space-y-6 pr-4">
        {/* Header with Application Type Badge */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Startup Overview</h2>
            <p className="text-gray-600">
              Complete application details submitted by the founder
            </p>
          </div>
          <Badge 
            variant="outline" 
            className={isDeckOnly ? "bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]" : "bg-[#F0FDF4] text-[#06CB1D] border-[#86EFAC]"}
          >
            {isDeckOnly ? 'Pitch Deck Submission' : 'Full Application'}
          </Badge>
        </div>

        {/* Basics Section - Always Present */}
        <Card className="border-[#C8D6FF]">
          <CardHeader className="bg-[#F7F9FF] border-b border-[#C8D6FF]">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Building2 className="w-5 h-5 text-[#114DFF]" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Startup Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.startupName && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>Startup Name</span>
                  </div>
                  <p className="text-gray-900">{data.startupName}</p>
                </div>
              )}
              
              {data.currentStage && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Current Stage</span>
                  </div>
                  <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                    {data.currentStage}
                  </Badge>
                </div>
              )}
              
              {data.website && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </div>
                  <a 
                    href={data.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#114DFF] hover:underline"
                  >
                    {data.website}
                  </a>
                </div>
              )}
              
              {data.hqLocation && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </div>
                  <p className="text-gray-900">{data.hqLocation}</p>
                </div>
              )}
              
              {data.yearFounded && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Year Founded</span>
                  </div>
                  <p className="text-gray-900">{data.yearFounded}</p>
                </div>
              )}
            </div>

            {data.oneLiner && (
              <>
                <Separator className="bg-[#C8D6FF]" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Lightbulb className="w-4 h-4" />
                    <span>One-Liner</span>
                  </div>
                  <p className="text-gray-900">{data.oneLiner}</p>
                </div>
              </>
            )}

            {data.summary && (
              <>
                <Separator className="bg-[#C8D6FF]" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>Company Summary</span>
                  </div>
                  <p className="text-gray-900 whitespace-pre-wrap">{data.summary}</p>
                </div>
              </>
            )}

            <Separator className="bg-[#C8D6FF]" />

            {/* Contact Details */}
            <div>
              <h4 className="text-gray-900 mb-4">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.contactName && (
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{data.contactName}</span>
                  </div>
                )}
                
                {data.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${data.email}`} className="text-[#114DFF] hover:underline">
                      {data.email}
                    </a>
                  </div>
                )}
                
                {data.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{data.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pitch Deck Section - If Available */}
        {data.deckFile && (
          <Card className="border-[#C8D6FF]">
            <CardHeader className="bg-[#F7F9FF] border-b border-[#C8D6FF]">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <FileText className="w-5 h-5 text-[#114DFF]" />
                Pitch Deck
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900">{data.deckFile.name}</p>
                    <p className="text-gray-600">
                      {(data.deckFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open(data.deckFile?.url, '_blank')}
                  className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conditional: Full Application Details */}
        {!isDeckOnly && (
          <>
            {/* Team Section */}
            {data.founders && data.founders.length > 0 && (
              <Card className="border-[#C8D6FF]">
                <CardHeader className="bg-[#F7F9FF] border-b border-[#C8D6FF]">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Users className="w-5 h-5 text-[#114DFF]" />
                    Team & Founders
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {data.founders.map((founder, index) => (
                    <div key={index} className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-gray-600">Name</p>
                          <p className="text-gray-900">{founder.name}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-600">Role</p>
                          <p className="text-gray-900">{founder.role}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-600">Commitment</p>
                          <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                            {founder.timeCommitment}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-600">Ownership</p>
                          <p className="text-gray-900">{founder.ownership}</p>
                        </div>
                        {founder.linkedin && (
                          <div className="space-y-2 md:col-span-2">
                            <p className="text-gray-600">LinkedIn</p>
                            <a 
                              href={founder.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#114DFF] hover:underline"
                            >
                              {founder.linkedin}
                            </a>
                          </div>
                        )}
                        {founder.isTechnical && (
                          <div className="md:col-span-2">
                            <Badge className="bg-[#F0FDF4] text-[#06CB1D] border-[#86EFAC]">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Technical Founder
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {data.teamRationale && (
                    <>
                      <Separator className="bg-[#C8D6FF]" />
                      <div className="space-y-2">
                        <p className="text-gray-600">Team Rationale</p>
                        <p className="text-gray-900 whitespace-pre-wrap">{data.teamRationale}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Product Section */}
            {(data.problem || data.solution || data.targetUser) && (
              <Card className="border-[#C8D6FF]">
                <CardHeader className="bg-[#F7F9FF] border-b border-[#C8D6FF]">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Lightbulb className="w-5 h-5 text-[#114DFF]" />
                    Product & Solution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {data.problem && (
                    <div className="space-y-2">
                      <p className="text-gray-600">Problem Statement</p>
                      <p className="text-gray-900 whitespace-pre-wrap">{data.problem}</p>
                    </div>
                  )}
                  
                  {data.targetUser && (
                    <div className="space-y-2">
                      <p className="text-gray-600">Target User</p>
                      <p className="text-gray-900 whitespace-pre-wrap">{data.targetUser}</p>
                    </div>
                  )}
                  
                  {data.solution && (
                    <div className="space-y-2">
                      <p className="text-gray-600">Solution</p>
                      <p className="text-gray-900 whitespace-pre-wrap">{data.solution}</p>
                    </div>
                  )}
                  
                  {data.differentiation && (
                    <div className="space-y-2">
                      <p className="text-gray-600">Key Differentiation</p>
                      <p className="text-gray-900 whitespace-pre-wrap">{data.differentiation}</p>
                    </div>
                  )}
                  
                  {data.demoUrl && (
                    <div className="space-y-2">
                      <p className="text-gray-600">Demo URL</p>
                      <a 
                        href={data.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#114DFF] hover:underline"
                      >
                        {data.demoUrl}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Market & Competition */}
            {(data.tam || data.competitors) && (
              <Card className="border-[#C8D6FF]">
                <CardHeader className="bg-[#F7F9FF] border-b border-[#C8D6FF]">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Target className="w-5 h-5 text-[#114DFF]" />
                    Market & Competition
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {(data.tam || data.sam || data.som) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {data.tam && (
                        <div className="space-y-2">
                          <p className="text-gray-600">TAM (Total Addressable Market)</p>
                          <p className="text-gray-900">{data.tam}</p>
                        </div>
                      )}
                      {data.sam && (
                        <div className="space-y-2">
                          <p className="text-gray-600">SAM (Serviceable Available Market)</p>
                          <p className="text-gray-900">{data.sam}</p>
                        </div>
                      )}
                      {data.som && (
                        <div className="space-y-2">
                          <p className="text-gray-600">SOM (Serviceable Obtainable Market)</p>
                          <p className="text-gray-900">{data.som}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {data.whyNow && (
                    <>
                      <Separator className="bg-[#C8D6FF]" />
                      <div className="space-y-2">
                        <p className="text-gray-600">Why Now?</p>
                        <p className="text-gray-900 whitespace-pre-wrap">{data.whyNow}</p>
                      </div>
                    </>
                  )}
                  
                  {data.competitors && data.competitors.length > 0 && (
                    <>
                      <Separator className="bg-[#C8D6FF]" />
                      <div className="space-y-3">
                        <p className="text-gray-600">Competitors</p>
                        {data.competitors.map((competitor, index) => (
                          <div key={index} className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-gray-900">{competitor.name}</p>
                                {competitor.url && (
                                  <a 
                                    href={competitor.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[#114DFF] hover:underline"
                                  >
                                    <Globe className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                              {competitor.differentiation && (
                                <p className="text-gray-600">{competitor.differentiation}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Traction & Financials */}
            {(data.mrr || data.arr || data.monthlyRevenue) && (
              <Card className="border-[#C8D6FF]">
                <CardHeader className="bg-[#F7F9FF] border-b border-[#C8D6FF]">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <TrendingUp className="w-5 h-5 text-[#114DFF]" />
                    Traction & Financials
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.mrr && (
                      <div className="space-y-2">
                        <p className="text-gray-600">MRR</p>
                        <p className="text-gray-900">{data.mrr}</p>
                      </div>
                    )}
                    {data.arr && (
                      <div className="space-y-2">
                        <p className="text-gray-600">ARR</p>
                        <p className="text-gray-900">{data.arr}</p>
                      </div>
                    )}
                    {data.growthRate && (
                      <div className="space-y-2">
                        <p className="text-gray-600">Growth Rate</p>
                        <p className="text-gray-900">{data.growthRate}</p>
                      </div>
                    )}
                    {data.mau && (
                      <div className="space-y-2">
                        <p className="text-gray-600">MAU</p>
                        <p className="text-gray-900">{data.mau}</p>
                      </div>
                    )}
                    {data.retention && (
                      <div className="space-y-2">
                        <p className="text-gray-600">Retention Rate</p>
                        <p className="text-gray-900">{data.retention}</p>
                      </div>
                    )}
                    {data.cac && (
                      <div className="space-y-2">
                        <p className="text-gray-600">CAC</p>
                        <p className="text-gray-900">{data.cac}</p>
                      </div>
                    )}
                    {data.ltv && (
                      <div className="space-y-2">
                        <p className="text-gray-600">LTV</p>
                        <p className="text-gray-900">{data.ltv}</p>
                      </div>
                    )}
                    {data.grossMargin && (
                      <div className="space-y-2">
                        <p className="text-gray-600">Gross Margin</p>
                        <p className="text-gray-900">{data.grossMargin}</p>
                      </div>
                    )}
                    {data.burn && (
                      <div className="space-y-2">
                        <p className="text-gray-600">Monthly Burn</p>
                        <p className="text-gray-900">{data.burn}</p>
                      </div>
                    )}
                    {data.runway && (
                      <div className="space-y-2">
                        <p className="text-gray-600">Runway</p>
                        <p className="text-gray-900">{data.runway}</p>
                      </div>
                    )}
                  </div>
                  
                  {data.proofOfDemand && (
                    <>
                      <Separator className="bg-[#C8D6FF]" />
                      <div className="space-y-2">
                        <p className="text-gray-600">Proof of Demand</p>
                        <p className="text-gray-900 whitespace-pre-wrap">{data.proofOfDemand}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Business Model & GTM */}
            {(data.pricing || data.salesCycle || data.partnerships) && (
              <Card className="border-[#C8D6FF]">
                <CardHeader className="bg-[#F7F9FF] border-b border-[#C8D6FF]">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Briefcase className="w-5 h-5 text-[#114DFF]" />
                    Business Model & Go-to-Market
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {data.pricing && (
                    <div className="space-y-2">
                      <p className="text-gray-600">Pricing Strategy</p>
                      <p className="text-gray-900 whitespace-pre-wrap">{data.pricing}</p>
                    </div>
                  )}
                  
                  {data.salesCycle && (
                    <div className="space-y-2">
                      <p className="text-gray-600">Sales Cycle</p>
                      <p className="text-gray-900 whitespace-pre-wrap">{data.salesCycle}</p>
                    </div>
                  )}
                  
                  {data.partnerships && (
                    <div className="space-y-2">
                      <p className="text-gray-600">Strategic Partnerships</p>
                      <p className="text-gray-900 whitespace-pre-wrap">{data.partnerships}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Funding & Cap Table */}
            {(data.fundingRounds || data.raisingNow !== undefined) && (
              <Card className="border-[#C8D6FF]">
                <CardHeader className="bg-[#F7F9FF] border-b border-[#C8D6FF]">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <DollarSign className="w-5 h-5 text-[#114DFF]" />
                    Funding & Cap Table
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {data.fundingRounds && data.fundingRounds.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-gray-600">Previous Funding Rounds</p>
                      {data.fundingRounds.map((round, index) => (
                        <div key={index} className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <p className="text-gray-600">Type</p>
                              <p className="text-gray-900">{round.type}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-gray-600">Date</p>
                              <p className="text-gray-900">{round.date}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-gray-600">Amount</p>
                              <p className="text-gray-900">{round.amount}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-gray-600">Investors</p>
                              <p className="text-gray-900">{round.investors}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {data.capTableSummary && (
                    <>
                      <Separator className="bg-[#C8D6FF]" />
                      <div className="space-y-2">
                        <p className="text-gray-600">Cap Table Summary</p>
                        <p className="text-gray-900 whitespace-pre-wrap">{data.capTableSummary}</p>
                      </div>
                    </>
                  )}
                  
                  {data.raisingNow !== undefined && (
                    <>
                      <Separator className="bg-[#C8D6FF]" />
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <p className="text-gray-600">Currently Raising?</p>
                          <Badge className={data.raisingNow ? "bg-[#F0FDF4] text-[#06CB1D] border-[#86EFAC]" : "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]"}>
                            {data.raisingNow ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        
                        {data.raisingNow && data.targetAmount && (
                          <div className="space-y-2">
                            <p className="text-gray-600">Target Amount</p>
                            <p className="text-gray-900">{data.targetAmount}</p>
                          </div>
                        )}
                        
                        {data.raisingNow && data.useOfFunds && (
                          <div className="space-y-2">
                            <p className="text-gray-600">Use of Funds</p>
                            <p className="text-gray-900 whitespace-pre-wrap">{data.useOfFunds}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Legal, IP & Compliance */}
            {(data.incorporated !== undefined || data.ipStatus) && (
              <Card className="border-[#C8D6FF]">
                <CardHeader className="bg-[#F7F9FF] border-b border-[#C8D6FF]">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Scale className="w-5 h-5 text-[#114DFF]" />
                    Legal, IP & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {data.incorporated !== undefined && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-600">Company Incorporated?</p>
                        <Badge className={data.incorporated ? "bg-[#F0FDF4] text-[#06CB1D] border-[#86EFAC]" : "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]"}>
                          {data.incorporated ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      
                      {data.incorporated && data.jurisdiction && (
                        <div className="space-y-2">
                          <p className="text-gray-600">Jurisdiction</p>
                          <p className="text-gray-900">{data.jurisdiction}</p>
                        </div>
                      )}
                      
                      {data.registrations && (
                        <div className="space-y-2">
                          <p className="text-gray-600">Registrations & Licenses</p>
                          <p className="text-gray-900 whitespace-pre-wrap">{data.registrations}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {data.ipStatus && (
                    <>
                      <Separator className="bg-[#C8D6FF]" />
                      <div className="space-y-2">
                        <p className="text-gray-600">IP Status</p>
                        <p className="text-gray-900 whitespace-pre-wrap">{data.ipStatus}</p>
                      </div>
                    </>
                  )}
                  
                  {data.compliance && (
                    <>
                      <Separator className="bg-[#C8D6FF]" />
                      <div className="space-y-2">
                        <p className="text-gray-600">Compliance & Regulatory</p>
                        <p className="text-gray-900 whitespace-pre-wrap">{data.compliance}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Help Looking For */}
            {(data.primaryFocusArea || data.helpDescription) && (
              <Card className="border-[#C8D6FF]">
                <CardHeader className="bg-[#F7F9FF] border-b border-[#C8D6FF]">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Network className="w-5 h-5 text-[#114DFF]" />
                    Help & Support Needed
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {data.primaryFocusArea && data.primaryFocusArea.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-gray-600">Primary Focus Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {data.primaryFocusArea.map((area, index) => (
                          <Badge 
                            key={index} 
                            className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]"
                          >
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {data.specificSupport && (
                    <>
                      <Separator className="bg-[#C8D6FF]" />
                      <div className="space-y-2">
                        <p className="text-gray-600">Specific Support Needed</p>
                        <p className="text-gray-900 whitespace-pre-wrap">{data.specificSupport}</p>
                      </div>
                    </>
                  )}
                  
                  {data.helpDescription && (
                    <>
                      <Separator className="bg-[#C8D6FF]" />
                      <div className="space-y-2">
                        <p className="text-gray-600">Detailed Description</p>
                        <p className="text-gray-900 whitespace-pre-wrap">{data.helpDescription}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Submission Timestamp */}
        {data.submittedAt && (
          <Card className="border-[#C8D6FF] bg-[#F7F9FF]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Application Submitted</span>
                </div>
                <span className="text-gray-900">
                  {new Date(data.submittedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  )
}

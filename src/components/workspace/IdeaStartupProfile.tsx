import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import {
  Building,
  Linkedin,
  Globe,
  Mail,
  Instagram,
  BarChart3,
  UserCircle,
  Video,
  Upload,
  ChevronDown,
  ChevronRight,
  Lock,
  Eye,
  Edit2,
  ExternalLink,
  Target,
  Users,
  DollarSign,
  FileText,
  User
} from 'lucide-react'
import { IdeaProject, IdeaStage, STAGE_INFO } from './IdeaLifecycleStages'

interface IdeaStartupProfileProps {
  project: IdeaProject
  isFinancialMetricsUnlocked: boolean
  openSections: Record<string, boolean>
  onToggleSection: (sectionId: string) => void
}

export function IdeaStartupProfile({ 
  project, 
  isFinancialMetricsUnlocked, 
  openSections, 
  onToggleSection 
}: IdeaStartupProfileProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null)

  const profileSections = [
    {
      id: 'company-details',
      title: 'Company Details',
      icon: Building,
      description: 'Basic company information and social profiles',
      locked: false
    },
    {
      id: 'market-research',
      title: 'Market Research',
      icon: Target,
      description: 'Market analysis and competitive landscape',
      locked: false
    },
    {
      id: 'target-audience',
      title: 'Target Audience & Customers',
      icon: Users,
      description: 'Customer personas and target market segments',
      locked: false
    },
    {
      id: 'business-model',
      title: 'Business Model',
      icon: BarChart3,
      description: 'Revenue streams and business strategy',
      locked: false
    },
    {
      id: 'financial-metrics',
      title: 'Financial & Adoption Metrics',
      icon: DollarSign,
      description: 'Financial performance and user adoption metrics',
      locked: !isFinancialMetricsUnlocked
    },
    {
      id: 'assets-attachments',
      title: 'Assets & Attachments',
      icon: FileText,
      description: 'Pitch videos, decks and supporting materials',
      locked: false
    },
    {
      id: 'cofounders-leadership',
      title: 'Co-founders & Leadership',
      icon: UserCircle,
      description: 'Team members and leadership details',
      locked: false
    }
  ]

  const renderCompanyDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">Startup Incorporation Number</label>
          <Input placeholder="e.g., DE123456789" />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Contact Email</label>
          <Input placeholder="contact@yourstartu.com" />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Company Website</label>
        <div className="flex items-center space-x-2">
          <Input placeholder="https://yourstartup.com" />
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Separator />
      
      <div className="space-y-3">
        <h4 className="font-medium">Social Media Profiles</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Linkedin className="w-5 h-5 text-blue-600" />
            <Input placeholder="https://linkedin.com/company/yourstartup" className="flex-1" />
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Instagram className="w-5 h-5 text-pink-600" />
            <Input placeholder="https://instagram.com/yourstartup" className="flex-1" />
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMarketResearch = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm">Market Size & Opportunity</label>
        <Textarea placeholder="Describe the total addressable market (TAM), serviceable addressable market (SAM), and your target market size..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Competitive Analysis</label>
        <Textarea placeholder="List key competitors, their strengths/weaknesses, and your competitive advantages..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Market Trends & Insights</label>
        <Textarea placeholder="Key market trends, growth drivers, and industry insights that support your business..." rows={3} />
      </div>
    </div>
  )

  const renderTargetAudience = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm">Primary Customer Personas</label>
        <Textarea placeholder="Describe your main customer segments, their demographics, pain points, and behaviors..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Customer Acquisition Strategy</label>
        <Textarea placeholder="How do you plan to reach and acquire customers? Include marketing channels, partnerships, etc..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Customer Validation</label>
        <Textarea placeholder="What validation have you done with customers? Include surveys, interviews, pilot programs..." rows={3} />
      </div>
    </div>
  )

  const renderBusinessModel = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm">Revenue Streams</label>
        <Textarea placeholder="Describe your main revenue streams, pricing model, and monetization strategy..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Value Proposition</label>
        <Textarea placeholder="What unique value do you provide to customers? How do you solve their problems differently..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Go-to-Market Strategy</label>
        <Textarea placeholder="Your strategy for launching and scaling, including distribution channels, partnerships..." rows={3} />
      </div>
    </div>
  )

  const renderFinancialMetrics = () => {
    if (!isFinancialMetricsUnlocked) {
      return (
        <div className="text-center py-8">
          <Lock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h4 className="font-medium text-gray-600 mb-2">Financial Metrics Locked</h4>
          <p className="text-sm text-gray-500 mb-4">
            Complete the "Registered" stage to unlock financial and adoption metrics
          </p>
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            Available after Registration
          </Badge>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm">Monthly Recurring Revenue (MRR)</label>
            <Input placeholder="$0" />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Customer Acquisition Cost (CAC)</label>
            <Input placeholder="$0" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm">Total Users/Customers</label>
            <Input placeholder="0" />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Monthly Active Users (MAU)</label>
            <Input placeholder="0" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm">Key Performance Indicators</label>
          <Textarea placeholder="List your main KPIs, growth metrics, and how you measure success..." rows={3} />
        </div>
      </div>
    )
  }

  const renderAssetsAttachments = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm">Short Pitch Video</label>
        <div className="flex items-center space-x-2">
          <Input placeholder="YouTube or Vimeo link" />
          <Button variant="outline" size="sm">
            <Video className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Pitch Deck</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-2">Upload your pitch deck (PDF)</p>
          <Button variant="outline" size="sm">
            Choose File
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Additional Materials</label>
        <div className="space-y-2">
          <div className="border rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm">No files uploaded yet</span>
            </div>
            <Button variant="outline" size="sm">
              Add Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCoFoundersLeadership = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm">Founder Information</label>
        <Textarea placeholder="Brief background of founders, their expertise, and previous experience..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Team Composition</label>
        <Textarea placeholder="Current team members, their roles, and key skills. Include any advisors..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Leadership Structure</label>
        <Textarea placeholder="How is your company organized? Who makes key decisions? Any board members..." rows={3} />
      </div>
    </div>
  )

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'company-details':
        return renderCompanyDetails()
      case 'market-research':
        return renderMarketResearch()
      case 'target-audience':
        return renderTargetAudience()
      case 'business-model':
        return renderBusinessModel()
      case 'financial-metrics':
        return renderFinancialMetrics()
      case 'assets-attachments':
        return renderAssetsAttachments()
      case 'cofounders-leadership':
        return renderCoFoundersLeadership()
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5" />
            <div>
              <CardTitle>Idea/Startup Profile</CardTitle>
              <p className="text-sm text-muted-foreground">
                Comprehensive details about your startup
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {profileSections.map((section, index) => {
            const Icon = section.icon
            const isOpen = openSections[section.id]
            const isLocked = section.locked

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Collapsible
                  open={isOpen && !isLocked}
                  onOpenChange={() => !isLocked && onToggleSection(section.id)}
                >
                  <CollapsibleTrigger asChild>
                    <div className={`w-full p-4 border rounded-lg transition-all cursor-pointer hover:border-purple-200 ${
                      isOpen && !isLocked ? 'border-purple-200 bg-purple-50/50' : 'border-border'
                    } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isLocked ? 'bg-gray-100' : 'bg-purple-100'
                          }`}>
                            {isLocked ? (
                              <Lock className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Icon className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{section.title}</h4>
                            <p className="text-sm text-muted-foreground">{section.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isLocked && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              Locked
                            </Badge>
                          )}
                          {!isLocked && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingSection(editingSection === section.id ? null : section.id)
                                }}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              {isOpen ? (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  {!isLocked && (
                    <CollapsibleContent>
                      <div className="mt-3 p-4 border border-t-0 rounded-b-lg bg-white">
                        {renderSectionContent(section.id)}
                        
                        <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t">
                          <Button variant="outline" size="sm">
                            Cancel
                          </Button>
                          <Button size="sm">
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
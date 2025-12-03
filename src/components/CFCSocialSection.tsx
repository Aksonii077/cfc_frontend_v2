'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Plus,
  TrendingUp,
  Award,
  Users,
  Lightbulb,
  Rocket,
  DollarSign,
  Calendar,
  MapPin,
  Globe,
  Camera,
  Video,
  Link as LinkIcon,
  Bookmark,
  Eye
} from 'lucide-react'

export function CFCSocialSection() {
  const [newPostContent, setNewPostContent] = useState('')

  const posts = [
    {
      id: 1,
      author: {
        name: "Sarah Chen",
        title: "Founder, EcoTech Solutions",
        avatar: "SC",
        verified: true,
        type: "Founder"
      },
      timestamp: "2 hours ago",
      content: "Just completed our Series A funding round! 🎉 Raised $2.5M to accelerate our sustainable packaging technology. Huge thanks to our investors and the amazing CFC community for the support. Next stop: scaling production and expanding to new markets! #startup #funding #sustainability",
      type: "achievement",
      metrics: {
        likes: 147,
        comments: 23,
        shares: 15,
        views: 1240
      },
      tags: ["Funding", "Series A", "Sustainability"],
      hasImage: false,
      isLiked: false,
      isBookmarked: true
    },
    {
      id: 2,
      author: {
        name: "Dr. Michael Rodriguez",
        title: "Wellness Industry Expert",
        avatar: "MR",
        verified: true,
        type: "Mentor"
      },
      timestamp: "4 hours ago",
      content: "Excited to announce that I'm joining CFC as a mentor! Looking forward to working with wellness and health startups. If you're building something in the holistic health space, I'd love to connect. My expertise includes Ayurveda, product development, and market strategy. Book a session through my profile! 🌿",
      type: "announcement",
      metrics: {
        likes: 89,
        comments: 34,
        shares: 12,
        views: 856
      },
      tags: ["Mentorship", "Wellness", "Ayurveda"],
      hasImage: true,
      isLiked: true,
      isBookmarked: false
    },
    {
      id: 3,
      author: {
        name: "TechStart Accelerator",
        title: "Leading Tech Accelerator",
        avatar: "TSA",
        verified: true,
        type: "Incubator"
      },
      timestamp: "6 hours ago",
      content: "Applications are now open for our Fall 2024 cohort! We're looking for 12 exceptional early-stage tech startups. This batch focuses on AI, SaaS, and fintech. $250K investment + 12 weeks of intensive mentorship. Application deadline: June 15th. Apply now! 🚀",
      type: "opportunity",
      metrics: {
        likes: 203,
        comments: 67,
        shares: 45,
        views: 2100
      },
      tags: ["Accelerator", "Applications", "Funding"],
      hasImage: false,
      isLiked: false,
      isBookmarked: true
    },
    {
      id: 4,
      author: {
        name: "Emma Johnson",
        title: "Content Strategist",
        avatar: "EJ",
        verified: false,
        type: "Service Provider"
      },
      timestamp: "8 hours ago",
      content: "Just wrapped up an amazing project with a wellness startup! Helped them develop their content strategy and saw 300% increase in engagement. If any CFC startups need help with content marketing, copywriting, or social media strategy, let's chat! Special rates for community members 💪",
      type: "service",
      metrics: {
        likes: 56,
        comments: 12,
        shares: 8,
        views: 445
      },
      tags: ["Content Marketing", "Service"],
      hasImage: false,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: 5,
      author: {
        name: "James Thompson",
        title: "Angel Investor",
        avatar: "JT",
        verified: true,
        type: "Investor"
      },
      timestamp: "12 hours ago",
      content: "Market insight: The wellness industry is experiencing unprecedented growth. Just invested in 3 wellness startups this quarter. Key trends I'm seeing: personalized nutrition, mental health tech, and holistic lifestyle platforms. Founders in this space, would love to hear your thoughts! What opportunities are you seeing? 💡",
      type: "insight",
      metrics: {
        likes: 178,
        comments: 89,
        shares: 34,
        views: 1890
      },
      tags: ["Market Insight", "Wellness", "Investment"],
      hasImage: false,
      isLiked: true,
      isBookmarked: false
    }
  ]

  const trendingTopics = [
    { name: "AI Startups", posts: 156 },
    { name: "Funding News", posts: 89 },
    { name: "Wellness Tech", posts: 67 },
    { name: "Product Launch", posts: 45 },
    { name: "Mentorship", posts: 34 }
  ]

  const suggestedConnections = [
    {
      name: "Alex Chen",
      title: "Full-Stack Developer",
      avatar: "AC",
      mutualConnections: 5
    },
    {
      name: "Priya Patel",
      title: "UX Designer",
      avatar: "PP",
      mutualConnections: 3
    },
    {
      name: "David Kim",
      title: "Growth Marketer",
      avatar: "DK",
      mutualConnections: 7
    }
  ]

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="w-4 h-4 text-yellow-500" />
      case 'announcement': return <Users className="w-4 h-4 text-blue-500" />
      case 'opportunity': return <Rocket className="w-4 h-4 text-green-500" />
      case 'service': return <Lightbulb className="w-4 h-4 text-purple-500" />
      case 'insight': return <TrendingUp className="w-4 h-4 text-orange-500" />
      default: return <MessageCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getAuthorTypeColor = (type: string) => {
    switch (type) {
      case 'Founder': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Mentor': return 'bg-green-100 text-green-800 border-green-200'
      case 'Incubator': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Investor': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Service Provider': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const PostCard = ({ post }: { post: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    {post.author.avatar}
                  </AvatarFallback>
                </Avatar>
                {post.author.verified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold">{post.author.name}</h4>
                  <Badge variant="outline" className={`text-xs ${getAuthorTypeColor(post.author.type)}`}>
                    {post.author.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{post.author.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getPostTypeIcon(post.type)}
                  <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-sm leading-relaxed">{post.content}</p>
            {post.hasImage && (
              <div className="mt-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Camera className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Image content</p>
                </div>
              </div>
            )}
          </div>

          {/* Post Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  #{tag.toLowerCase().replace(' ', '')}
                </Badge>
              ))}
            </div>
          )}

          {/* Post Metrics */}
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{post.metrics.likes}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.metrics.comments}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.metrics.views}</span>
              </span>
            </div>
            <span>{post.metrics.shares} shares</span>
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={`space-x-2 ${post.isLiked ? 'text-red-600' : ''}`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-600' : ''}`} />
                <span>Like</span>
              </Button>
              <Button variant="ghost" size="sm" className="space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Comment</span>
              </Button>
              <Button variant="ghost" size="sm" className="space-x-2">
                <Share className="w-4 h-4" />
                <span>Share</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={post.isBookmarked ? 'text-blue-600' : ''}
            >
              <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-blue-600' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">CFC Social</h2>
          <p className="text-muted-foreground">Connect, share, and stay updated with the CFC community</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Create Post */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    DU
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Share your entrepreneurial journey, insights, or ask the community..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="min-h-16 border-0 p-0 resize-none focus-visible:ring-0 placeholder:text-muted-foreground"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Photo
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4 mr-2" />
                        Video
                      </Button>
                      <Button variant="ghost" size="sm">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Link
                      </Button>
                    </div>
                    <Button disabled={!newPostContent.trim()}>
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <Button variant="outline">Load More Posts</Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span>Trending Topics</span>
              </h3>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">#{topic.name.toLowerCase().replace(' ', '')}</p>
                    <p className="text-xs text-muted-foreground">{topic.posts} posts</p>
                  </div>
                  <Button variant="ghost" size="sm">Follow</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Suggested Connections */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Suggested Connections</span>
              </h3>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              {suggestedConnections.map((connection, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-sm">
                        {connection.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{connection.name}</p>
                      <p className="text-xs text-muted-foreground">{connection.title}</p>
                      <p className="text-xs text-muted-foreground">{connection.mutualConnections} mutual</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="w-3 h-3 mr-1" />
                    Connect
                  </Button>
                </div>
              ))}
              <Button variant="ghost" className="w-full">
                View All Suggestions
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>Upcoming Events</span>
              </h3>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-medium text-sm text-blue-900">CFC Wellness Summit</p>
                  <p className="text-xs text-blue-700">March 25, 2024 • Virtual</p>
                  <p className="text-xs text-blue-600 mt-1">127 attending</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-medium text-sm text-green-900">Pitch Night</p>
                  <p className="text-xs text-green-700">April 2, 2024 • San Francisco</p>
                  <p className="text-xs text-green-600 mt-1">45 attending</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full">
                View All Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
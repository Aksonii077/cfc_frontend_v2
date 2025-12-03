import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Linkedin,
  Twitter,
  Edit,
  Save,
  Target,
} from "lucide-react";
import { useState } from "react";

export function MentorProfileSection() {
  const [isEditing, setIsEditing] = useState(false);

  // Mock profile data
  const [profile, setProfile] = useState({
    name: "Dr. James Peterson",
    email: "james.peterson@techstars.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    title: "Senior Partner & Mentor",
    organization: "TechStars Accelerator",
    experience: "15+ years",
    bio: "Experienced mentor and startup advisor with 15+ years in the tech industry. Successfully guided 50+ startups from ideation to Series A funding. Specialized in AI/ML, SaaS, and FinTech sectors.",
    expertise: ["Startup Mentoring", "Investment Strategy", "Product Development", "Market Validation", "Fundraising", "Team Building"],
    industries: ["Technology", "SaaS", "AI/ML", "FinTech", "HealthTech"],
    linkedin: "linkedin.com/in/jamespeterson",
    twitter: "@jamespeterson",
    website: "jamespeterson.com",
  });

  const stats = {
    startupsHelped: 50,
    activeMentorships: 12,
    fundingRaised: "$150M+",
    avgRating: 4.9,
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Basic Information */}
      <Card className="border-[#C8D6FF]">
        <CardHeader className="border-b border-[#C8D6FF]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#114DFF] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              Basic information
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-[#114DFF]">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12 ring-2 ring-[#C8D6FF]">
              <AvatarFallback className="bg-[#F5F5F5] text-gray-700">
                DU
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-gray-900">Demo User</h4>
              <p className="text-gray-600">Serial Entrepreneur & FinTech Expert</p>
              <div className="flex items-center gap-1 mt-1 text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-[#C8D6FF]">
        <CardHeader className="border-b border-[#C8D6FF]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#114DFF] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              About
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-[#114DFF]">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700">
            15+ years building financial technology solutions across India. Founded two successful fintech startups, with expertise in digital payments, lending platforms, and regulatory compliance. Passionate about mentoring the next generation of entrepreneurs.
          </p>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="border-[#C8D6FF]">
        <CardHeader className="border-b border-[#C8D6FF]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#114DFF] rounded-full flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              Experience
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-[#114DFF]">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Experience Item 1 */}
          <div className="flex gap-3">
            <div className="w-2 h-2 bg-[#114DFF] rounded-full mt-2"></div>
            <div>
              <h4 className="text-gray-900">Co-Founder & CEO</h4>
              <p className="text-[#114DFF]">PayNext Solutions</p>
              <p className="text-gray-600">2019 - Present</p>
              <p className="text-gray-700">Leading India's fastest-growing B2B payment platform with $50M+ ARR</p>
            </div>
          </div>

          {/* Experience Item 2 */}
          <div className="flex gap-3">
            <div className="w-2 h-2 bg-[#114DFF] rounded-full mt-2"></div>
            <div>
              <h4 className="text-gray-900">Co-Founder & CEO</h4>
              <p className="text-[#114DFF]">PayNext Solutions</p>
              <p className="text-gray-600">2019 - Present</p>
              <p className="text-gray-700">Leading India's fastest-growing B2B payment platform with $50M+ ARR</p>
            </div>
          </div>

          {/* Experience Item 3 */}
          <div className="flex gap-3">
            <div className="w-2 h-2 bg-[#114DFF] rounded-full mt-2"></div>
            <div>
              <h4 className="text-gray-900">Co-Founder & CEO</h4>
              <p className="text-[#114DFF]">PayNext Solutions</p>
              <p className="text-gray-600">2019 - Present</p>
              <p className="text-gray-700">Leading India's fastest-growing B2B payment platform with $50M+ ARR</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentorship Focus */}
      <Card className="border-[#C8D6FF]">
        <CardHeader className="border-b border-[#C8D6FF]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#114DFF] rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              Mentorship Focus
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-[#114DFF]">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Industry Focus */}
          <div>
            <h5 className="text-gray-900 mb-2">Industry Focus</h5>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[#114DFF] text-white hover:bg-[#0d3eb8]">
                Fintech
              </Badge>
              <Badge className="bg-[#114DFF] text-white hover:bg-[#0d3eb8]">
                SaaS
              </Badge>
            </div>
          </div>

          {/* Functional Expertise */}
          <div>
            <h5 className="text-gray-900 mb-2">Functional Expertise</h5>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]">
                Product Management
              </Badge>
              <Badge variant="outline" className="bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]">
                Strategy
              </Badge>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-2 h-2 bg-[#114DFF] rounded-full"></div>
            <span>Availability: 3-5h / wk</span>
          </div>
        </CardContent>
      </Card>

      {/* Socials */}
      <Card className="border-[#C8D6FF]">
        <CardHeader className="border-b border-[#C8D6FF]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#114DFF] rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              Socials
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-[#114DFF]">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:opacity-80">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-lg bg-[#0077B5] flex items-center justify-center text-white hover:opacity-80">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white hover:opacity-80">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
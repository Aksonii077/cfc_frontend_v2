import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Alert, AlertDescription } from "../../ui/alert";
import { initializeMentorDatabase, checkMentorDatabaseHealth, seedMentorDemoData } from "../../../utils/supabase/initializeMentorDB";
import { Database, CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw, Settings } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface DatabaseSetupProps {
  mentorId: string;
  onSetupComplete?: () => void;
}

export function DatabaseSetup({ mentorId, onSetupComplete }: DatabaseSetupProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [health, setHealth] = useState<{
    tablesExist: boolean;
    rlsEnabled: boolean;
    triggersExist: boolean;
    recommendations: string[];
  } | null>(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const healthStatus = await checkMentorDatabaseHealth();
      setHealth(healthStatus);
    } catch (error) {
      console.error('Error checking database health:', error);
      toast.error("Failed to check database status");
    } finally {
      setIsChecking(false);
    }
  };

  const seedDemoData = async () => {
    setIsSeeding(true);
    try {
      await seedMentorDemoData(mentorId);
      toast.success("Demo data seeded successfully", {
        description: "You now have 10 sample applications to work with."
      });
      if (onSetupComplete) {
        onSetupComplete();
      }
    } catch (error) {
      console.error('Error seeding demo data:', error);
      toast.error("Failed to seed demo data", {
        description: "Please check your database setup and try again."
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const sqlCommands = {
    createTables: `-- ===================================
-- MENTOR APPLICATION REVIEW SYSTEM
-- Database Setup Script
-- ===================================

-- Create mentor_applications table
CREATE TABLE IF NOT EXISTS mentor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_name TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  founder_email TEXT NOT NULL,
  industry TEXT NOT NULL,
  stage TEXT NOT NULL,
  location TEXT NOT NULL,
  requested_funding INTEGER NOT NULL,
  ai_score INTEGER NOT NULL,
  market_score INTEGER NOT NULL,
  team_score INTEGER NOT NULL,
  idea_score INTEGER NOT NULL,
  fit_score INTEGER NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'reviewing', 'interview-scheduled', 'interview-completed', 'accepted', 'rejected', 'agreement-ongoing', 'agreement-successful')),
  description TEXT NOT NULL,
  team_size INTEGER NOT NULL,
  previous_funding INTEGER NOT NULL,
  revenue_stage TEXT NOT NULL,
  mentor_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interview_notes table
CREATE TABLE IF NOT EXISTS interview_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES mentor_applications(id) ON DELETE CASCADE,
  overall_impression TEXT NOT NULL,
  strengths TEXT NOT NULL,
  concerns TEXT,
  market_fit TEXT,
  team_capability TEXT,
  next_steps TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  interview_date DATE NOT NULL,
  interview_duration TEXT,
  attendees JSONB NOT NULL,
  key_questions JSONB NOT NULL,
  follow_up_actions JSONB NOT NULL,
  recommendation TEXT NOT NULL CHECK (recommendation IN ('strong-accept', 'accept', 'maybe', 'decline', 'strong-decline')),
  mentor_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create acceptance_emails table
CREATE TABLE IF NOT EXISTS acceptance_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES mentor_applications(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  program_details JSONB NOT NULL,
  links JSONB NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  mentor_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create application_rejections table
CREATE TABLE IF NOT EXISTS application_rejections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES mentor_applications(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fit', 'timing', 'stage', 'resources')),
  email_subject TEXT NOT NULL,
  email_content TEXT NOT NULL,
  offer_feedback BOOLEAN DEFAULT FALSE,
  future_consideration BOOLEAN DEFAULT FALSE,
  rejected_at TIMESTAMP WITH TIME ZONE NOT NULL,
  mentor_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mentor_applications_mentor_id ON mentor_applications(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_applications_status ON mentor_applications(status);
CREATE INDEX IF NOT EXISTS idx_mentor_applications_created_at ON mentor_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_interview_notes_application_id ON interview_notes(application_id);
CREATE INDEX IF NOT EXISTS idx_acceptance_emails_application_id ON acceptance_emails(application_id);
CREATE INDEX IF NOT EXISTS idx_application_rejections_application_id ON application_rejections(application_id);`,

    enableRLS: `-- ===================================
-- ROW LEVEL SECURITY SETUP
-- ===================================

-- Enable Row Level Security (RLS)
ALTER TABLE mentor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE acceptance_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_rejections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for mentor_applications
CREATE POLICY "mentors_can_manage_their_applications" ON mentor_applications
  FOR ALL USING (auth.uid()::text = mentor_id::text);

-- Create RLS policies for interview_notes
CREATE POLICY "mentors_can_manage_their_interview_notes" ON interview_notes
  FOR ALL USING (auth.uid()::text = mentor_id::text);

-- Create RLS policies for acceptance_emails
CREATE POLICY "mentors_can_manage_their_emails" ON acceptance_emails
  FOR ALL USING (auth.uid()::text = mentor_id::text);

-- Create RLS policies for application_rejections
CREATE POLICY "mentors_can_manage_their_rejections" ON application_rejections
  FOR ALL USING (auth.uid()::text = mentor_id::text);`,

    addTriggers: `-- ===================================
-- AUTOMATIC TIMESTAMP TRIGGERS
-- ===================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to relevant tables
CREATE TRIGGER update_mentor_applications_updated_at 
    BEFORE UPDATE ON mentor_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interview_notes_updated_at 
    BEFORE UPDATE ON interview_notes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Mentor Database Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Database Status</h3>
              <p className="text-sm text-gray-600">Check if your mentor tables are properly configured</p>
            </div>
            <Button
              variant="outline"
              onClick={checkHealth}
              disabled={isChecking}
              className="gap-2"
            >
              {isChecking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Check Status
            </Button>
          </div>

          {health && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  {health.tablesExist ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm">Tables</span>
                  <Badge variant={health.tablesExist ? "default" : "destructive"}>
                    {health.tablesExist ? "Created" : "Missing"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  {health.rlsEnabled ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  )}
                  <span className="text-sm">Security</span>
                  <Badge variant={health.rlsEnabled ? "default" : "secondary"}>
                    {health.rlsEnabled ? "Enabled" : "Setup Needed"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Triggers</span>
                  <Badge variant="secondary">Check Needed</Badge>
                </div>
              </div>

              {health.recommendations.length > 0 && (
                <Alert>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Setup Required:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {health.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {health && !health.tablesExist && (
        <Card>
          <CardHeader>
            <CardTitle>SQL Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Run these SQL commands in your Supabase SQL Editor in order:
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">1. Create Tables</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(sqlCommands.createTables)}
                  >
                    Copy SQL
                  </Button>
                </div>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto max-h-32">
                  {sqlCommands.createTables.split('\n').slice(0, 10).join('\n')}...
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">2. Enable Row Level Security</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(sqlCommands.enableRLS)}
                  >
                    Copy SQL
                  </Button>
                </div>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto max-h-32">
                  {sqlCommands.enableRLS.split('\n').slice(0, 10).join('\n')}...
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">3. Add Triggers</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(sqlCommands.addTriggers)}
                  >
                    Copy SQL
                  </Button>
                </div>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto max-h-32">
                  {sqlCommands.addTriggers.split('\n').slice(0, 10).join('\n')}...
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {health && health.tablesExist && (
        <Card>
          <CardHeader>
            <CardTitle>Demo Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Seed Test Applications</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add 10 sample startup applications to test the mentor review workflow.
              </p>
              <Button
                onClick={seedDemoData}
                disabled={isSeeding}
                className="gap-2"
              >
                {isSeeding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Database className="w-4 h-4" />
                )}
                Seed Demo Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

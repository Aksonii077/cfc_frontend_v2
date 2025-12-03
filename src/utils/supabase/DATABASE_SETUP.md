# Mentor Application Review System - Database Setup

This guide will help you set up the required database tables for the Mentor Application Review System in your Supabase project.

## 📋 Prerequisites

1. A Supabase project set up and running
2. Access to the Supabase SQL Editor
3. User authentication working in your application

## 🗄️ Database Schema

### Step 1: Run the Database Schema Script

Go to your Supabase Dashboard → SQL Editor and run the following script:

```sql
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
CREATE INDEX IF NOT EXISTS idx_application_rejections_application_id ON application_rejections(application_id);
```

### Step 2: Enable Row Level Security (RLS)

Run this script to enable RLS and create security policies:

```sql
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
  FOR ALL USING (auth.uid()::text = mentor_id::text);
```

### Step 3: Create Update Trigger (Optional)

Add automatic timestamp updates:

```sql
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
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔐 Security Notes

### Row Level Security (RLS)
- **mentor_applications**: Users can only access applications assigned to them
- **interview_notes**: Users can only access notes they created
- **acceptance_emails**: Users can only access emails they sent
- **application_rejections**: Users can only access rejections they created

### Data Validation
- **Application Status**: Restricted to predefined values
- **Interview Rating**: Must be between 1-5
- **Recommendation**: Restricted to predefined values
- **Foreign Key Constraints**: Ensure data integrity

## 📊 Database Structure

### Primary Tables

1. **mentor_applications**
   - Core application data
   - AI scoring system
   - Status tracking
   - Mentor assignment

2. **interview_notes**
   - Detailed interview assessments
   - Rating system
   - Interview metadata
   - Structured feedback

3. **acceptance_emails**
   - Email template history
   - Program details
   - Send tracking

4. **application_rejections**
   - Rejection reasons
   - Audit trail

## 🧪 Testing the Setup

### 1. Seed Demo Data
Use the ApplicationReviewDemo component to seed sample data:

```typescript
// This will create sample applications for testing
MentorApplicationService.seedDemoData(currentUserId);
```

### 2. Verify Database
Check that all tables are created:

```sql
-- List all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'mentor_%' 
OR table_name LIKE '%applications%' 
OR table_name LIKE 'interview_%' 
OR table_name LIKE 'acceptance_%';
```

### 3. Check RLS Policies
Verify security policies are active:

```sql
-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('mentor_applications', 'interview_notes', 'acceptance_emails', 'application_rejections');
```

## 🚀 Usage

After setting up the database:

1. **Import the service**: `import { MentorApplicationService } from './utils/supabase/mentorApplicationService'`
2. **Load applications**: `MentorApplicationService.getApplicationsForMentor(mentorId)`
3. **Update status**: `MentorApplicationService.updateApplicationStatus(appId, newStatus)`
4. **Save notes**: `MentorApplicationService.saveInterviewNotes(notes)`

## 🔧 Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Ensure user is authenticated
   - Check that `auth.uid()` matches the mentor_id

2. **Foreign Key Constraints**
   - Applications must exist before creating related records
   - Check cascade delete behavior

3. **JSON Field Validation**
   - Ensure JSONB fields contain valid JSON
   - Check array structures for attendees, questions, etc.

### Debug Queries

```sql
-- Check current user
SELECT auth.uid();

-- View sample data
SELECT * FROM mentor_applications LIMIT 5;

-- Check interview notes
SELECT * FROM interview_notes WHERE application_id = 'your-app-id';
```

## 📈 Performance Optimization

The schema includes several performance optimizations:

- **Indexes** on frequently queried columns
- **Proper data types** for efficient storage
- **JSONB** for flexible but structured data
- **Cascading deletes** to maintain consistency

## 🔄 Migration Notes

If upgrading from a previous version:

1. Backup existing data
2. Run the schema updates
3. Migrate data if necessary
4. Test thoroughly before production use

---

**Need Help?** Check the Supabase documentation or create an issue in the project repository.
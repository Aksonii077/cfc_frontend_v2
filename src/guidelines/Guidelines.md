# RACE AI Platform - Development Guidelines

## Overview

RACE AI (formerly StratoScale™) is an AI-powered entrepreneurial platform that helps entrepreneurs take ideas from concept to startup and beyond. The platform features an AI super agent orchestrating specialized sub-agents for all entrepreneurial needs.

---

## Application Structure

### Core Architecture

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS v4.0
- **State Management**: React hooks (useState, useEffect, useContext)
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL
- **Icons**: Lucide React
- **Animations**: Motion (formerly Framer Motion)

### R-A-C-E Framework

1. **Research** - AI analysis and insights in chat responses
2. **Advise** - Expert recommendations and guidance
3. **Connect** - Network connections and recommendations in Action Center
4. **Execute** - Action chips and task execution

---

## Design System

### Color Palette (STRICTLY ENFORCED)

#### Primary Accents

- **Primary Blue**: `#114DFF`
- **Primary Teal**: `#3CE5A7`
- **Gradient**: `from-[#114DFF] to-[#3CE5A7]`

#### Backgrounds

- **Light Blue**: `#EDF2FF`
- **Lighter Blue**: `#F7F9FF`
- **Gray**: `#F5F5F5`
- **White**: `#FFFFFF`

#### Strokes/Borders

- **Gray Border**: `#CCCCCC`
- **Blue Border**: `#C8D6FF`

#### Semantic Colors

- **Success/Positive**: `#06CB1D`
- **Error/Negative**: `#FF220E`
- **Warning**: `#FF8C00`

### Typography Rules

#### Font Family

- **Primary**: Roboto (300, 400, 500, 700)
- **Base Size**: 14px

#### Font Size Classes - NEVER USE

**IMPORTANT**: Do NOT use Tailwind font size classes (`text-xs`, `text-sm`, `text-lg`, `text-xl`, etc.)
Typography is defined in `globals.css` and applied automatically to HTML elements:

- `h1` - Largest heading
- `h2` - Second level heading
- `h3` - Third level heading
- `h4` - Fourth level heading
- `p` - Paragraph text
- `label` - Form labels
- `button` - Button text
- `input` - Input text

#### Font Weight - NEVER USE

Do NOT use font weight classes (`font-bold`, `font-semibold`, etc.)
Font weights are set automatically in globals.css

#### Approved Text Color Classes

- `text-gray-900` - Primary dark text
- `text-gray-700` - Secondary dark text
- `text-gray-600` - Tertiary text
- `text-gray-500` - Light tertiary text
- `text-[#114DFF]` - Primary blue text
- `text-[#06CB1D]` - Success/positive text
- `text-[#FF220E]` - Error/negative text
- `text-white` - White text

### Component Guidelines

#### Icons

- **Library**: Lucide React only
- **Size**: Use `w-4 h-4`, `w-5 h-5`, `w-6 h-6`
- **Color**: Match brand colors

#### Buttons

- **Primary**: Gradient `bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]`
- **Hover**: `hover:from-[#0d3eb8] hover:to-[#2bc78f]`
- **Secondary**: Outline with `border-[#C8D6FF] hover:bg-[#EDF2FF]`
- **Destructive**: `bg-[#FF220E] hover:bg-[#cc1b0b]`

#### Cards

- **Border**: `border-[#C8D6FF]`
- **Hover**: `hover:border-[#114DFF]`
- **Background**: `bg-white`

#### Badges

- **Primary**: `bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]`
- **Success**: `bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]`
- **Error**: `bg-[#FFE5E5] text-[#FF220E] border-[#FF220E]/30`
- **Warning**: `bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]`

#### Avatars

- **Gradient**: `bg-gradient-to-br from-[#114DFF] to-[#3CE5A7]`
- **Ring**: `ring-2 ring-[#C8D6FF]`
- **Fallback**: `bg-[#F5F5F5] text-gray-700`

---

## Mentor Application Flow (8 States)

### State Definitions

1. **review-pending** - Initial application received, awaiting mentor review
2. **interview-scheduled** - Interview set up with founder
3. **interview-completed** - Interview done, awaiting decision
4. **accepted** - Application accepted, ready for agreement
5. **rejected** - Application not moving forward (terminal state)
6. **agreement-started** - Agreement initiated by mentor
7. **agreement-in-progress** - First term submitted, active negotiation
8. **agreement-complete** - Final agreement signed (backend only)

### State Transitions

```
review-pending
    ├→ interview-scheduled
    │      ↓
    │  interview-completed
    │      ├→ accepted
    │      │      ↓
    │      │  agreement-started (manual: mentor clicks "Start Agreement")
    │      │      ↓
    │      │  agreement-in-progress (auto: when first term submitted)
    │      │      ↓
    │      │  agreement-complete (backend: when agreements uploaded)
    │      │
    │      └→ rejected
    │
    └→ rejected
```

### Status Colors

- **review-pending**: Blue (`#114DFF`)
- **interview-scheduled**: Blue (`#114DFF`)
- **interview-completed**: Orange (`#FF8C00`)
- **accepted**: Green (`#06CB1D`)
- **rejected**: Red (`#FF220E`)
- **agreement-started**: Blue (`#114DFF`)
- **agreement-in-progress**: Orange (`#FF8C00`)
- **agreement-complete**: Green (`#06CB1D`)

---

## Authentication Flow

### Google OAuth States

#### Session Storage Keys

- `auth_intent`: Tracks whether user clicked "login" or "register"

#### Login Flow (Returning Users)

1. User clicks "Already A User, Login"
2. `sessionStorage.setItem('auth_intent', 'login')`
3. After auth: Skip onboarding, go directly to dashboard
4. Auto-mark onboarding as complete
5. Clear session storage

#### Register Flow (New Users)

1. User clicks "Register as New User"
2. `sessionStorage.setItem('auth_intent', 'register')`
3. After auth: Check for existing onboarding data
4. If none: Show onboarding flow
5. If exists: Skip to dashboard

### LocalStorage Keys

- `onboarding_complete_${userId}`: Boolean for onboarding completion
- `user_role_${userId}`: User's selected role
- `selected_dashboard_section_${userId}`: Dashboard section preference

---

## Code Organization Rules

### File Structure

- Keep files focused and single-purpose
- Maximum 500 lines per component file
- Extract reusable logic into hooks
- Place utility functions in `/utils`
- Keep components in appropriate subdirectories

### Import Order

1. React and React hooks
2. Third-party libraries
3. UI components
4. Custom components
5. Utilities and services
6. Types and interfaces
7. Assets and images
8. Icons (last)

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.tsx`)
- **Utils**: camelCase (`profileService.ts`)
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces**: PascalCase with descriptive names

---

## Component Best Practices

### State Management

- Use `useState` for component-level state
- Use `useEffect` for side effects
- Use `useContext` for global state (Auth)
- Avoid prop drilling beyond 2 levels

### Event Handlers

- Prefix with `handle` (`handleClick`, `handleSubmit`)
- Keep inline only for trivial actions
- Extract complex logic to separate functions

### Conditional Rendering

- Use early returns for cleaner code
- Avoid deeply nested ternaries
- Use `&&` for simple conditionals
- Use `? :` for binary conditions

### Lists and Keys

- Always provide unique `key` prop
- Use item IDs, not array indexes
- Map over data arrays, never hardcode

---

## Accessibility Guidelines

### ARIA Labels

- Add `aria-label` to icon-only buttons
- Use semantic HTML elements
- Ensure keyboard navigation works

### Color Contrast

- Maintain WCAG AA compliance
- Test text on background colors
- Provide alternative indicators beyond color

---

## Performance Guidelines

### Optimization

- Use `useMemo` for expensive calculations
- Use `useCallback` for function references
- Lazy load routes and heavy components
- Optimize images before use

### Bundle Size

- Import specific components, not entire libraries
- Remove unused dependencies
- Tree-shake wherever possible

---

## Database Schema

### Tables

- **profiles**: User profile data
- **mentor_applications**: Startup applications to mentors
- **agreements**: Mentorship agreement terms
- **documents**: Uploaded documents
- **kpi_data**: Startup metrics

### RLS (Row Level Security)

- All tables have RLS enabled
- Users can only access their own data
- Mentors can access their applicants' data

---

## Testing Checklist

### Before Deployment

- [ ] All imports resolve correctly
- [ ] No console errors
- [ ] Colors match brand palette
- [ ] No font size classes used
- [ ] All icons from Lucide React
- [ ] Authentication flows work
- [ ] State transitions work correctly
- [ ] Forms validate properly
- [ ] Responsive on mobile/tablet/desktop

---

## Common Pitfalls to Avoid

### ❌ Never Do

- Use custom colors outside approved palette
- Use Tailwind font size classes (`text-xl`, etc.)
- Use font weight classes (`font-bold`, etc.)
- Use opacity on approved colors (use solid colors only, except for specific exceptions)
- Import non-Lucide icons
- Create duplicate components
- Hardcode user data
- Skip error handling
- Ignore TypeScript errors

### ✅ Always Do

- Use approved brand colors
- Follow 8-state mentor flow
- Handle loading states
- Show error messages
- Validate form inputs
- Clean up useEffect
- Add proper TypeScript types
- Test authentication flows
- Check responsive design
- Follow component structure

---

## File Locations Reference

### Core Files

- **Entry Point**: `/App.tsx`
- **Auth Hook**: `/hooks/useAuth.tsx`
- **Supabase Client**: `/utils/supabase/client.ts`
- **Global Styles**: `/styles/globals.css`

### Key Components

- **Dashboard**: `/components/RaceAIDashboard.tsx`
- **Onboarding**: `/components/FounderOnboarding.tsx`
- **Mentor Dashboard**: `/components/mentor/MentorDashboard.tsx`
- **Application Management**: `/components/mentor/ApplicationManagement.tsx`
- **Portfolio**: `/components/mentor/PortfolioManagement.tsx`

### Services

- **Profile Service**: `/utils/supabase/profileService.ts`
- **Mentor Service**: `/utils/supabase/mentorApplicationService.ts`
- **Idea Validation**: `/utils/ideaValidationService.ts`

---

## Version History

### Current Version: 2.0

- Complete 8-state mentor application flow
- Enhanced authentication with login/register distinction
- Comprehensive design system with strict color palette
- Mentor dashboard with left navigation
- Agreement negotiation with version tracking
- Interview scheduling with reschedule capability
- Decisions tab with accept/reject functionality

---

## Support & Resources

### Documentation

- Tailwind CSS v4: https://tailwindcss.com/docs
- Lucide Icons: https://lucide.dev/icons
- Supabase: https://supabase.com/docs
- Motion: https://motion.dev

### Internal

- See `/SUPABASE_SETUP_INSTRUCTIONS.md` for database setup
- See `/MENTOR_DATABASE_SETUP.md` for mentor schema
- See `/JOB_PORTAL_TESTING_GUIDE.md` for job portal testing

---

**Last Updated**: January 2025
**Maintained By**: RACE AI Development Team
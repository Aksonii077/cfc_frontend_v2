// ================================
// Core Application Types
// ================================

export type UserRole = 'founder' | 'freelancer' | 'service_provider' | 'mentor' | 'investor' | 'student' | 'job_seeker';

export type EntrepreneurialStage = 
  | 'new' 
  | 'onboarding' 
  | 'ideation' 
  | 'validation' 
  | 'scaling' 
  | 'investing' 
  | 'established' 
  | 'supporting' 
  | 'learning' 
  | 'seeking';

// ================================
// User & Profile Types
// ================================

export interface BaseProfile {
  title?: string;
  company?: string;
  experience?: string;
  skills?: string[];
  industries?: string[];
  bio?: string;
}

export interface FounderProfile extends BaseProfile {
  hasStartup?: boolean;
  hasIdea?: boolean;
  startupDetails?: {
    name: string;
    stage: string;
    description?: string;
    industry?: string;
    teamSize?: number;
    fundingStage?: string;
    monthlyRevenue?: number;
    customersCount?: number;
  };
  ideaDetails?: {
    title: string;
    description: string;
    targetMarket?: string;
    problemSolved?: string;
    uniqueValue?: string;
  };
}

export interface MentorProfile extends BaseProfile {
  mentorshipAreas?: string[];
  availabilityHours?: number;
  maxMentees?: number;
  pricing?: {
    hourlyRate?: number;
    packageRates?: { [key: string]: number };
  };
  credentials?: string[];
  achievements?: string[];
}

export interface InvestorProfile extends BaseProfile {
  investmentStages?: string[];
  investmentSizes?: {
    min: number;
    max: number;
  };
  preferredIndustries?: string[];
  portfolioCompanies?: string[];
  investmentCriteria?: string;
  checkSizes?: number[];
}

export type ProfileData = FounderProfile | MentorProfile | InvestorProfile;

export interface RoleProfile {
  roleId: string;
  roleName: string;
  roleType: UserRole;
  onboardingComplete: boolean;
  profileData: ProfileData;
  entrepreneurialStage: EntrepreneurialStage;
  isActive?: boolean;
  createdAt: string;
  lastUsed: string;
}

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  roles: RoleProfile[];
  activeRoleId: string;
  preferences?: UserPreferences;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy?: {
    profileVisibility: 'public' | 'private' | 'connections';
    showEmail: boolean;
    showPhone: boolean;
  };
}

// ================================
// Application State Types
// ================================

export interface RoleState {
  mainSection: string;
  subSection: string;
  expandedSections?: Record<string, boolean>;
}

export interface ApplicationState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  roleStates: {
    founder: RoleState;
    mentor: RoleState;
    investor: RoleState;
  };
}

// ================================
// API Types
// ================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// ================================
// Component Props Types
// ================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface PageProps extends BaseComponentProps {
  title?: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
}

export interface Breadcrumb {
  label: string;
  href?: string;
  current?: boolean;
}

// ================================
// Form Types
// ================================

export interface FormState<T = any> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// ================================
// Navigation Types
// ================================

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<any>;
  children?: NavigationItem[];
  isExternal?: boolean;
  badge?: string | number;
  roles?: UserRole[];
  permissions?: string[];
}

export interface SidebarConfig {
  items: NavigationItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

// ================================
// Business Logic Types
// ================================

export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  connectionType: 'professional' | 'mentor' | 'investor' | 'partner';
  message?: string;
  createdAt: string;
  updatedAt: string;
  user?: UserProfile;
  connectedUser?: UserProfile;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'job' | 'partnership' | 'investment' | 'mentorship';
  status: 'active' | 'paused' | 'closed';
  requirements: string[];
  benefits: string[];
  location?: string;
  remote: boolean;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  equity?: {
    min: number;
    max: number;
  };
  createdBy: string;
  applicationsCount?: number;
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  applicantId: string;
  status: 'submitted' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  coverLetter?: string;
  resume?: string;
  additionalDocuments?: string[];
  responses?: Record<string, any>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  opportunity?: Opportunity;
  applicant?: UserProfile;
}

// ================================
// Analytics & Metrics Types
// ================================

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: string;
}

export interface MetricData {
  name: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  period: string;
  format?: 'number' | 'percentage' | 'currency';
}

// ================================
// Utility Types
// ================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ================================
// Error Handling Types
// ================================

export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}

export interface ErrorDetails {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
}

// ================================
// Theme & UI Types
// ================================

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor?: string;
  accentColor?: string;
  borderRadius?: number;
  fontSize?: 'small' | 'medium' | 'large';
}

// ================================
// Export all types
// ================================

export type {
  // Re-export for convenience
  UserRole as Role,
  EntrepreneurialStage as Stage,
};
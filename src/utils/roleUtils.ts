export type RoleType = 'founder' | 'mentor' | 'investor' | 'freelancer' | 'service_provider' | 'student' | 'job_seeker';

// Role display configurations
const ROLE_CONFIGS: Record<string, { label: string; displayName: string; badgeColor: string }> = {
  founder: {
    label: 'Founder',
    displayName: 'Tech Entrepreneur',
    badgeColor: 'bg-blue-500'
  },
  mentor: {
    label: 'Mentor', 
    displayName: 'Senior Mentor',
    badgeColor: 'bg-green-500'
  },
  investor: {
    label: 'Investor',
    displayName: 'Angel Investor', 
    badgeColor: 'bg-purple-500'
  },
  freelancer: {
    label: 'Freelancer',
    displayName: 'Freelancer',
    badgeColor: 'bg-orange-500'
  },
  service_provider: {
    label: 'Service Provider',
    displayName: 'Service Provider',
    badgeColor: 'bg-teal-500'
  },
  student: {
    label: 'Student',
    displayName: 'Student',
    badgeColor: 'bg-indigo-500'
  },
  job_seeker: {
    label: 'Job Seeker',
    displayName: 'Job Seeker',
    badgeColor: 'bg-pink-500'
  }
};

export const getRoleTypeLabel = (roleType: string): string => {
  return ROLE_CONFIGS[roleType]?.label || 'Entrepreneur';
};

export const getRoleDisplayName = (roleType: string): string => {
  return ROLE_CONFIGS[roleType]?.displayName || 'Entrepreneur';
};

export const getRoleBadgeColor = (roleType: string): string => {
  return ROLE_CONFIGS[roleType]?.badgeColor || 'bg-gray-500';
};

export const isValidRoleType = (role: string): role is RoleType => {
  return Object.keys(ROLE_CONFIGS).includes(role);
};

export const getUserInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName?.[0]?.toUpperCase() || '';
  const last = lastName?.[0]?.toUpperCase() || '';
  return first + last || 'U';
};

export const formatUserName = (fullName?: string, email?: string): { firstName: string; lastName: string } => {
  if (fullName) {
    const nameParts = fullName.split(' ');
    return {
      firstName: nameParts[0] || 'User',
      lastName: nameParts.slice(1).join(' ') || ''
    };
  }
  
  if (email) {
    const emailParts = email.split('@')[0]?.split('.') || [];
    return {
      firstName: emailParts[0] || 'User',
      lastName: emailParts.slice(1).join(' ') || ''
    };
  }
  
  return { firstName: 'User', lastName: '' };
};
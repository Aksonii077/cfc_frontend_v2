import {
  Lightbulb,
  MessageSquare, 
  Building,
  Zap,
  Rocket,
  Network,
  Search,
  Briefcase,
  Users,
  DollarSign,
  User,
  UserCircle,
  GraduationCap,
  Target,
  Brain
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  title: string;
  icon: any;
  route?: string;
  children?: NavigationItem[];
  isComingSoon?: boolean;
}

export interface NavigationConfig {
  [roleType: string]: NavigationItem[];
}

export const navigationConfig: NavigationConfig = {
  mentor: [
    {
      id: 'application-center',
      title: 'Application Center',
      icon: Building,
      route: '/dashboard/mentor'
    },
    {
      id: 'mentors',
      title: 'Startup Portfolio',
      icon: Rocket,
      route: '/dashboard/startup-portfolio'
    },
    {
      id: 'launch-pad',
      title: 'Launch Pad',
      icon: Lightbulb,
      isComingSoon: true,
      children: [
        { id: 'race-ai', title: 'RACE AI', icon: MessageSquare, route: '/dashboard/race-ai', isComingSoon: true },
        { id: 'workspace', title: 'My Workspace', icon: Building, route: '/dashboard/workspace', isComingSoon: true },
        { id: 'tools', title: 'SaaS Tool', icon: Zap, route: '/dashboard/tools', isComingSoon: true }
      ]
    },
    {
      id: 'growth-hub',
      title: 'Growth Hub',
      icon: Rocket,
      isComingSoon: true,
      children: [
        { id: 'partners', title: 'Partners', icon: Building, route: '/dashboard/partners', isComingSoon: true },
        { id: 'needs-leads', title: 'Needs & Leads', icon: Lightbulb, route: '/dashboard/needs-leads', isComingSoon: true },
        { id: 'connections', title: 'People', icon: Network, route: '/dashboard/connections', isComingSoon: true }
      ]
    },
    {
      id: 'funding',
      title: 'Funding',
      icon: DollarSign,
      route: '/dashboard/funding',
      isComingSoon: true
    },
    {
      id: 'account',
      title: 'My Account',
      icon: User,
      children: [
        { id: 'profile', title: 'My Profile', icon: UserCircle, route: '/dashboard/profile' }
      ]
    }
  ],

  investor: [
    {
      id: 'connections',
      title: 'Investment Hub',
      icon: DollarSign,
      route: '/dashboard/connections'
    },
    {
      id: 'partners',
      title: 'Deal Flow',
      icon: Target,
      route: '/dashboard/partners'
    },
    {
      id: 'needs-leads',
      title: 'Market Research',
      icon: Brain,
      route: '/dashboard/needs-leads'
    },
    {
      id: 'account',
      title: 'My Account',
      icon: User,
      children: [
        { id: 'profile', title: 'My Profile', icon: UserCircle, route: '/dashboard/profile' }
      ]
    }
  ],

  founder: [
    {
      id: 'mentors',
      title: 'Mentors',
      icon: GraduationCap,
      children: [
        { id: 'find-mentor', title: 'Find a Mentor', icon: Search, route: '/dashboard/mentors' },
        { id: 'my-applications', title: 'My Applications', icon: Briefcase, route: '/dashboard/my-applications' },
        { id: 'my-mentors', title: 'My Mentors', icon: Users, route: '/dashboard/my-mentors' }
      ]
    },
    {
      id: 'launch-pad',
      title: 'Launch Pad',
      icon: Lightbulb,
      isComingSoon: true,
      children: [
        { id: 'race-ai', title: 'RACE AI', icon: MessageSquare, route: '/dashboard/race-ai', isComingSoon: true },
        { id: 'workspace', title: 'My Workspace', icon: Building, route: '/dashboard/workspace', isComingSoon: true },
        { id: 'tools', title: 'SaaS Tool', icon: Zap, route: '/dashboard/tools', isComingSoon: true }
      ]
    },
    {
      id: 'growth-hub',
      title: 'Growth Hub',
      icon: Rocket,
      isComingSoon: true,
      children: [
        { id: 'partners', title: 'Partners', icon: Building, route: '/dashboard/partners', isComingSoon: true },
        { id: 'needs-leads', title: 'Needs & Leads', icon: Lightbulb, route: '/dashboard/needs-leads', isComingSoon: true },
        { id: 'connections', title: 'People', icon: Network, route: '/dashboard/connections', isComingSoon: true }
      ]
    },
    {
      id: 'funding',
      title: 'Funding',
      icon: DollarSign,
      route: '/dashboard/funding',
      isComingSoon: true
    },
    {
      id: 'account',
      title: 'My Account',
      icon: User,
      children: [
        { id: 'profile', title: 'My Profile', icon: UserCircle, route: '/dashboard/profile' }
      ]
    }
  ]
};

// Route to section mapping
interface RouteMapping {
  [route: string]: { section: string; item?: string };
}

export const routeMappings: { [roleType: string]: RouteMapping } = {
  mentor: {
    '/dashboard/mentor': { section: 'application-center' },
    '/dashboard/startup-portfolio': { section: 'mentors' },
    '/dashboard/race-ai': { section: 'launch-pad', item: 'race-ai' },
    '/dashboard/workspace': { section: 'launch-pad', item: 'workspace' },
    '/dashboard/tools': { section: 'launch-pad', item: 'tools' },
    '/dashboard/partners': { section: 'growth-hub', item: 'partners' },
    '/dashboard/needs-leads': { section: 'growth-hub', item: 'needs-leads' },
    '/dashboard/connections': { section: 'growth-hub', item: 'connections' },
    '/dashboard/funding': { section: 'funding' },
    '/dashboard/profile': { section: 'account', item: 'profile' },
    '/dashboard/settings': { section: 'account', item: 'settings' }
  },

  investor: {
    '/dashboard/connections': { section: 'connections' },
    '/dashboard/partners': { section: 'partners' },
    '/dashboard/needs-leads': { section: 'needs-leads' },
    '/dashboard/profile': { section: 'account', item: 'profile' },
    '/dashboard/settings': { section: 'account', item: 'settings' }
  },

  founder: {
    '/dashboard/race-ai': { section: 'launch-pad', item: 'race-ai' },
    '/dashboard/workspace': { section: 'launch-pad', item: 'workspace' },
    '/dashboard/tools': { section: 'launch-pad', item: 'tools' },
    '/dashboard/apply-mentorship': { section: 'mentors', item: 'find-mentor' },
    '/dashboard/partners': { section: 'growth-hub', item: 'partners' },
    '/dashboard/needs-leads': { section: 'growth-hub', item: 'needs-leads' },
    '/dashboard/connections': { section: 'growth-hub', item: 'connections' },
    '/dashboard/mentors': { section: 'mentors', item: 'find-mentor' },
    '/dashboard/my-applications': { section: 'mentors', item: 'my-applications' },
    '/dashboard/my-mentors': { section: 'mentors', item: 'my-mentors' },
    '/dashboard/funding': { section: 'funding' },
    '/dashboard/profile': { section: 'account', item: 'profile' },
    '/dashboard/settings': { section: 'account', item: 'settings' }
  }
};

export function getNavigationForRole(roleType: string): NavigationItem[] {
  return navigationConfig[roleType] || navigationConfig.founder;
}

export function getActiveStateFromPath(pathname: string, roleType: string): { section: string; item: string } {
  const mappings = routeMappings[roleType] || routeMappings.founder;
  
  // Try exact match first
  const normalizedPath = pathname.replace(/\/+$/, '');
  const exactMatch = mappings[normalizedPath] || mappings[pathname];
  if (exactMatch) {
    return { section: exactMatch.section, item: exactMatch.item || exactMatch.section };
  }
  
  // Special handling for mentorship application flow
  if (roleType === 'founder' && pathname.startsWith('/dashboard/apply-mentorship')) {
    let storedMentorItem: string | null = null;
    if (typeof window !== 'undefined') {
      try {
        storedMentorItem = sessionStorage.getItem('lastMentorNavItem');
      } catch (error) {
        console.warn('Unable to read mentor tab preference from sessionStorage:', error);
      }
    }
    return { section: 'mentors', item: storedMentorItem || 'find-mentor' };
  }

  // Try partial matches for dashboard routes (check longer routes first)
  const sortedRoutes = Object.entries(mappings).sort(([a], [b]) => b.length - a.length);
  for (const [route, mapping] of sortedRoutes) {
    if (pathname.includes(route)) {
      return { section: mapping.section, item: mapping.item || mapping.section };
    }
  }
  
  // Default fallback based on role
  switch (roleType) {
    case 'mentor':
      return { section: 'application-center', item: 'application-center' };
    case 'investor':
      return { section: 'connections', item: 'connections' };
    default:
      return { section: 'launch-pad', item: 'race-ai' };
  }
}
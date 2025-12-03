/**
 * Google Analytics 4 (GA4) Tracking Service
 * 
 * Centralized analytics tracking for RACE AI platform.
 * Implements event tracking, user properties, and conversion tracking.
 */

// Google Analytics types
interface GtagConfig {
  page_title?: string;
  page_location?: string;
  page_path?: string;
  user_id?: string;
  user_role?: string;
  [key: string]: any;
}

interface GtagEvent {
  [key: string]: any;
}

// Extend window object for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set',
      targetIdOrEventName: string,
      params?: GtagConfig | GtagEvent
    ) => void;
    dataLayer: any[];
  }
}

// Analytics Configuration
const GA_MEASUREMENT_ID = 'G-HE0NKZDYD0'; // RACE AI Production Measurement ID

/**
 * Initialize Google Analytics
 * Call this once when the app loads
 */
export const initializeAnalytics = (): void => {
  // Check if gtag is already loaded
  if (typeof window === 'undefined' || window.gtag) {
    return;
  }

  // Create gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll handle page views manually
  });

  console.log('✅ Google Analytics initialized:', GA_MEASUREMENT_ID);
};

/**
 * Check if analytics is enabled
 */
const isAnalyticsEnabled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// ==================== PAGE TRACKING ====================

/**
 * Track page view
 */
export const trackPageView = (pageTitle: string, pagePath: string, additionalParams?: Record<string, any>): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'page_view', {
    page_title: pageTitle,
    page_location: window.location.href,
    page_path: pagePath,
    ...additionalParams,
  });

  console.log('📄 Page view tracked:', pageTitle, pagePath);
};

// ==================== USER PROPERTIES ====================

/**
 * Set user properties
 */
export const setUserProperties = (properties: Record<string, any>): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('set', 'user_properties', properties);
  console.log('👤 User properties set:', properties);
};

/**
 * Set user ID
 */
export const setUserId = (userId: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    user_id: userId,
  });

  console.log('🔑 User ID set:', userId);
};

// ==================== AUTHENTICATION EVENTS ====================

export const trackAuthIntentLogin = (): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'auth_intent_login', {
    timestamp: new Date().toISOString(),
  });
};

export const trackAuthIntentRegister = (): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'auth_intent_register', {
    timestamp: new Date().toISOString(),
  });
};

export const trackGoogleAuthStart = (authIntent: 'login' | 'register'): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'google_auth_start', {
    auth_intent: authIntent,
  });
};

export const trackGoogleAuthSuccess = (userId: string, authIntent: 'login' | 'register', isNewUser: boolean): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'google_auth_success', {
    user_id: userId,
    auth_intent: authIntent,
    is_new_user: isNewUser,
  });

  // Set user ID
  setUserId(userId);
};

export const trackGoogleAuthError = (errorCode: string, errorMessage: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'google_auth_error', {
    error_code: errorCode,
    error_message: errorMessage,
  });
};

export const trackAuthComplete = (userId: string, method: string, isReturning: boolean): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'auth_complete', {
    user_id: userId,
    method: method,
    is_returning: isReturning,
  });
};

// ==================== LANDING PAGE & AI INTRO EVENTS ====================

export const trackLandingPageView = (referrer: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'landing_page_view', {
    referrer: referrer || 'direct',
  });
};

export const trackAIIntroStart = (sessionId: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'ai_intro_start', {
    session_id: sessionId,
  });
};

export const trackAIIntroComplete = (duration: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'ai_intro_complete', {
    duration: duration,
  });
};

export const trackChatInputFocus = (): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'chat_input_focus', {});
};

export const trackIdeaInputSubmit = (ideaLength: number, hasContent: boolean): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'idea_input_submit', {
    idea_length: ideaLength,
    has_content: hasContent,
  });
};

export const trackRoleSelectionView = (rolesShown: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'role_selection_view', {
    roles_shown: rolesShown,
  });
};

export const trackRoleSelected = (roleType: string, roleLabel: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'role_selected', {
    role_type: roleType,
    role_label: roleLabel,
  });
};

export const trackAuthModalOpen = (triggerSource: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'auth_modal_open', {
    trigger_source: triggerSource,
  });
};

// ==================== ONBOARDING EVENTS ====================

export const trackOnboardingStart = (userId: string, role: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'onboarding_start', {
    user_id: userId,
    role: role,
  });
};

export const trackOnboardingStepView = (stepNumber: number, stepName: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'onboarding_step_view', {
    step_number: stepNumber,
    step_name: stepName,
  });
};

export const trackOnboardingStepComplete = (stepNumber: number, stepName: string, timeSpent: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'onboarding_step_complete', {
    step_number: stepNumber,
    step_name: stepName,
    time_spent: timeSpent,
  });
};

export const trackOnboardingFieldEdit = (fieldName: string, hasValue: boolean): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'onboarding_field_edit', {
    field_name: fieldName,
    has_value: hasValue,
  });
};

export const trackDashboardSectionSelect = (sectionName: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'dashboard_section_select', {
    section_name: sectionName,
  });
};

export const trackOnboardingComplete = (totalTime: number, completedSteps: number, selectedSection: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'onboarding_complete', {
    total_time: totalTime,
    completed_steps: completedSteps,
    selected_section: selectedSection,
  });
};

export const trackOnboardingAbandon = (lastStep: string, timeSpent: number, fieldsCompleted: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'onboarding_abandon', {
    last_step: lastStep,
    time_spent: timeSpent,
    fields_completed: fieldsCompleted,
  });
};

// ==================== DASHBOARD EVENTS ====================

export const trackDashboardLoad = (userId: string, role: string, initialSection: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'dashboard_load', {
    user_id: userId,
    role: role,
    initial_section: initialSection,
  });
};

export const trackNavTabSwitch = (fromTab: string, toTab: string, userRole: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'nav_tab_switch', {
    from_tab: fromTab,
    to_tab: toTab,
    user_role: userRole,
  });
};

export const trackSectionView = (sectionName: string, userRole: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'section_view', {
    section_name: sectionName,
    user_role: userRole,
  });
};

export const trackSpotlightModeChange = (mode: string, context: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'spotlight_mode_change', {
    mode: mode,
    context: context,
  });
};

// ==================== AI CHAT EVENTS ====================

export const trackChatMessageSent = (messageLength: number, chatContext: string, userRole: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'chat_message_sent', {
    message_length: messageLength,
    chat_context: chatContext,
    user_role: userRole,
  });
};

export const trackChatResponseReceived = (responseTime: number, responseLength: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'chat_response_received', {
    response_time: responseTime,
    response_length: responseLength,
  });
};

export const trackActionChipClick = (actionType: string, actionLabel: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'action_chip_click', {
    action_type: actionType,
    action_label: actionLabel,
  });
};

export const trackChatFeedback = (rating: string, messageId: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'chat_feedback', {
    rating: rating,
    message_id: messageId,
  });
};

// ==================== WORKSPACE & IDEAS EVENTS ====================

export const trackIdeaCreate = (userId: string, ideaStage: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'idea_create', {
    user_id: userId,
    idea_stage: ideaStage,
  });
};

export const trackIdeaEdit = (ideaId: string, fieldChanged: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'idea_edit', {
    idea_id: ideaId,
    field_changed: fieldChanged,
  });
};

export const trackIdeaStageChange = (ideaId: string, fromStage: string, toStage: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'idea_stage_change', {
    idea_id: ideaId,
    from_stage: fromStage,
    to_stage: toStage,
  });
};

export const trackCompanyCreate = (userId: string, companyName: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'company_create', {
    user_id: userId,
    company_name: companyName,
  });
};

export const trackCompanyEdit = (companyId: string, sectionEdited: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'company_edit', {
    company_id: companyId,
    section_edited: sectionEdited,
  });
};

export const trackFundingDetailsAdd = (fundingStage: string, amount: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'funding_details_add', {
    funding_stage: fundingStage,
    amount: amount,
  });
};

// ==================== MENTOR FLOW EVENTS ====================

export const trackMentorDashboardLoad = (mentorId: string, activeApplications: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'mentor_dashboard_load', {
    mentor_id: mentorId,
    active_applications: activeApplications,
  });
};

export const trackApplicationView = (applicationId: string, startupName: string, aiScore: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'application_view', {
    application_id: applicationId,
    startup_name: startupName,
    ai_score: aiScore,
  });
};

export const trackApplicationTabSwitch = (applicationId: string, tabName: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'application_tab_switch', {
    application_id: applicationId,
    tab_name: tabName,
  });
};

export const trackScheduleInterviewClick = (applicationId: string, currentStatus: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'schedule_interview_click', {
    application_id: applicationId,
    current_status: currentStatus,
  });
};

export const trackInterviewScheduled = (applicationId: string, interviewDate: string, calendarProvider: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'interview_scheduled', {
    application_id: applicationId,
    interview_date: interviewDate,
    calendar_provider: calendarProvider,
  });
};

export const trackApplicationAccept = (applicationId: string, aiScore: number, timeToDecision: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'application_accept', {
    application_id: applicationId,
    ai_score: aiScore,
    time_to_decision: timeToDecision,
  });
};

export const trackApplicationReject = (applicationId: string, reason: string, timeToDecision: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'application_reject', {
    application_id: applicationId,
    reason: reason,
    time_to_decision: timeToDecision,
  });
};

// ==================== AGREEMENT EVENTS ====================

export const trackAgreementStart = (applicationId: string, mentorId: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'agreement_start', {
    application_id: applicationId,
    mentor_id: mentorId,
  });
};

export const trackAgreementTermsSubmit = (tenure: string, equity: string, timeCommitment: string, version: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'agreement_terms_submit', {
    tenure: tenure,
    equity: equity,
    time_commitment: timeCommitment,
    version: version,
  });
};

export const trackAgreementTermsView = (version: number, submittedBy: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'agreement_terms_view', {
    version: version,
    submitted_by: submittedBy,
  });
};

export const trackAgreementAccept = (applicationId: string, version: number, negotiationRounds: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'agreement_accept', {
    application_id: applicationId,
    version: version,
    negotiation_rounds: negotiationRounds,
  });
};

export const trackAgreementCounter = (version: number, fieldsChanged: string[]): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'agreement_counter', {
    version: version,
    fields_changed: fieldsChanged.join(','),
  });
};

// ==================== PORTFOLIO EVENTS ====================

export const trackPortfolioView = (mentorId: string, portfolioSize: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'portfolio_view', {
    mentor_id: mentorId,
    portfolio_size: portfolioSize,
  });
};

export const trackStartupWorkspaceOpen = (startupId: string, healthScore: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'startup_workspace_open', {
    startup_id: startupId,
    health_score: healthScore,
  });
};

export const trackKPIUpdate = (startupId: string, metricName: string, value: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'kpi_update', {
    startup_id: startupId,
    metric_name: metricName,
    value: value,
  });
};

export const trackMonthlyUpdateSubmit = (startupId: string, month: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'monthly_update_submit', {
    startup_id: startupId,
    month: month,
  });
};

export const trackDocumentUpload = (startupId: string, docType: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'document_upload', {
    startup_id: startupId,
    doc_type: docType,
  });
};

// ==================== PROFILE & CONNECTIONS EVENTS ====================

export const trackProfileView = (viewedUserId: string, viewerRole: string, viewedRole: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'profile_view', {
    viewed_user_id: viewedUserId,
    viewer_role: viewerRole,
    viewed_role: viewedRole,
  });
};

export const trackProfileEdit = (userId: string, sectionEdited: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'profile_edit', {
    user_id: userId,
    section_edited: sectionEdited,
  });
};

export const trackConnectRequestSend = (targetUserId: string, targetRole: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'connect_request_send', {
    target_user_id: targetUserId,
    target_role: targetRole,
  });
};

// ==================== ERROR TRACKING ====================

export const trackErrorAuth = (errorType: string, errorMessage: string, userAction: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'error_auth', {
    error_type: errorType,
    error_message: errorMessage,
    user_action: userAction,
  });
};

export const trackErrorAPI = (endpoint: string, statusCode: number, errorMessage: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'error_api', {
    endpoint: endpoint,
    status_code: statusCode,
    error_message: errorMessage,
  });
};

export const trackErrorFormValidation = (formName: string, fieldName: string, validationError: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'error_form_validation', {
    form_name: formName,
    field_name: fieldName,
    validation_error: validationError,
  });
};

export const trackErrorNetwork = (requestType: string, errorMessage: string): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'error_network', {
    request_type: requestType,
    error_message: errorMessage,
  });
};

// ==================== PERFORMANCE TRACKING ====================

export const trackPageLoadTime = (pageName: string, loadDuration: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'page_load_time', {
    page_name: pageName,
    load_duration: loadDuration,
  });
};

export const trackAPIResponseTime = (endpoint: string, duration: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'api_response_time', {
    endpoint: endpoint,
    duration: duration,
  });
};

export const trackChatResponseTime = (duration: number, messageLength: number): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', 'chat_response_time', {
    duration: duration,
    message_length: messageLength,
  });
};

// ==================== GENERIC EVENT TRACKING ====================

/**
 * Generic event tracking for custom events
 */
export const trackEvent = (eventName: string, parameters?: GtagEvent): void => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('event', eventName, parameters || {});
  console.log('📊 Event tracked:', eventName, parameters);
};

// ==================== PERFORMANCE MONITORING ====================

export const initializePerformanceMonitoring = (): void => {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  measureWebVitals();
  
  // Custom performance metrics
  measureLoadTime();
  measureRouteChanges();
  
  // Error tracking
  setupErrorTracking();
};

const measureWebVitals = (): void => {
  // Largest Contentful Paint (LCP)
  observePerformanceEntry('largest-contentful-paint', (entry) => {
    const lcp = entry.startTime;
    trackEvent('performance_lcp', {
      value: lcp,
      rating: lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor'
    });
  });

  // First Input Delay (FID)
  observePerformanceEntry('first-input', (entry) => {
    const fid = entry.processingStart - entry.startTime;
    trackEvent('performance_fid', {
      value: fid,
      rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor'
    });
  });

  // Cumulative Layout Shift (CLS)
  observePerformanceEntry('layout-shift', (entry) => {
    if (!entry.hadRecentInput) {
      const cls = entry.value;
      trackEvent('performance_cls', {
        value: cls,
        rating: cls <= 0.1 ? 'good' : cls <= 0.25 ? 'needs-improvement' : 'poor'
      });
    }
  });
};

const measureLoadTime = (): void => {
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    trackEvent('performance_load_time', {
      value: loadTime,
      rating: loadTime <= 1000 ? 'good' : loadTime <= 3000 ? 'needs-improvement' : 'poor'
    });
  });
};

const measureRouteChanges = (): void => {
  let routeChangeStart = 0;
  
  // Monitor route changes for SPA
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    routeChangeStart = performance.now();
    return originalPushState.apply(history, args);
  };

  window.addEventListener('popstate', () => {
    if (routeChangeStart > 0) {
      const routeChangeTime = performance.now() - routeChangeStart;
      trackEvent('performance_route_change', {
        value: routeChangeTime,
        rating: routeChangeTime <= 200 ? 'good' : routeChangeTime <= 500 ? 'needs-improvement' : 'poor'
      });
    }
  });
};

const observePerformanceEntry = (type: string, callback: (entry: any) => void): void => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        callback(entry);
      }
    });
    observer.observe({ type, buffered: true });
  }
};

// Error tracking
const setupErrorTracking = (): void => {
  // Global error handler
  window.addEventListener('error', (event) => {
    trackEvent('error_js', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    trackEvent('error_promise', {
      message: `Unhandled Promise: ${event.reason}`,
      stack: event.reason?.stack
    });
  });
};

// ==================== EXPORTS ====================

export default {
  initializeAnalytics,
  initializePerformanceMonitoring,
  trackPageView,
  setUserProperties,
  setUserId,
  trackEvent,
};

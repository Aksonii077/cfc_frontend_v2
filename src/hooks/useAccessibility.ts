import { useEffect, useState, useCallback } from 'react';

// Hook for keyboard navigation
export const useKeyboardNavigation = () => {
  const [isTabbing, setIsTabbing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsTabbing(true);
      }
    };

    const handleMouseDown = () => {
      setIsTabbing(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return { isTabbing };
};

// Hook for focus management
export const useFocusTrap = (isActive: boolean) => {
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  const [firstElement, setFirstElement] = useState<HTMLElement | null>(null);
  const [lastElement, setLastElement] = useState<HTMLElement | null>(null);

  const updateFocusableElements = useCallback((container: HTMLElement) => {
    const elements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const focusableElements = Array.from(elements).filter(
      element => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden')
    );

    setFocusableElements(focusableElements);
    setFirstElement(focusableElements[0] || null);
    setLastElement(focusableElements[focusableElements.length - 1] || null);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive || event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }, [isActive, firstElement, lastElement]);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      firstElement?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, handleKeyDown, firstElement]);

  return { updateFocusableElements, focusableElements };
};

// Hook for screen reader announcements
export const useScreenReader = () => {
  const [announcement, setAnnouncement] = useState('');

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement(''); // Clear first to ensure re-announcement
    setTimeout(() => setAnnouncement(message), 10);
    
    // Clear after announcement
    setTimeout(() => setAnnouncement(''), 1000);
  }, []);

  return { announcement, announce };
};

// Hook for reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Hook for high contrast preference
export const useHighContrast = () => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = () => setPrefersHighContrast(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
};

// Hook for managing ARIA live regions
export const useAriaLive = () => {
  const [liveMessage, setLiveMessage] = useState('');
  const [liveRegion, setLiveRegion] = useState<'polite' | 'assertive'>('polite');

  const announceToScreenReader = useCallback((
    message: string, 
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    setLiveRegion(priority);
    setLiveMessage(''); // Clear first
    
    // Use timeout to ensure the message is announced
    setTimeout(() => {
      setLiveMessage(message);
    }, 10);
    
    // Clear after a delay
    setTimeout(() => {
      setLiveMessage('');
    }, 1000);
  }, []);

  return {
    liveMessage,
    liveRegion,
    announceToScreenReader
  };
};
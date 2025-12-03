import { useState, useCallback, useEffect } from 'react';
import { ideaValidationService, ValidationResult, TaskForRegistration } from '../utils/ideaValidationService';

export interface UserIdea {
  title: string;
  description: string;
}

export interface UseOnboardingOptions {
  userId?: string;
  onIdeaValidated?: (result: ValidationResult) => void;
  onTasksGenerated?: (tasks: TaskForRegistration[]) => void;
  autoValidate?: boolean;
}

export interface UseOnboardingReturn {
  userIdea: UserIdea | null;
  validationResult: ValidationResult | null;
  registrationTasks: TaskForRegistration[];
  isValidating: boolean;
  isLoadingTasks: boolean;
  hasAutoValidated: boolean;
  loadOnboardingIdea: () => Promise<void>;
  validateIdea: (idea?: UserIdea) => Promise<void>;
  updateTaskStatus: (taskId: string, completed: boolean) => Promise<void>;
  saveIdeaToWorkspace: (idea: UserIdea) => Promise<void>;
  clearOnboardingData: () => void;
}

export function useOnboarding(options: UseOnboardingOptions = {}): UseOnboardingReturn {
  const { 
    userId, 
    onIdeaValidated, 
    onTasksGenerated, 
    autoValidate = true 
  } = options;

  // State
  const [userIdea, setUserIdea] = useState<UserIdea | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [registrationTasks, setRegistrationTasks] = useState<TaskForRegistration[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [hasAutoValidated, setHasAutoValidated] = useState(false);

  // Load onboarding data from localStorage
  const loadOnboardingIdea = useCallback(async () => {
    if (!userId) return;

    try {
      const onboardingData = localStorage.getItem(`onboarding_data_${userId}`);
      if (!onboardingData) return;

      const data = JSON.parse(onboardingData);
      if (data.path === 'idea' && data.ideaTitle && data.ideaDescription) {
        const ideaInfo: UserIdea = {
          title: data.ideaTitle,
          description: data.ideaDescription
        };
        
        setUserIdea(ideaInfo);
        
        // Auto-save to workspace if not already saved
        await saveIdeaToWorkspace(ideaInfo);
        
        // Trigger automatic validation if enabled and not already done
        if (autoValidate && !hasAutoValidated) {
          setHasAutoValidated(true);
          setTimeout(() => {
            validateIdea(ideaInfo);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
      throw new Error('Failed to load onboarding data');
    }
  }, [userId, autoValidate, hasAutoValidated]);

  // Save idea to workspace
  const saveIdeaToWorkspace = useCallback(async (ideaInfo: UserIdea) => {
    if (!userId) return;

    try {
      const savedIdeas = await ideaValidationService.getSavedIdeas(userId);
      const existingIdea = savedIdeas.find(idea => idea.title === ideaInfo.title);
      
      if (!existingIdea) {
        await ideaValidationService.saveIdeaToWorkspace({
          title: ideaInfo.title,
          description: ideaInfo.description,
          userId: userId
        });
        console.log('Idea auto-saved to workspace');
      }
    } catch (error) {
      console.error('Error auto-saving idea:', error);
      throw new Error('Failed to save idea to workspace');
    }
  }, [userId]);

  // Validate idea
  const validateIdea = useCallback(async (ideaToValidate?: UserIdea) => {
    const ideaForValidation = ideaToValidate || userIdea;
    if (!ideaForValidation || !userId) return;

    setIsValidating(true);
    
    try {
      const result = await ideaValidationService.validateIdea({
        title: ideaForValidation.title,
        description: ideaForValidation.description,
        userId: userId
      });
      
      setValidationResult(result);
      onIdeaValidated?.(result);
      
      // Generate registration tasks after validation
      setIsLoadingTasks(true);
      setTimeout(async () => {
        try {
          const tasks = await ideaValidationService.getRegistrationTasks(ideaForValidation.title);
          setRegistrationTasks(tasks);
          onTasksGenerated?.(tasks);
        } catch (error) {
          console.error('Error generating tasks:', error);
          throw new Error('Failed to generate registration tasks');
        } finally {
          setIsLoadingTasks(false);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error validating idea:', error);
      throw new Error('Failed to validate idea');
    } finally {
      setIsValidating(false);
    }
  }, [userIdea, userId, onIdeaValidated, onTasksGenerated]);

  // Update task status
  const updateTaskStatus = useCallback(async (taskId: string, completed: boolean) => {
    try {
      await ideaValidationService.updateTaskStatus(taskId, completed);
      
      setRegistrationTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed } : task
        )
      );
      
      // Check if all tasks are completed
      if (completed) {
        const completedTasks = registrationTasks.filter(t => t.completed).length + 1;
        if (completedTasks === registrationTasks.length) {
          console.log('🎉 All registration tasks completed!');
        }
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      throw new Error('Failed to update task status');
    }
  }, [registrationTasks]);

  // Clear onboarding data
  const clearOnboardingData = useCallback(() => {
    if (userId) {
      localStorage.removeItem(`onboarding_data_${userId}`);
    }
    setUserIdea(null);
    setValidationResult(null);
    setRegistrationTasks([]);
    setHasAutoValidated(false);
  }, [userId]);

  // Load onboarding data on mount or when userId changes
  useEffect(() => {
    if (userId) {
      loadOnboardingIdea().catch(error => {
        console.error('Failed to load onboarding data:', error);
      });
    }
  }, [userId, loadOnboardingIdea]);

  return {
    userIdea,
    validationResult,
    registrationTasks,
    isValidating,
    isLoadingTasks,
    hasAutoValidated,
    loadOnboardingIdea,
    validateIdea,
    updateTaskStatus,
    saveIdeaToWorkspace,
    clearOnboardingData
  };
}
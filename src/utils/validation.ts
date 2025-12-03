// Runtime validation utilities for API responses and data

export interface ValidationSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    required?: boolean;
    validator?: (value: any) => boolean;
    properties?: ValidationSchema;
    items?: ValidationSchema[string];
  };
}

export class ValidationError extends Error {
  constructor(message: string, public path: string, public value: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateData(data: any, schema: ValidationSchema, path = ''): void {
  for (const [key, rules] of Object.entries(schema)) {
    const currentPath = path ? `${path}.${key}` : key;
    const value = data?.[key];

    // Check required fields
    if (rules.required && (value === undefined || value === null)) {
      throw new ValidationError(`Required field missing`, currentPath, value);
    }

    // Skip validation if value is undefined/null and not required
    if (value === undefined || value === null) {
      continue;
    }

    // Type validation
    switch (rules.type) {
      case 'string':
        if (typeof value !== 'string') {
          throw new ValidationError(`Expected string, got ${typeof value}`, currentPath, value);
        }
        break;
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          throw new ValidationError(`Expected number, got ${typeof value}`, currentPath, value);
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new ValidationError(`Expected boolean, got ${typeof value}`, currentPath, value);
        }
        break;
      case 'array':
        if (!Array.isArray(value)) {
          throw new ValidationError(`Expected array, got ${typeof value}`, currentPath, value);
        }
        // Validate array items if schema provided
        if (rules.items) {
          value.forEach((item, index) => {
            try {
              validateData(item, { item: rules.items! }, `${currentPath}[${index}]`);
            } catch (error) {
              if (error instanceof ValidationError) {
                throw new ValidationError(error.message, `${currentPath}[${index}].${error.path}`, error.value);
              }
              throw error;
            }
          });
        }
        break;
      case 'object':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          throw new ValidationError(`Expected object, got ${typeof value}`, currentPath, value);
        }
        // Validate nested properties if schema provided
        if (rules.properties) {
          validateData(value, rules.properties, currentPath);
        }
        break;
    }

    // Custom validator
    if (rules.validator && !rules.validator(value)) {
      throw new ValidationError(`Custom validation failed`, currentPath, value);
    }
  }
}

// Predefined schemas for common API responses
export const PersonDataSchema: ValidationSchema = {
  name: { type: 'string', required: true },
  title: { type: 'string', required: true },
  company: { type: 'string', required: true },
  email: { 
    type: 'string', 
    required: true,
    validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  },
  linkedin_url: { 
    type: 'string', 
    required: true,
    validator: (value: string) => value.startsWith('http')
  },
  relevance: { type: 'string', required: true },
  tags: { 
    type: 'array', 
    required: true,
    items: { type: 'string' }
  }
};

export const NextStepSuggestionSchema: ValidationSchema = {
  id: { type: 'number', required: true },
  title: { type: 'string', required: true },
  reason: { type: 'string', required: true },
  description: { type: 'string', required: true },
  priority: { 
    type: 'string', 
    required: true,
    validator: (value: string) => ['high', 'medium', 'low'].includes(value)
  },
  estimated_time: { type: 'string', required: true }
};

export const AskResponseSchema: ValidationSchema = {
  response: { type: 'string', required: false },  // Either response or answer should be present
  answer: { type: 'string', required: false },    // Either response or answer should be present
  session_id: { type: 'string', required: true },
  message_id: { type: 'string' },
  timestamp: { type: 'string' },
  people: { 
    type: 'array',
    items: { type: 'object', properties: PersonDataSchema }
  },
  next_step_suggestion: { 
    type: 'array',
    items: { type: 'object', properties: NextStepSuggestionSchema }
  }
};

// Utility functions for safe type checking
export function isPersonData(data: any): data is import('../utils/chatService').PersonData {
  try {
    validateData(data, PersonDataSchema);
    return true;
  } catch {
    return false;
  }
}

export function isNextStepSuggestion(data: any): data is import('../utils/chatService').NextStepSuggestion {
  try {
    validateData(data, NextStepSuggestionSchema);
    return true;
  } catch {
    return false;
  }
}

export function isValidAskResponse(data: any): data is import('../utils/chatService').AskResponse {
  try {
    validateData(data, AskResponseSchema);
    return true;
  } catch {
    return false;
  }
}

// Safe array validation
export function validatePersonArray(data: any[]): import('../utils/chatService').PersonData[] {
  return data.filter(isPersonData);
}

export function validateNextStepArray(data: any[]): import('../utils/chatService').NextStepSuggestion[] {
  return data.filter(isNextStepSuggestion);
}
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tremor Raw cx [v0.0.0]
export function cx(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

// Tremor focusInput [v0.0.2]
export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-200 dark:focus:ring-blue-700/30",
  // border color
  "focus:border-blue-500 dark:focus:border-blue-700",
];

// Tremor Raw focusRing [v0.0.1]
export const focusRing = [
  // outline
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:focus:outline-blue-500",
];

// Tremor Raw hasErrorInput [v0.0.1]
export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
];

// Enhanced error handling with better classification
export const handleError = (error: unknown): never => {
  let errorMessage = "An unexpected error occurred";
  let errorType = "UNKNOWN_ERROR";
  let statusCode = 500;

  if (error instanceof Error) {
    // Handle standard JavaScript errors
    errorMessage = error.message;
    
    // Classify common error types
    if (error.message.includes("Unauthorized") || error.message.includes("not authenticated")) {
      errorType = "AUTHENTICATION_ERROR";
      statusCode = 401;
    } else if (error.message.includes("not found")) {
      errorType = "NOT_FOUND_ERROR";
      statusCode = 404;
    } else if (error.message.includes("Validation failed") || error.message.includes("Validation error")) {
      errorType = "VALIDATION_ERROR";
      statusCode = 400;
    } else if (error.message.includes("Invalid") || error.message.includes("Invalid format")) {
      errorType = "INVALID_INPUT_ERROR";
      statusCode = 400;
    } else if (error.message.includes("duplicate") || error.message.includes("already exists")) {
      errorType = "DUPLICATE_ERROR";
      statusCode = 409;
    } else if (error.message.includes("permission") || error.message.includes("unauthorized")) {
      errorType = "PERMISSION_ERROR";
      statusCode = 403;
    }
  } else if (typeof error === "string") {
    // Handle string error messages
    errorMessage = error;
    
    // Classify string-based errors
    if (error.toLowerCase().includes("unauthorized")) {
      errorType = "AUTHENTICATION_ERROR";
      statusCode = 401;
    } else if (error.toLowerCase().includes("not found")) {
      errorType = "NOT_FOUND_ERROR";
      statusCode = 404;
    } else if (error.toLowerCase().includes("validation")) {
      errorType = "VALIDATION_ERROR";
      statusCode = 400;
    }
  } else if (typeof error === "object" && error !== null) {
    // Handle object-based errors
    if ('code' in error && typeof error.code === 'number') {
      statusCode = error.code;
    }
    
    if ('type' in error && typeof error.type === 'string') {
      errorType = error.type;
    }
    
    errorMessage = JSON.stringify(error);
  }

  // Log error with context
  console.error("Error Details:", {
    type: errorType,
    message: errorMessage,
    statusCode,
    timestamp: new Date().toISOString(),
    stack: error instanceof Error ? error.stack : undefined,
  });

  // Create enhanced error object
  const enhancedError = new Error(errorMessage);
  Object.assign(enhancedError, {
    type: errorType,
    statusCode: statusCode,
    originalError: error,
  });

  throw enhancedError;
};

// Specific error handlers for different scenarios
export const handleValidationError = (error: unknown): never => {
  if (error instanceof Error && error.message.includes("Validation failed")) {
    throw error;
  }
  
  throw new Error("Validation failed");
};

export const handleAuthenticationError = (error: unknown): never => {
  if (error instanceof Error && error.message.includes("Unauthorized")) {
    throw error;
  }
  
  throw new Error("Unauthorized: User not authenticated");
};

export const handleNotFoundError = (error: unknown): never => {
  if (error instanceof Error && error.message.includes("not found")) {
    throw error;
  }
  
  throw new Error("Resource not found");
};

// Utility function to check if error is of a specific type
export const isErrorType = (error: unknown, type: string): boolean => {
  if (error instanceof Error) {
    return (error as { type?: string }).type === type;
  }
  return false;
};

// Utility function to get error status code
export const getErrorStatusCode = (error: unknown): number => {
  if (error instanceof Error && (error as { statusCode?: number }).statusCode) {
    return (error as { statusCode?: number }).statusCode as number;
  }
  return 500;
};

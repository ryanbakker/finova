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
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
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

export const handleError = (error: unknown) => {
  let errorMessage = "An unexpected error occurred";
  if (error instanceof Error) {
    // Handle standard JavaScript errors
    errorMessage = error.message;
  } else if (typeof error === "string") {
    // Handle string error messages
    errorMessage = error;
  } else if (typeof error === "object" && error !== null) {
    // Handle object-based errors
    errorMessage = JSON.stringify(error);

    console.error("Error:", errorMessage);
    throw new Error(errorMessage);
  }
};

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

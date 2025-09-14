"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { ReactNode } from "react";

interface ThemeAwareClerkProviderProps {
  children: ReactNode;
  publishableKey: string;
  signInUrl: string;
  signUpUrl: string;
  afterSignInUrl: string;
  afterSignUpUrl: string;
}

export function ThemeAwareClerkProvider({
  children,
  publishableKey,
  signInUrl,
  signUpUrl,
  afterSignInUrl,
  afterSignUpUrl,
}: ThemeAwareClerkProviderProps) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      afterSignInUrl={afterSignInUrl}
      afterSignUpUrl={afterSignUpUrl}
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}

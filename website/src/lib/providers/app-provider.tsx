"use client";

import { QueryProvider } from "./query-provider";
import { AmplifyProvider } from "./amplify-provider";

interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <AmplifyProvider>
      <QueryProvider>{children}</QueryProvider>
    </AmplifyProvider>
  );
}

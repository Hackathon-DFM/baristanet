"use client"

import type * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

/**
 * Theme provider component for managing application theme
 * Uses next-themes to handle theme switching and persistence
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps): React.ReactElement {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

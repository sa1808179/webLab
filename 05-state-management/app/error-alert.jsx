"use client"

import { createContext, useContext } from "react"

// Create a context for alerts
export const AlertContext = createContext()

// Simplified provider that only shows alerts for errors
export function AlertProvider({ children }) {
  const showAlert = (message, type = "info") => {
    // Only show alert for error types
    if (type === "error") {
      alert(message)
    }
    return Date.now() // Return a unique ID for consistency with the original API
  }

  const hideAlert = () => {
    // No need to do anything for browser alerts
  }

  return <AlertContext.Provider value={{ showAlert, hideAlert }}>{children}</AlertContext.Provider>
}

// Export a hook to use the alert context
export const useAlert = () => useContext(AlertContext)

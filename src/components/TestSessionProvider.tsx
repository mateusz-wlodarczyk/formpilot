"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface TestUser {
  id: string;
  email: string;
  name: string;
}

interface TestSessionContextType {
  testUser: TestUser | null;
  isTestMode: boolean;
  loginTestUser: () => void;
  logoutTestUser: () => void;
  generateTestData: () => Promise<void>;
  clearTestData: () => Promise<void>;
  isLoading: boolean;
}

const TestSessionContext = createContext<TestSessionContextType | undefined>(
  undefined
);

export function TestSessionProvider({ children }: { children: ReactNode }) {
  const [testUser, setTestUser] = useState<TestUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isTestMode = !!testUser;

  const loginTestUser = () => {
    const testUserData: TestUser = {
      id: "test_user_123",
      email: "test@formpilot.com",
      name: "Test User",
    };
    setTestUser(testUserData);
    localStorage.setItem("testUser", JSON.stringify(testUserData));
  };

  const logoutTestUser = () => {
    setTestUser(null);
    localStorage.removeItem("testUser");
  };

  const generateTestData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/test-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "generate" }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate test data");
      }

      const result = await response.json();
    } catch (error) {
      console.error("Error generating test data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTestData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/test-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "clear" }),
      });

      if (!response.ok) {
        throw new Error("Failed to clear test data");
      }

      const result = await response.json();
    } catch (error) {
      console.error("Error clearing test data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    testUser,
    isTestMode,
    loginTestUser,
    logoutTestUser,
    generateTestData,
    clearTestData,
    isLoading,
  };

  return (
    <TestSessionContext.Provider value={value}>
      {children}
    </TestSessionContext.Provider>
  );
}

export function useTestSession() {
  const context = useContext(TestSessionContext);
  if (context === undefined) {
    throw new Error("useTestSession must be used within a TestSessionProvider");
  }
  return context;
}

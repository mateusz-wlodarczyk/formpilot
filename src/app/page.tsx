"use client";

import { useTestSession } from "@/components/TestSessionProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const {
    isTestMode,
    loginTestUser,
    generateTestData,
    isLoading,
    logoutTestUser,
  } = useTestSession();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTestMode = async () => {
    if (!isTestMode) {
      loginTestUser();
      setIsGenerating(true);
      await generateTestData();
      setIsGenerating(false);
    }
    router.push("/dashboard");
  };

  const handleRealAuth = () => {
    if (isTestMode) {
      logoutTestUser();
    }
    router.push("/auth/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FormPilot</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Create beautiful forms, collect responses, and analyze your data
            with powerful insights
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleTestMode}
            disabled={isLoading || isGenerating}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isGenerating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isGenerating ? "Generating Demo Data..." : "Loading..."}
              </div>
            ) : (
              "Try Demo Mode"
            )}
          </button>

          <button
            onClick={handleRealAuth}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Sign In with Google or GitHub
          </button>
        </div>

        {isTestMode && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Demo Mode Active:</strong> You&apos;re using the test
              environment with sample data.
            </p>
          </div>
        )}

        <span className="text-blue-600 font-bold">It&apos;s free!</span>
      </div>
    </div>
  );
}

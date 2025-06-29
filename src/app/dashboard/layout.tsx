"use client";

import { useTestSession } from "@/components/TestSessionProvider";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useCallback, useMemo } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { testUser, isTestMode, logoutTestUser } = useTestSession();
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = useCallback(() => {
    if (isTestMode) {
      logoutTestUser();
    } else {
      signOut({ callbackUrl: "/" });
    }
    router.push("/");
  }, [isTestMode, logoutTestUser, router]);

  const currentUser = useMemo(() => {
    return isTestMode ? testUser : session?.user;
  }, [isTestMode, testUser, session?.user]);

  // Handle redirect on client side only
  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (!isTestMode && !session) {
      router.push("/");
    }
  }, [isTestMode, session, status, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isTestMode && !session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                FormPilot Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    {currentUser.name || currentUser.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

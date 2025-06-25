import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import SignInButton from "./SignInButton";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Zaloguj się do FormPilot
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Platforma do tworzenia formularzy i analityki
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <SignInButton />
        </div>
      </div>
    </div>
  );
}

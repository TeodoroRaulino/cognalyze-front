"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">Cognalyze</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-gray-900"
              onClick={() => router.push("/dashboard")}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-gray-900"
              onClick={() => router.push("/dashboard/docs")}
            >
              Documentação
            </Button>
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-gray-900"
              onClick={handleSignOut}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">{children}</div>
    </div>
  );
}

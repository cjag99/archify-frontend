"use client";
// Root landing page for the public application
﻿import { useAuth } from "@/core/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HeroSection } from "@/components/organisms/HeroSection";
import { StepSection } from "@/components/organisms/StepSection";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="app-shell">
      <HeroSection />
      <StepSection />
    </div>
  );
}


// Root landing page for the public application
﻿import { HeroSection } from "@/components/organisms/HeroSection";
import { StepSection } from "@/components/organisms/StepSection";


export default function Home() {
  return (
    <div className="app-shell">
      <HeroSection />
      <StepSection />
    </div>
  );
}


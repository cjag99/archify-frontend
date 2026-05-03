import { HeroSection } from "@/components/organisms/HeroSection";
import { StepSection } from "@/components/organisms/StepSection";


export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <HeroSection />
      <StepSection />
    </div>
  );
}

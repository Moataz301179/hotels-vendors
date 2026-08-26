import { HeroSection } from './components/HeroSection';
import { SolutionsSection } from './components/SolutionsSection';
import { StatsSection } from './components/StatsSection';
import { CTASection } from './components/CTASection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <SolutionsSection />
      <StatsSection />
      <CTASection />
    </main>
  );
}

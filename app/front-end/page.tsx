import { HeroSection } from "./components/sections/hero";
import { RealitySection } from "./components/sections/reality";
import { StepsSection } from "./components/sections/steps";
import { PlatformSection } from "./components/sections/platform";
import { FeaturesSection } from "./components/sections/features";
import { ForHotelsSection } from "./components/sections/for-hotels";
import { ForSuppliersSection } from "./components/sections/for-suppliers";
import { Footer } from "./components/sections/footer";

function Divider() {
  return <div className="w-28 h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#8cff2e] to-transparent" />;
}

export default function FrontEndPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <Divider />
      <RealitySection />
      <Divider />
      <StepsSection />
      <Divider />
      <PlatformSection />
      <Divider />
      <FeaturesSection />
      <Divider />
      <ForHotelsSection />
      <Divider />
      <ForSuppliersSection />
      <Footer />
    </main>
  );
}

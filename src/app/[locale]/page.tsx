import { HeroSection } from "@/components/home/hero-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { FeaturedSigns } from "@/components/home/featured-signs";
import { CTASection } from "@/components/home/cta-section";
import { getSigns } from "@/lib/actions/signs";

export default async function HomePage() {
  const signs = await getSigns();
  const featuredSigns = signs.slice(0, 4);

  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FeaturedSigns signs={featuredSigns} />
      <CTASection />
    </>
  );
}

import WelcomeHeader from "@/components/welcome/Header";
import WelcomeHero from "@/components/welcome/Hero";
import Features from "@/components/welcome/Features";
import Pricing from "@/components/welcome/Pricing";
import Contact from "@/components/welcome/Contact";
import WelcomeFooter from "@/components/welcome/Footer";
import { FadeInUp, FadeIn } from "@/components/ui/animate-on-scroll";

function WelcomePage() {
  return (
    <>
      <WelcomeHeader />
      <FadeInUp delay={200} duration={1000}>
        <WelcomeHero />
      </FadeInUp>
      <FadeInUp delay={100} duration={800}>
        <Features />
      </FadeInUp>
      <FadeInUp delay={100} duration={800}>
        <Pricing />
      </FadeInUp>
      <FadeInUp delay={100} duration={800}>
        <Contact />
      </FadeInUp>
      <FadeIn delay={0} duration={600}>
        <WelcomeFooter />
      </FadeIn>
    </>
  );
}

export default WelcomePage;

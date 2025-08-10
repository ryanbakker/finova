import WelcomeHeader from "@/components/welcome/Header";
import WelcomeHero from "@/components/welcome/Hero";
import Features from "@/components/welcome/Features";
import Pricing from "@/components/welcome/Pricing";
import Contact from "@/components/welcome/Contact";
import WelcomeFooter from "@/components/welcome/Footer";

function WelcomePage() {
  return (
    <>
      <WelcomeHeader />
      <WelcomeHero />
      <Features />
      <Pricing />
      <Contact />
      <WelcomeFooter />
    </>
  );
}

export default WelcomePage;

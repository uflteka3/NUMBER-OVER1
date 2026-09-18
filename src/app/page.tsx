import { Benefits } from "@/components/landing/benefits";
import { Countries } from "@/components/landing/countries";
import { CtaSection } from "@/components/landing/cta-section";
import { Faq } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navbar } from "@/components/landing/navbar";
import { Services } from "@/components/landing/services";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="contenu">
        <Hero />
        <HowItWorks />
        <Services />
        <Countries />
        <Benefits />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}

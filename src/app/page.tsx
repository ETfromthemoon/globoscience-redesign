import Header from "./_components/header";
import Hero from "./_components/hero";
import StatsStrip from "./_components/stats";
import About from "./_components/about";
import Expertise from "./_components/expertise";
import WhyUs from "./_components/why-us";
import CTABanner from "./_components/cta-banner";
import Locations from "./_components/locations";
import Contact from "./_components/contact";
import Footer from "./_components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatsStrip />
        <About />
        <Expertise />
        <WhyUs />
        <CTABanner />
        <Locations />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

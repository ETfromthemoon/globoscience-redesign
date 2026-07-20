import Header from "./_components/header";
import Hero from "./_components/hero";
import About from "./_components/about";
import Expertise from "./_components/expertise";
import WhyUs from "./_components/why-us";
import CTABanner from "./_components/cta-banner";
import Locations from "./_components/locations";
import Contact from "./_components/contact";
import Footer from "./_components/footer";
import BackToTop from "./_components/back-to-top";
import ScrollProgress from "./_components/scroll-progress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <About />
        <Expertise />
        <WhyUs />
        <CTABanner />
        <Locations />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

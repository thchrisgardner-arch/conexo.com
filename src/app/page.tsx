import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/hero/Hero";
import Marquee from "@/components/Marquee";
import Intro from "@/components/Intro";
import Services from "@/components/services/Services";
import Pillars from "@/components/pillars/Pillars";
import Work from "@/components/work/Work";
import Differentiators from "@/components/differentiators/Differentiators";
import Process from "@/components/process/Process";
import Plans from "@/components/plans/Plans";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Loader />
      <Cursor />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Intro />
        <Services />
        <Pillars />
        <Work />
        <Differentiators />
        <Process />
        <Plans />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

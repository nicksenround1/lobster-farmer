import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Tools from "@/components/Tools";
import Community from "@/components/Community";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Tools />
      <Community />
      <Contact />
      <Footer />
    </main>
  );
}

import Preloader from './components/ui/preloader';
import BackgroundGrid from './components/BackgroundGrid';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import { BlogSection } from './components/BlogSection';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FFEA00] selection:text-black antialiased relative overflow-x-hidden">
      {/* Preloader — fixed overlay, slides away once page assets are ready */}
      <Preloader />
      <BackgroundGrid />
      <Navbar />
      <Hero />
      <About />
      <BlogSection />
      <Marquee />
      <Services />
      <Projects />
      <Experience />
      <Footer />
    </div>
  );
}
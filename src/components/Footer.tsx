import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ParticleTextMorph from './ParticleTextMorph';

export default function Footer() {
  const [algiersTime, setAlgiersTime] = useState('');
  const [activeItem, setActiveItem] = useState('VANAPALLI JASWANTH');
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: '-100px' });

  useEffect(() => {
    const updateTime = () => {
      try {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        setAlgiersTime(formatter.format(new Date()) + ' (IST)');
      } catch {
        // Fallback to local time if timezone not supported
        const date = new Date();
        setAlgiersTime(date.toLocaleTimeString() + ' (Local)');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative w-full bg-[#0A0A0A] text-white pt-16 pb-6 overflow-hidden border-t border-white/5"
    >
      {/* Background decoration */}
      <motion.div
        className="absolute left-1/3 top-1/3 w-[350px] h-[350px] rounded-full bg-[#FFEA00]/3 blur-[120px] pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="max-w-6xl w-[90%] mx-auto relative z-10 flex flex-col gap-10">

        {/* Contact Block: Big CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline">
          <motion.div
            className="lg:col-span-8 flex flex-col gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-xs text-[#FFEA00] tracking-[0.25em] uppercase select-none">
              Get in Touch
            </span>
            <h2 className="font-sans font-black text-4xl sm:text-6xl lg:text-7xl leading-tight tracking-tight">
              Let's create something<br />exceptional together.
            </h2>
          </motion.div>

          <motion.div
            className="lg:col-span-4 flex flex-col gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.a
              href="mailto:jaswanthvanapalli12@gmail.com"
              onMouseEnter={() => setActiveItem('EMAIL')}
              onMouseLeave={() => setActiveItem('VANAPALLI JASWANTH')}
              whileHover={{ scale: 1.02, boxShadow: "0px 0px 30px rgba(255, 234, 0, 0.35)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              className="w-full py-4 rounded-full bg-[#FFEA00] text-black text-center font-sans font-bold text-base hover:bg-white transition-colors duration-300 shadow-lg block"
            >
              jaswanthvanapalli12@gmail.com
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/vanapalli-jaswanth"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setActiveItem('LINKEDIN')}
              onMouseLeave={() => setActiveItem('VANAPALLI JASWANTH')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              className="group relative w-full py-4 rounded-full border border-white/20 text-white flex items-center justify-center gap-2 font-sans font-bold text-base hover:text-[#FFEA00] hover:border-[#FFEA00] hover:bg-[#FFEA00]/5 transition-all duration-300 overflow-hidden block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFEA00]/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                LinkedIn Profile
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </span>
            </motion.a>
          </motion.div>
        </div>

        <div className="h-[1px] w-full bg-white/10" />

        {/* Footer directories & grids */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Navigation links */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#71717A] select-none">
              LINKS
            </span>
            <div className="flex flex-col gap-2.5 font-sans text-sm text-neutral-400">
              <a
                href="#home"
                onClick={(e) => handleScrollTo(e, '#home')}
                onMouseEnter={() => setActiveItem('HOME')}
                onMouseLeave={() => setActiveItem('VANAPALLI JASWANTH')}
                className="hover:text-[#FFEA00] hover:translate-x-1 transition-all duration-300 block"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={(e) => handleScrollTo(e, '#about')}
                onMouseEnter={() => setActiveItem('ABOUT')}
                onMouseLeave={() => setActiveItem('VANAPALLI JASWANTH')}
                className="hover:text-[#FFEA00] hover:translate-x-1 transition-all duration-300 block"
              >
                About
              </a>
              <a
                href="#projects"
                onClick={(e) => handleScrollTo(e, '#projects')}
                onMouseEnter={() => setActiveItem('WORKS')}
                onMouseLeave={() => setActiveItem('VANAPALLI JASWANTH')}
                className="hover:text-[#FFEA00] hover:translate-x-1 transition-all duration-300 block"
              >
                Works
              </a>
            </div>
          </div>

          {/* Social connections */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#71717A] select-none">
              SOCIALS
            </span>
            <div className="flex flex-col gap-2.5 font-sans text-sm text-neutral-400">
              <a
                href="https://www.linkedin.com/in/vanapalli-jaswanth"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setActiveItem('LINKEDIN')}
                onMouseLeave={() => setActiveItem('VANAPALLI JASWANTH')}
                className="hover:text-[#FFEA00] hover:translate-x-1 transition-all duration-300 block"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/vanapalli-jaswanth"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setActiveItem('GITHUB')}
                onMouseLeave={() => setActiveItem('VANAPALLI JASWANTH')}
                className="hover:text-[#FFEA00] hover:translate-x-1 transition-all duration-300 block"
              >
                GitHub
              </a>
              <a
                href="https://wa.me/916301055103"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setActiveItem('WHATSAPP')}
                onMouseLeave={() => setActiveItem('VANAPALLI JASWANTH')}
                className="hover:text-[#FFEA00] hover:translate-x-1 transition-all duration-300 block"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Clock zone */}
          <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#71717A] select-none">
              LOCAL TIME
            </span>
            <div className="flex items-center gap-2 font-mono text-sm text-[#FFEA00] font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFEA00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFEA00]"></span>
              </span>
              {algiersTime}
            </div>
            <span className="font-sans text-xs text-neutral-500">
              Visakhapatnam, AP
            </span>
          </div>

          {/* Version and licensing */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#71717A] select-none">
              VERSION
            </span>
            <div className="font-sans text-sm text-neutral-400">
              2026 © Edition
            </div>
            <span className="font-sans text-xs text-neutral-500">
              Crafted in India
            </span>
          </div>
        </div>

        {/* Massive text background overlay replaced with dynamic morphing particle canvas */}
        <div className="w-full h-[250px] sm:h-[380px] relative mt-4 mb-0 overflow-hidden flex items-center justify-center">
          <ParticleTextMorph activeItem={activeItem} />
        </div>
      </div>
    </footer>
  );
}

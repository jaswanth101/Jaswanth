import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typewriter effect for logo
  const fullName = 'Vanapalli Jaswanth';
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    if (!isDeleting) {
      // Typing
      if (displayText.length < fullName.length) {
        setDisplayText(fullName.slice(0, displayText.length + 1));
      } else {
        // Pause at full name, then start deleting
        setTimeout(() => setIsDeleting(true), 2000);
        return;
      }
    } else {
      // Deleting
      if (displayText.length > 1) {
        setDisplayText(fullName.slice(0, displayText.length - 1));
      } else {
        // Pause at 'P', then start typing again
        setTimeout(() => setIsDeleting(false), 1200);
        return;
      }
    }
  }, [displayText, isDeleting, fullName]);

  useEffect(() => {
    const speed = isDeleting ? 80 : 120;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting]);

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'About Me', href: '#about' },
    { name: 'My Projects', href: '#projects' }
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

      // Calculate how far the section's top border should be from the top of the screen
      // This compensates for the section's top padding (py-24, py-32, py-40) 
      // and the navbar's height so the text always lands perfectly right below the navbar.
      let elementYTarget = 0;

      if (href === '#contact') {
        // --- CUSTOM CONTACT SECTION OFFSETS ---
        // Increase these numbers to make the page scroll LESS (keeping the section lower on screen)
        if (isMobile) {
          elementYTarget = 60;
        } else if (isTablet) {
          elementYTarget = 120;
        } else {
          elementYTarget = 15; // <-- Change this number to tweak Desktop contact scroll
        }
      } else {
        // --- OFFSETS FOR ABOUT & PROJECTS ---
        if (isMobile) {
          elementYTarget = 4;
        } else if (isTablet) {
          elementYTarget = -18;
        } else {
          elementYTarget = -50;
        }
      }

      const absoluteElementTop = element.getBoundingClientRect().top + window.scrollY;
      const scrollPosition = absoluteElementTop - elementYTarget;

      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
          ? 'py-4 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-white/10 text-white'
          : 'py-6 bg-transparent text-white'
          }`}
      >
        <div className="max-w-6xl w-[90%] mx-auto flex items-center justify-between">

          {/* Monogram Logo "G|" */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-0.5 font-sans font-black text-2xl tracking-tighter select-none text-white"
          >
            <span className="inline-block min-w-[1ch]">{displayText}</span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
              className="text-[#FFEA00] inline-block"
            >
              |
            </motion.span>
          </a>

          {/* Nav links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-[0.25em]">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href)}
                className="relative py-1 group transition-colors duration-300 text-white/80 hover:text-[#FFEA00] select-none"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#FFEA00] transition-all duration-300 group-hover:w-[80%]" />
              </a>
            ))}

            {/* Animated Contact Button */}
            <div className="ml-4 flex items-center">
              <a
                href="#contact"
                onClick={(e) => handleScrollTo(e, '#contact')}
                className="relative flex items-center text-[11px] font-mono font-bold tracking-widest rounded-full h-[36px] p-1 pl-5 pr-[42px] group transition-all duration-500 hover:pl-[42px] hover:pr-5 w-fit overflow-hidden cursor-pointer bg-white text-black hover:bg-neutral-200 shadow-sm"
              >
                <span className="relative z-10 transition-all duration-500 whitespace-nowrap pt-[1px]">
                  Contact
                </span>
                <div className="absolute right-1 w-[28px] h-[28px] bg-black text-white rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-32px)] group-hover:rotate-45 group-hover:bg-[#FFEA00] group-hover:text-black group-hover:shadow-[0_0_15px_rgba(255,234,0,0.5)]">
                  <ArrowUpRight size={14} />
                </div>
              </a>
            </div>
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            <span className={`w-6 h-[2px] transition-transform duration-300 bg-white ${mobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <span className={`w-6 h-[2px] transition-opacity duration-300 bg-white ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`w-6 h-[2px] transition-transform duration-300 bg-white ${mobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0A0A0A] z-40 flex flex-col items-center justify-center gap-8 text-white md:hidden"
          >
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href)}
                className="font-sans font-bold text-3xl tracking-wide hover:text-[#FFEA00] transition-colors"
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, '#contact')}
              className="px-6 py-3 rounded-full border border-white/20 hover:border-[#FFEA00] hover:text-[#FFEA00] transition-colors font-mono text-sm tracking-widest flex items-center gap-2"
            >
              <span>CONTACT ME</span>
              <span>↗</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

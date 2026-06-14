import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate, useScroll, useTransform, useSpring } from 'framer-motion';
import { SkillOrbit } from './ui/SkillOrbit';

function Counter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(from, to, {
      duration,
      ease: 'easeOut' as const, // Cast ease as const
      onUpdate: (value) => setCount(Math.ceil(value))
    });
    return () => controls.stop();
  }, [from, to, isInView, duration]);

  return (
    <div ref={ref} className="font-sans font-black text-5xl sm:text-7xl md:text-8xl text-[#FFEA00] leading-none">
      {count}+
    </div>
  );
}

function ScrollHighlightedParagraph({ text, className }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 82%", "end 58%"]
  });

  const words = text.split(' ');

  return (
    <div ref={containerRef} className={`flex flex-wrap ${className || ''}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1.5) / words.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.22, 1]);

        return (
          <motion.span
            key={i}
            style={{ opacity }}
            className="inline-block mr-[0.22em]"
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 });

  // Asymmetric scroll parallax
  const leftY = useTransform(smoothScroll, [0, 0.45], [60, -20]);
  const rightY = useTransform(smoothScroll, [0, 0.45], [120, 0]);
  const contentOpacity = useTransform(smoothScroll, [0, 0.35], [0, 1]);

  // Glow reveal on scroll
  const glowScale = useTransform(smoothScroll, [0, 0.45], [0.8, 1.2]);
  const glowOpacity = useTransform(smoothScroll, [0, 0.45], [0, 0.08]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-[#0A0A0A] text-white py-24 sm:py-32 lg:py-40 overflow-hidden border-t border-white/5 scroll-mt-32"
    >
      {/* Background radial glow */}
      <motion.div
        className="absolute right-0 top-1/4 w-[300px] h-[300px] rounded-full bg-[#FFEA00] blur-[120px] pointer-events-none"
        style={{
          scale: glowScale,
          opacity: glowOpacity,
        }}
      />

      <div className="max-w-6xl w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">

        {/* Left Column: Heading & Side Title */}
        <motion.div
          className="lg:col-span-5 flex flex-col gap-6"
          style={{
            y: leftY,
            opacity: contentOpacity,
          }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#FFEA00] select-none">
            A b o u t M e
          </span>
          <h2 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
            My Short<br />Story
          </h2>

          <div className="h-[1px] w-20 bg-white/20 my-2"></div>

          <p className="font-sans text-sm text-neutral-400 tracking-wider font-mono uppercase">
            AGENTIC AI ENGINEER | SOLUTIONS ARCHITECT.
          </p>

          <div className="mt-12 lg:mt-4 xl:mt-8 flex justify-center lg:justify-start w-full scale-[0.85] sm:scale-[0.95] lg:scale-100 xl:scale-[1.05] origin-top lg:origin-top-left relative z-20 -mb-20 sm:-mb-24 lg:mb-0">
            <SkillOrbit />
          </div>
        </motion.div>

        {/* Right Column: Narrative content & Stats counters */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isSectionInView ? 'visible' : 'hidden'}
          className="lg:col-span-7 flex flex-col gap-10"
          style={{
            y: rightY,
            opacity: contentOpacity,
          }}
        >
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <ScrollHighlightedParagraph
              className="font-sans font-bold text-2xl sm:text-3xl text-neutral-200 leading-snug"
              text="I'm Vanapalli Jaswanth — an Agentic AI Engineer & Solutions Architect building scalable, high-impact platforms and sophisticated autonomous workflows that power real-world intelligent applications."
            />
            <ScrollHighlightedParagraph
              className="font-sans text-lg text-neutral-400 leading-relaxed"
              text="Specializing in modern web technologies and AI orchestration using TypeScript, React.js, Node.js, and n8n workflow automation. From AI-native e-learning platforms to intelligent healthcare assistants, I architect scalable, reliable solutions across frontend, backend, and retrieval layers."
            />
          </motion.div>

          <motion.div variants={itemVariants} className="h-[1px] w-full bg-white/10"></motion.div>

          {/* Stats grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-8">
            <motion.div
              className="flex flex-col gap-2 cursor-default"
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
            >
              <Counter from={0} to={2} duration={2.5} />
              <span className="font-mono text-2xs sm:text-xs text-neutral-400 uppercase tracking-widest mt-1">
                YEARS OF EXPERIENCE
              </span>
            </motion.div>
            <motion.div
              className="flex flex-col gap-2 cursor-default"
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
            >
              <Counter from={0} to={5} duration={2.5} />
              <span className="font-mono text-2xs sm:text-xs text-neutral-400 uppercase tracking-widest mt-1">
                PROJECTS COMPLETED
              </span>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="h-[1px] w-full bg-white/10"></motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <ScrollHighlightedParagraph
              className="font-sans font-bold text-xl text-neutral-200"
              text="Architecting intelligent systems that merge engineering precision with AI-driven innovation."
            />
            <ScrollHighlightedParagraph
              className="font-sans text-base text-neutral-400 leading-relaxed"
              text="Every platform I build starts with a clear objective — reduce complexity, maximize reliability, and deliver measurable real-world impact. From enterprise ERP systems to AI-native learning platforms and Digital Twin architectures, I bring deep technical rigor and a product-driven mindset to every challenge."
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

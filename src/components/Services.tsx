import { useRef } from 'react';
import { motion, useInView, useMotionValue, useMotionTemplate } from 'framer-motion';

// Custom inline SVG icons with reactive path transitions
const CodeIcon = () => (
  <svg className="w-8 h-8 text-[#FFEA00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" className="transition-transform duration-300 transform group-hover:translate-x-1" />
    <polyline points="8 6 2 12 8 18" className="transition-transform duration-300 transform group-hover:-translate-x-1" />
  </svg>
);

const DesignIcon = () => (
  <svg className="w-8 h-8 text-[#FFEA00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="3" x2="9" y2="21" className="transition-transform duration-300 transform group-hover:scale-y-110 origin-center" />
    <line x1="9" y1="9" x2="21" y2="9" className="transition-all duration-300 transform group-hover:translate-x-0.5" />
    <line x1="9" y1="15" x2="21" y2="15" className="transition-all duration-300 transform group-hover:translate-x-0.5" />
  </svg>
);

const CloudIcon = () => (
  <svg className="w-8 h-8 text-[#FFEA00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" className="transition-transform duration-300 transform group-hover:-translate-y-0.5" />
    <line x1="8" y1="21" x2="16" y2="21" className="transition-opacity duration-300 group-hover:opacity-80" />
    <line x1="12" y1="17" x2="12" y2="21" className="transition-transform duration-300 transform group-hover:scale-y-110 origin-bottom" />
  </svg>
);

const DatabaseIcon = () => (
  <svg className="w-8 h-8 text-[#FFEA00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" className="transition-transform duration-300 transform group-hover:-translate-y-0.5" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" className="transition-transform duration-300 transform group-hover:translate-y-0.5" />
  </svg>
);

interface ServiceItem {
  num: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

function ServiceCard({ service, cardVariants }: { service: ServiceItem; cardVariants: any }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -6 }}
      className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm flex flex-col gap-6 transition-all duration-300 relative group overflow-hidden"
    >
      {/* Spotlight highlight background glow */}
      <motion.div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              320px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 234, 0, 0.08),
              transparent 85%
            )
          `
        }}
      />
      {/* Light border spotlight glow effect */}
      <motion.div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-[#FFEA00]/30 z-10"
        style={{
          maskImage: useMotionTemplate`
            radial-gradient(
              160px circle at ${mouseX}px ${mouseY}px,
              black,
              transparent
            )
          `,
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              160px circle at ${mouseX}px ${mouseY}px,
              black,
              transparent
            )
          `
        }}
      />

      {/* Highlight gradient background on card hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFEA00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
      
      <div className="flex items-center justify-between relative z-20">
        <span className="font-mono text-xs text-[#FFEA00] font-bold tracking-widest bg-[#FFEA00]/10 px-2.5 py-1 rounded">
          {service.num}
        </span>
        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#FFEA00]/10 transition-colors duration-300">
          {service.icon}
        </div>
      </div>

      <div className="flex flex-col gap-3 relative z-20">
        <h3 className="font-sans font-bold text-xl sm:text-2xl text-white group-hover:text-[#FFEA00] transition-colors duration-300">
          {service.title}
        </h3>
        <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">
          {service.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  const servicesList: ServiceItem[] = [
    {
      num: '01',
      title: 'Agentic AI & Multi-Agent Systems',
      desc: 'Architecting configuration-driven AI platforms with multi-agent orchestration, tool-use planning, stateful workflows, and human-in-the-loop execution engines. Building Digital Twin systems with LangGraph-style state machines and zero-trust safety architectures.',
      icon: <CodeIcon />
    },
    {
      num: '02',
      title: 'RAG Pipeline Engineering',
      desc: 'Designing production-grade Retrieval-Augmented Generation pipelines combining vector search (pgvector), lexical retrieval, confidence gating, and hierarchical knowledge hydration. Transforming expert documentation into optimized retrieval chunks and embeddings.',
      icon: <DatabaseIcon />
    },
    {
      num: '03',
      title: 'Full-Stack Platform Development',
      desc: 'Building end-to-end AI-native platforms using Python (FastAPI) and React. From course orchestration systems to control planes and patient workflow interfaces — delivering scalable, production-ready applications with secure authentication and role-based access.',
      icon: <DesignIcon />
    },
    {
      num: '04',
      title: 'Cloud & API Architecture',
      desc: 'Designing scalable microservice architectures deployed on AWS. Building reliable REST APIs, integrating OAuth 2.0 / JWT security, and orchestrating async services with saga-style coordination patterns for durable, high-availability systems.',
      icon: <CloudIcon />
    }
  ];

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { y: 45, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section 
      id="services" 
      className="relative w-full bg-[#0A0A0A] text-white py-24 sm:py-32 overflow-hidden border-t border-white/5"
    >
      {/* Background glow */}
      <div className="absolute left-0 bottom-1/4 w-[300px] h-[300px] rounded-full bg-[#FFEA00]/3 blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl w-[90%] mx-auto relative z-10">
        
        {/* Section title */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="flex flex-col gap-4 mb-16 sm:mb-24"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#FFEA00] select-none">
            E x p e r t i s e s
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Engineering intelligence into<br />every digital solution
          </h2>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {servicesList.map((service) => (
            <ServiceCard 
              key={service.num}
              service={service}
              cardVariants={cardVariants}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

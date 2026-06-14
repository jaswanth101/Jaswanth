import { useRef } from 'react';
import { motion, useInView, useSpring, useTransform, useMotionValue, useReducedMotion } from 'framer-motion';
import WalletCards from './ui/WalletCards';

interface ProjectItem {
  title: string;
  spacedTitle: string;
  category: string;
  desc: string;
  image: string;
  tags: string[];
}

function ProjectCard({ project, projectVariants }: { project: ProjectItem; projectVariants: any }) {
  const shouldReduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // Parallax coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springImageX = useSpring(mouseX, { stiffness: 100, damping: 25 });
  const springImageY = useSpring(mouseY, { stiffness: 100, damping: 25 });

  // Map values to slightly move in opposite direction
  const imgTranslateX = useTransform(springImageX, [-0.5, 0.5], [12, -12]);
  const imgTranslateY = useTransform(springImageY, [-0.5, 0.5], [12, -12]);

  // For the glassy reflection shine effect sweep (numeric percentage)
  const shineX = useMotionValue(-100);
  const springShineX = useSpring(shineX, { stiffness: 120, damping: 28 });
  const shinePercentX = useTransform(springShineX, (val) => `${val}%`);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduce) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);

    // Set shine offset based on cursor progress
    const pct = ((e.clientX - left) / width) * 250 - 100; // -100 to 150
    shineX.set(pct);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    shineX.set(-100);
  }

  return (
    <motion.div
      variants={projectVariants}
      className="flex flex-col gap-5 group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      {/* Project Card Frame with overflow-hidden and custom aspect-ratio */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-white/[0.02] border border-white/10 relative cursor-pointer shadow-lg transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:border-[#FFEA00]/30 group-hover:shadow-[0_0_35px_rgba(255, 234, 0,0.12)]">

        {/* Parallax Image container */}
        <div className="w-full h-full relative overflow-hidden scale-100 group-hover:scale-[1.03] transition-transform duration-700 ease-out">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-[108%] h-[108%] -left-[4%] -top-[4%] relative object-cover transition-all duration-700 ease-out"
            style={{
              x: shouldReduce ? 0 : imgTranslateX,
              y: shouldReduce ? 0 : imgTranslateY,
            }}
          />
        </div>

        {/* Skewed Glassy Light Sweep Shine Overlay */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-transparent via-white/12 to-transparent skew-x-[-25deg] w-1/2 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            left: shinePercentX,
          }}
        />

        {/* Floating Overlay Badge */}
        <div className="absolute top-4 left-4 bg-[#0A0A0A]/85 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-2xs font-mono tracking-widest text-[#FFEA00] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[#FFEA00]/30 group-hover:shadow-[0_0_12px_rgba(255, 234, 0,0.2)]">
          {project.category.toUpperCase()}
        </div>
      </div>

      {/* Text Info */}
      <div className="flex flex-col gap-3 px-1">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-sans font-black text-xl sm:text-2xl text-white group-hover:text-[#FFEA00] transition-colors duration-300 flex items-center gap-1.5">
            <span>{project.title}</span>
            <span className="inline-block transition-all duration-300 transform translate-y-1 -translate-x-1 opacity-0 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:opacity-100 text-xs text-[#FFEA00]">
              ↗
            </span>
          </h3>
          <span className="hidden sm:block font-mono text-[9px] text-neutral-500 uppercase tracking-widest whitespace-nowrap text-right shrink-0">
            {project.spacedTitle}
          </span>
        </div>

        <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">
          {project.desc}
        </p>

        {/* Tech tags list */}
        <div className="flex flex-wrap gap-2 mt-2">
          {project.tags.map((tag) => (
            <motion.span
              key={tag}
              whileHover={{ scale: 1.08, borderColor: 'rgba(255, 234, 0,0.3)', color: '#FFEA00', backgroundColor: 'rgba(255, 234, 0,0.05)' }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
              className="text-[10px] font-mono text-neutral-300 border border-white/5 bg-white/[0.03] px-2.5 py-0.5 rounded-md cursor-default transition-all duration-200"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  const projectsList: ProjectItem[] = [
    {
      title: 'Adaptive AI E-Learning Platform',
      spacedTitle: 'E - L e a r n i n g',
      category: 'Full Stack',
      desc: 'Led the end-to-end architecture for an automated course enrollment system and real-time learner progress tracking platform. Managed the implementation of granular role-based access control (RBAC) to enforce security at both the UI and API levels.',
      image: import.meta.env.BASE_URL + 'ai_learning_platform.png',
      tags: ['TypeScript', 'Node.js', 'React.js', 'RBAC']
    },
    {
      title: 'Intelligent Healthcare Assistant',
      spacedTitle: 'H e a l t h c a r e',
      category: 'AI Orchestration',
      desc: 'Developed a RAG-based clinical assistant providing intelligent patient recommendations through semantic search and AI-driven data analysis. Built a robust clinic management module featuring role-based UI flows and secure backend API handling for medical leads.',
      image: import.meta.env.BASE_URL + 'rag_pipeline.png',
      tags: ['React.js', 'Node.js', 'n8n', 'VectorDB', 'RAG']
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const projectVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section
      id="projects"
      className="relative w-full bg-[#0A0A0A] text-white py-24 sm:py-32 overflow-hidden border-t border-white/5 scroll-mt-32"
    >
      {/* Background ambient lighting */}
      <div className="absolute right-0 bottom-10 w-[350px] h-[350px] rounded-full bg-[#FFEA00]/3 blur-[140px] pointer-events-none"></div>

      <div className="max-w-6xl w-[90%] mx-auto relative z-10">

        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-16 sm:mb-24">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FFEA00] select-none">
            p r o j e c t s
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Discover my latest work and<br />creative solutions
          </h2>
          <p className="font-sans text-neutral-400 max-w-xl text-base sm:text-lg">
            A handpicked collection of AI-powered platforms and systems that combine intelligent backend architecture with polished frontend experiences.
          </p>
        </div>

        {/* Projects Grid (2x2 layout) */}
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {projectsList.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              projectVariants={projectVariants}
            />
          ))}
        </motion.div>

        {/* Additional Projects Section */}
        <div className="flex flex-col gap-12 mt-32 pt-20 border-t border-white/5 items-center">
          <div className="text-center flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#FFEA00]">M o r e  &nbsp; W o r k</span>
            <h3 className="font-sans font-black text-2xl sm:text-4xl text-white tracking-tight">Other Experiments</h3>
          </div>
          <div className="flex justify-center w-full">
            <WalletCards />
          </div>
        </div>

      </div>
    </section>
  );
}

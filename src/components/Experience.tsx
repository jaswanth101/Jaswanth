import { useRef } from 'react';
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 });
  const cometTop = useTransform(scaleY, [0, 1], ["0%", "100%"]);
  const cometOpacity = useTransform(scaleY, [0, 0.08], [0, 1]);

  const experienceList = [
    {
      company: 'Ottobon Pvt Ltd',
      role: 'AI Application Developer & Team Lead',
      date: 'March 2025 – Present',
      desc: 'Led the development team in building AI-native course platforms. Engineered 20+ sophisticated n8n workflows integrating multi-step API logic and vector search, reducing manual data processing time by 40%. Integrated VectorDB and LLM models to build intelligent response systems. Awarded Employee of the Month.'
    },
    {
      company: 'Fulcrum Global Technologies Pvt Ltd',
      role: 'Frontend Developer Intern',
      date: 'December 2024 – February 2025',
      desc: 'Developed responsive Single Page Applications (SPAs) using React.js, optimizing component rendering speed and ensuring seamless data flow with Node.js APIs.'
    }
  ];

  const educationList = [
    {
      degree: 'B.Tech in Electronics and Telecommunication Engineering',
      institution: "Vignan Institute of Technology and Management",
      date: '2021 – 2025',
      details: 'CGPA: 8.02. Focused on engineering principles, telecommunications, and software development methodologies.'
    },
    {
      degree: 'Intermediate (Class XII)',
      institution: 'Narayana Junior College',
      date: '2019 – 2021',
      details: 'CGPA: 7.9. Built strong foundational knowledge in mathematics and sciences.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section 
      id="experience" 
      className="relative w-full bg-[#0A0A0A] text-white py-24 sm:py-32 overflow-hidden border-t border-white/5"
    >
      {/* Background radial glow */}
      <div className="absolute left-1/4 top-1/3 w-[300px] h-[300px] rounded-full bg-[#FFEA00]/3 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-[90%] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-16 sm:mb-24">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#FFEA00] select-none">
            J o u r n e y
          </span>
          <h2 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Experience & Journey
          </h2>
          <p className="font-sans text-neutral-400 max-w-xl text-base">
            From enterprise IT to Agentic AI engineering — a focused career journey building production-grade intelligent systems with Python, FastAPI, and cloud-native architectures.
          </p>
        </div>

        {/* Dual timeline grid */}
        <motion.div 
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
        >
          
          {/* Left Column: Work Experience */}
          <div className="flex flex-col gap-8">
            <h3 className="font-sans font-bold text-xl uppercase tracking-wider text-white border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
              <span className="text-[#FFEA00]">/</span> Work Experience
            </h3>
            
            <div className="relative pl-6 sm:pl-10 ml-2 flex flex-col gap-12">
              {/* Static background line */}
              <div className="absolute left-0 top-2 bottom-2 w-[1px] bg-white/10" />
              {/* Active scroll-drawn line */}
              <motion.div
                className="absolute left-0 top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#FFEA00] to-[#FFEA00]/20 origin-top"
                style={{ scaleY }}
              />
              {/* Scroll-following glowing comet */}
              <div className="absolute left-0 top-2 bottom-2 w-0 pointer-events-none">
                <motion.div
                  className="absolute left-0 -translate-x-1/2 w-1 h-8 rounded-full bg-gradient-to-t from-[#FFEA00] via-[#FFEA00]/50 to-transparent shadow-[0_0_10px_rgba(255, 234, 0,0.8)]"
                  style={{ top: cometTop, y: "-100%", opacity: cometOpacity }}
                />
              </div>
              {experienceList.map((job, idx) => (
                <motion.div 
                  key={job.company + idx}
                  variants={itemVariants}
                  className="relative flex flex-col gap-2 group cursor-default"
                >
                  {/* Glassy hover card background overlay (zero-shift) */}
                  <div className="absolute inset-x-[-16px] sm:inset-x-[-24px] inset-y-[-12px] rounded-xl bg-white/0 border border-transparent group-hover:bg-white/[0.015] group-hover:border-white/5 transition-all duration-300 pointer-events-none" />

                  {/* Timeline indicator node dot */}
                  <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 z-20">
                    <div 
                      className="w-full h-full rounded-full bg-[#0A0A0A] border-2 border-white/30 group-hover:border-[#FFEA00] group-hover:bg-[#FFEA00] group-hover:scale-125 transition-all duration-300 relative flex items-center justify-center"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-black transition-colors duration-300" />
                      <span className="absolute -inset-1.5 rounded-full border border-[#FFEA00]/30 group-hover:border-[#FFEA00]/50 group-hover:scale-110 animate-pulse pointer-events-none transition-all duration-300" />
                    </div>
                  </div>
                  
                  {/* Sliding Text Wrapper */}
                  <div className="flex flex-col gap-2 transition-transform duration-300 group-hover:translate-x-1.5 relative z-10">
                    <div className="flex flex-col gap-1">
                      <span className="font-sans font-black text-base sm:text-lg text-white group-hover:text-[#FFEA00] transition-colors duration-300">
                        {job.company}
                      </span>
                      <span className="font-mono text-xs text-neutral-400">
                        {job.role}
                      </span>
                      <span className="font-sans text-xs text-neutral-500 font-medium mt-1">
                        {job.date}
                      </span>
                    </div>
                    <div>
                      <p className="font-sans text-[#71717A] group-hover:text-neutral-300 transition-colors duration-300 text-sm leading-relaxed">
                        {job.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Education */}
          <div className="flex flex-col gap-8">
            <h3 className="font-sans font-bold text-xl uppercase tracking-wider text-white border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
              <span className="text-[#FFEA00]">/</span> Education
            </h3>
            
            <div className="relative pl-6 sm:pl-10 ml-2 flex flex-col gap-12">
              {/* Static background line */}
              <div className="absolute left-0 top-2 bottom-2 w-[1px] bg-white/10" />
              {/* Active scroll-drawn line */}
              <motion.div
                className="absolute left-0 top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#FFEA00] to-[#FFEA00]/20 origin-top"
                style={{ scaleY }}
              />
              {/* Scroll-following glowing comet */}
              <div className="absolute left-0 top-2 bottom-2 w-0 pointer-events-none">
                <motion.div
                  className="absolute left-0 -translate-x-1/2 w-1 h-8 rounded-full bg-gradient-to-t from-[#FFEA00] via-[#FFEA00]/50 to-transparent shadow-[0_0_10px_rgba(255, 234, 0,0.8)]"
                  style={{ top: cometTop, y: "-100%", opacity: cometOpacity }}
                />
              </div>
              {educationList.map((edu, idx) => (
                <motion.div 
                  key={edu.degree + idx}
                  variants={itemVariants}
                  className="relative flex flex-col gap-2 group cursor-default"
                >
                  {/* Glassy hover card background overlay (zero-shift) */}
                  <div className="absolute inset-x-[-16px] sm:inset-x-[-24px] inset-y-[-12px] rounded-xl bg-white/0 border border-transparent group-hover:bg-white/[0.015] group-hover:border-white/5 transition-all duration-300 pointer-events-none" />

                  {/* Timeline indicator node dot */}
                  <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 z-20">
                    <div 
                      className="w-full h-full rounded-full bg-[#0A0A0A] border-2 border-white/30 group-hover:border-[#FFEA00] group-hover:bg-[#FFEA00] group-hover:scale-125 transition-all duration-300 relative flex items-center justify-center"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-black transition-colors duration-300" />
                      <span className="absolute -inset-1.5 rounded-full border border-[#FFEA00]/30 group-hover:border-[#FFEA00]/50 group-hover:scale-110 animate-pulse pointer-events-none transition-all duration-300" />
                    </div>
                  </div>
                  
                  {/* Sliding Text Wrapper */}
                  <div className="flex flex-col gap-2 transition-transform duration-300 group-hover:translate-x-1.5 relative z-10">
                    <div className="flex flex-col gap-1">
                      <span className="font-sans font-black text-base sm:text-lg text-white group-hover:text-[#FFEA00] transition-colors duration-300">
                        {edu.degree}
                      </span>
                      <span className="font-mono text-xs text-neutral-400">
                        {edu.institution}
                      </span>
                      <span className="font-sans text-xs text-neutral-500 font-medium mt-1">
                        {edu.date}
                      </span>
                    </div>
                    <div>
                      <p className="font-sans text-[#71717A] group-hover:text-neutral-300 transition-colors duration-300 text-sm leading-relaxed">
                        {edu.details}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}

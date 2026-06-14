import { motion } from 'framer-motion';

function SeparatorDot() {
  return (
    <div className="w-1.5 h-1.5 rounded-full bg-[#FFEA00] mx-8 shrink-0 self-center shadow-[0_0_8px_rgba(255, 234, 0,0.6)]" />
  );
}

export default function Marquee() {
  const skills = [
    'Full Stack Development',
    'AI Orchestration',
    'TypeScript',
    'React.js',
    'Node.js',
    'PostgreSQL',
    'VectorDB',
    'MongoDB',
    'n8n Workflows',
    'RAG Architectures',
    'Docker',
    'Cloud Platforms'
  ];

  return (
    <div className="w-full bg-[#080808] py-4 border-t border-b border-white/5 overflow-hidden flex whitespace-nowrap select-none pointer-events-none">
      <div className="flex w-max">
        {/* First list of skills */}
        <motion.div 
          animate={{ x: [0, '-100%'] }}
          transition={{
            repeat: Infinity,
            duration: 35,
            ease: 'linear' as const
          }}
          className="flex shrink-0 items-center"
        >
          {skills.map((skill, index) => (
            <div key={`skill-1-${index}`} className="flex items-center">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-white/75 font-semibold">
                {skill}
              </span>
              <SeparatorDot />
            </div>
          ))}
        </motion.div>

        {/* Second identical list of skills for seamless loop */}
        <motion.div 
          animate={{ x: [0, '-100%'] }}
          transition={{
            repeat: Infinity,
            duration: 35,
            ease: 'linear' as const
          }}
          className="flex shrink-0 items-center"
        >
          {skills.map((skill, index) => (
            <div key={`skill-2-${index}`} className="flex items-center">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-white/75 font-semibold">
                {skill}
              </span>
              <SeparatorDot />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

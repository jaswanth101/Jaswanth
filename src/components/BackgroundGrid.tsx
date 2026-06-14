import { motion } from 'framer-motion';

export default function BackgroundGrid() {
  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden pointer-events-none bg-[#0A0A0A] select-none">
      
      {/* Animated Floating Glassy Blobs */}
      
      {/* Blob 1: Brand Neon Lime/Green */}
      <motion.div
        animate={{
          x: [0, 70, -50, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.25, 0.9, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut' as const
        }}
        className="absolute top-[10%] left-[10%] w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] rounded-full bg-[#FFEA00] opacity-[0.07] blur-[100px] mix-blend-screen"
      />

      {/* Blob 2: Neon Pink/Magenta */}
      <motion.div
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 70, -50, 0],
          scale: [1, 0.85, 1.15, 1]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut' as const
        }}
        className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#ec4899] opacity-[0.05] blur-[120px] mix-blend-screen"
      />

      {/* Blob 3: Deep Electric Blue */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 90, -80, 0],
          scale: [1, 1.1, 0.85, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut' as const
        }}
        className="absolute top-[35%] right-[25%] w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full bg-[#3b82f6] opacity-[0.05] blur-[110px] mix-blend-screen"
      />

      {/* Glassmorphism Diffusion Overlay */}
      <div className="absolute inset-0 bg-transparent backdrop-blur-[100px]" />

      {/* Subtle Dot Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}

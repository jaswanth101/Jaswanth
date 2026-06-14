import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
interface HeroTextProps {
  text?: string;
  className?: string;
}

export default function HeroText({
  text = "IMMERSE",
  className = "",
}: HeroTextProps) {
  const [count] = useState(0);
  const words = text.split(" ");

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full py-8 ${className}`}
    >
      {/* Main Text Container */}
      <div className="relative z-10 w-full px-4 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            className="flex flex-col sm:flex-row flex-wrap justify-center items-center w-full sm:gap-x-4 md:gap-x-8"
          >
            {words.map((word, wIdx) => (
              <div key={wIdx} className="flex">
                {word.split("").map((char, cIdx) => {
                  const i = wIdx * 10 + cIdx; // Staggered index
                  return (
                    <div
                      key={i}
                      className="relative px-[0.1vw] overflow-hidden group"
                    >
                      {/* Main Character */}
                      <motion.span
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ delay: i * 0.06 + 0.4, duration: 1.2 }}
                        className="text-6xl sm:text-7xl md:text-8xl leading-none font-black text-white tracking-tighter"
                      >
                        {char}
                      </motion.span>

                      {/* Top Slice Layer */}
                      <motion.span
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: "100%", opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1.0,
                          delay: i * 0.06,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 text-6xl sm:text-7xl md:text-8xl leading-none font-black text-[#FFEA00] z-10 pointer-events-none"
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
                      >
                        {char}
                      </motion.span>

                      {/* Middle Slice Layer */}
                      <motion.span
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: "-100%", opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1.0,
                          delay: i * 0.06 + 0.15,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 text-6xl sm:text-7xl md:text-8xl leading-none font-black text-white z-10 pointer-events-none"
                        style={{
                          clipPath: "polygon(0 35%, 100% 35%, 100% 65%, 0 65%)",
                        }}
                      >
                        {char}
                      </motion.span>

                      {/* Bottom Slice Layer */}
                      <motion.span
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: "100%", opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1.0,
                          delay: i * 0.06 + 0.3,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 text-6xl sm:text-7xl md:text-8xl leading-none font-black text-[#FFEA00] z-10 pointer-events-none"
                        style={{
                          clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)",
                        }}
                      >
                        {char}
                      </motion.span>
                    </div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating UI Controls - Made very subtle 
      <div className="mt-8 flex flex-col items-center gap-2 z-20">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCount((c) => c + 1)}
          className="p-2 bg-white/10 hover:bg-[#FFEA00]/20 text-white hover:text-[#FFEA00] rounded-full shadow-lg backdrop-blur-md transition-colors duration-300"
          title="Replay Animation"
        >
          <RefreshCw size={16} />
        </motion.button>
      </div>
      */}
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CardSwap, { Card } from './ui/CardSwap';

// Example hardcoded data. 
// Replace this with your actual CMS or local state data array.
const blogs = [
  {
    slug: "production-rag-education",
    title: "Building Production RAG for Education",
    description: "How I architected a production-grade RAG pipeline for an AI learning platform...",
    image: import.meta.env.BASE_URL + "images/blog-ai-dev.svg",
    tag: "AI Engineering",
    readTime: "5 min read"
  },
  {
    slug: "ai-native-learning-architecture",
    title: "The Architecture of AI-Native Learning",
    description: "Why I chose FastAPI over Express for AI workloads, how mastery-based progression works...",
    image: import.meta.env.BASE_URL + "images/blog-system-design.svg",
    tag: "System Design",
    readTime: "4 min read"
  },
  {
    slug: "agentic-digital-twin-architecture",
    title: "Architecting Agentic Digital Twins",
    description: "Designing stateful, autonomous digital twin agents capable of tool-use planning and human-in-the-loop orchestration...",
    image: import.meta.env.BASE_URL + "images/blog-n8n-ai.svg",
    tag: "Agentic Systems",
    readTime: "6 min read"
  }
];

export function BlogSection() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="writing" className="relative z-10 w-full bg-[#0A0A0A] overflow-hidden min-h-screen border-t border-white/5 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 md:px-8 lg:flex-row lg:items-center lg:gap-10 lg:pl-16 relative z-10">
        
        {/* Left side text content */}
        <div className="relative w-full lg:w-[44%]">
          <div className="absolute inset-x-0 top-10 h-40 rounded-full bg-[#FFEA00]/10 blur-[60px]" aria-hidden="true" />

          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#FFEA00] font-semibold">Writing</p>
            <h2 className="mt-5 max-w-xl text-4xl sm:text-5xl font-black leading-tight text-white tracking-tight">
              Thoughts from building real AI systems
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-300 font-light">
              Not theory. Not tutorials. Just lessons from systems that I built, deployed, and iterated on in production.
            </p>
            <p className="mt-10 max-w-md font-mono text-sm leading-7 text-zinc-500">
              Three reads on RAG engineering, AI platform architecture, and the systematic thinking behind production AI.
            </p>
          </div>
        </div>

        {/* Right side CardSwap container */}
        <div className="relative h-[280px] w-full sm:h-[340px] lg:h-[420px] lg:w-[56%] mt-4 lg:mt-0 flex flex-col items-center lg:items-end justify-center">
          
          <CardSwap
            width={isMobile ? 320 : 540}
            height={isMobile ? 220 : 280}
            cardDistance={isMobile ? 24 : 44}
            verticalDistance={isMobile ? 32 : 54}
            delay={3500}
            pauseOnHover={true}
            easing="smooth"
            onCardClick={(index) => {
              const blog = blogs[index];
              if (!blog) return;
              // Navigate to blog dynamically
              navigate(`/blog/${blog.slug}`);
            }}
          >
            {blogs.map((blog) => (
              <Card
                key={blog.slug}
                className="group cursor-pointer overflow-hidden border border-white/10 bg-[#0F0F0F] backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.5)] hover:border-[#FFEA00]/40 transition-colors duration-500"
              >
                <div className="flex h-full">
                  
                  {/* Image side of the card */}
                  <div className="w-[40%] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0F0F0F] z-10 opacity-90" />
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110 opacity-50 mix-blend-screen"
                    />
                  </div>

                  {/* Text side of the card */}
                  <div className="flex w-[60%] flex-col justify-between p-6 z-20">
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#FFEA00] font-semibold">
                        {blog.tag} | {blog.readTime}
                      </span>

                      <h3 className="mt-3 text-lg sm:text-xl font-bold leading-snug text-white group-hover:text-white transition-colors">
                        {blog.title}
                      </h3>

                      <p className="mt-3 text-xs sm:text-sm leading-6 text-zinc-400">
                        {blog.description}
                      </p>
                    </div>

                    <span className="mt-6 text-xs sm:text-sm font-semibold text-zinc-500 transition-colors group-hover:text-white">
                      Read More →
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
    </section>
  );
}

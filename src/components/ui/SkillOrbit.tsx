import { useState, type CSSProperties } from 'react';

// You can pass these as props or import them directly
const ORBIT_RADIUS = 168; // Adjust this to make the circle wider or tighter

const orbitSkills = [
  { "label": "Python", "icon": "https://cdn.simpleicons.org/python/3776AB" },
  { "label": "FastAPI", "icon": "https://cdn.simpleicons.org/fastapi/009688" },
  { "label": "React", "icon": "https://cdn.simpleicons.org/react/61DAFB" },
  { "label": "Node.js", "icon": "https://cdn.simpleicons.org/nodedotjs/5FA04E" },
  { "label": "PostgreSQL", "icon": "https://cdn.simpleicons.org/postgresql/4169E1" },
  { "label": "OpenAI", "icon": import.meta.env.BASE_URL + "images/openai-icon.svg" },
  { "label": "LangChain", "icon": "https://cdn.simpleicons.org/langchain/1C3C3C" },
  { "label": "Docker", "icon": "https://cdn.simpleicons.org/docker/2496ED" },
  { "label": "Git", "icon": "https://cdn.simpleicons.org/git/F05032" },
  { "label": "AWS", "icon": import.meta.env.BASE_URL + "images/Amazon_Web_Services_Logo.svg" },
  { "label": "Supabase", "icon": "https://cdn.simpleicons.org/supabase/3ECF8E" },
  { "label": "MongoDB", "icon": "https://cdn.simpleicons.org/mongodb/47A248" }
];

export function SkillOrbit() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <div className="relative flex items-center justify-center bg-transparent min-h-[500px] w-full overflow-visible">
      {/* Optional ambient background glow */}
      <div className="absolute h-64 w-64 rounded-full bg-[#FFEA00]/10 blur-[80px] md:h-80 md:w-80" aria-hidden="true" />

      <div className="relative h-[22rem] w-[22rem] md:h-[28rem] md:w-[28rem]">
        {/* Outer Ring */}
        <div className="absolute inset-[14%] rounded-full border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" aria-hidden="true" />
        {/* Inner Dashed Ring */}
        <div className="absolute inset-[4%] rounded-full border border-dashed border-[#FFEA00]/20" aria-hidden="true" />

        {/* Center Node */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="pointer-events-auto flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-[#FFEA00] to-[#CCAC00] px-4 text-center text-sm font-bold text-black shadow-[0_0_40px_rgba(255, 234, 0,0.4)] md:h-32 md:w-32 md:text-base backdrop-blur-md center-signal">
            <span className="max-w-[4.5rem] leading-tight md:max-w-[5rem] drop-shadow-sm">
              AI Engineering
            </span>
          </div>
        </div>

        {/* Orbiting Icons Container */}
        <div className="group absolute inset-0 orbit-rotate">
          {orbitSkills.map((skill, index) => {
            // Calculate orbital position based on index
            const angle = (index / orbitSkills.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * ORBIT_RADIUS;
            const y = Math.sin(angle) * ORBIT_RADIUS;
            
            const isActive = selectedSkill === skill.label;
            const isHovered = hoveredSkill === skill.label;
            
            const skillPositionStyle = {
              left: '50%',
              top: '50%',
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
            } satisfies CSSProperties;

            return (
              <div key={skill.label} className="absolute z-30" style={skillPositionStyle}>
                {/* Counter-rotation to keep icons upright while the parent rotates */}
                <div className="relative orbit-counter-rotate">
                  <button
                    type="button"
                    aria-label={skill.label}
                    aria-pressed={isActive}
                    onMouseEnter={() => setHoveredSkill(skill.label)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    onClick={() => setSelectedSkill(isActive ? null : skill.label)}
                    className={`relative flex h-[2.8rem] w-[2.8rem] cursor-pointer items-center justify-center rounded-full border bg-[#090909] transition duration-300 focus:outline-none md:h-[3.2rem] md:w-[3.2rem] ${
                      isActive
                        ? 'scale-[1.4] border-[#FFEA00]/80 bg-[radial-gradient(circle_at_top,_rgba(255, 234, 0,0.2),_rgba(9,9,9,0.98)_68%)] shadow-[0_0_28px_rgba(255, 234, 0,0.65),0_0_56px_rgba(255, 234, 0,0.32)]'
                        : isHovered
                          ? 'scale-[1.12] border-[#FFEA00]/60 bg-[radial-gradient(circle_at_top,_rgba(255, 234, 0,0.12),_rgba(9,9,9,0.98)_68%)] shadow-[0_0_18px_rgba(255, 234, 0,0.35)]'
                          : 'border-white/10'
                    }`}
                  >
                    <img
                      src={skill.icon}
                      alt={skill.label}
                      loading="lazy"
                      className="h-5 w-5 object-contain md:h-6 md:w-6"
                    />
                  </button>

                  {/* Tooltip Label */}
                  <div
                    className={`pointer-events-none absolute left-1/2 top-full z-40 mt-5 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/95 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-100 shadow-[0_0_24px_rgba(0,0,0,0.45)] transition duration-200 ${
                      isActive || isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                    }`}
                  >
                    {skill.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

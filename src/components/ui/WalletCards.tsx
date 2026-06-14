import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, BrainCircuit, Network, Cpu, Layers, Activity } from 'lucide-react';

type CardType = 'stripe' | 'wise' | 'paypal' | null;

const contentMap = {
  stripe: {
    title: "RAG Applications",
    description: "Retrieval-Augmented Generation.",
    feature: "Integrating proprietary knowledge bases with LLMs using Vector DBs for hallucination-free, highly contextual responses.",
    cta: "View RAG Projects",
    themeColor: "#FFEA00",
    glowColor: "rgba(255, 234, 0, 0.2)",
    Visual: () => (
      <div className="w-full h-full relative flex items-center justify-center gap-6 bg-gradient-to-br from-[#FFEA00]/10 to-transparent rounded-xl border border-[#FFEA00]/20 overflow-hidden">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <Database size={42} color="#FFEA00" strokeWidth={1.5} />
        </motion.div>
        
        {/* Animated flow dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#FFEA00]"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
          <BrainCircuit size={42} color="#FFEA00" strokeWidth={1.5} />
        </motion.div>
      </div>
    )
  },
  wise: {
    title: "Model Fine-Tuning",
    description: "Domain-Specific LLM Adaptation.",
    feature: "Employing LoRA and PEFT techniques to train base models on custom datasets, dramatically improving specialized task performance.",
    cta: "View Fine-Tuning",
    themeColor: "#FFFFFF",
    glowColor: "rgba(255, 255, 255, 0.1)",
    Visual: () => (
      <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 overflow-hidden">
        <div className="flex flex-col gap-4 items-center">
          <motion.div 
            className="flex items-center gap-4"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Layers size={36} color="#FFFFFF" strokeWidth={1.5} />
            <div className="h-[2px] w-12 bg-gradient-to-r from-white/80 to-transparent overflow-hidden relative">
              <motion.div 
                className="absolute top-0 bottom-0 left-0 w-4 bg-white blur-[2px]"
                animate={{ x: [-20, 60] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <Cpu size={36} color="#FFFFFF" strokeWidth={1.5} />
          </motion.div>
          {/* Animated Loss Graph */}
          <div className="w-40 h-10 relative flex items-end gap-1.5 opacity-80">
            {[40, 32, 25, 18, 12, 8, 5, 3].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-white/60 rounded-t-sm origin-bottom"
                animate={{ scaleY: [0, h/40, h/40] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut", times: [0, 0.4, 1], delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  },
  paypal: {
    title: "Multi-Agent Systems",
    description: "Autonomous AI Workflows.",
    feature: "Orchestrating collaborative swarms of specialized AI agents to reason, plan, and execute complex multi-step problems autonomously.",
    cta: "Explore Agents",
    themeColor: "#222222",
    glowColor: "rgba(255, 255, 255, 0.05)",
    Visual: () => (
      <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-[#FFEA00]/5 to-transparent rounded-xl border border-[#FFEA00]/10 overflow-hidden">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Center Orchestrator */}
          <motion.div
            className="z-10 bg-[#111] p-2 rounded-full border border-[#FFEA00]/50 shadow-[0_0_15px_rgba(255,234,0,0.2)]"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Network size={32} color="#FFEA00" strokeWidth={1.5} />
          </motion.div>
          
          {/* Rotating Satellite Agents */}
          <motion.div 
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#111] border border-[#FFEA00]/40 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,234,0,0.1)]">
              <Cpu size={16} color="#FFEA00"/>
            </div>
            <div className="absolute bottom-4 left-2 w-8 h-8 bg-[#111] border border-[#FFEA00]/40 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,234,0,0.1)]">
              <Database size={16} color="#FFEA00"/>
            </div>
            <div className="absolute bottom-4 right-2 w-8 h-8 bg-[#111] border border-[#FFEA00]/40 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,234,0,0.1)]">
              <Activity size={16} color="#FFEA00"/>
            </div>
            
            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full -z-10 opacity-30">
              <circle cx="64" cy="64" r="45" stroke="#FFEA00" strokeWidth="1" fill="none" strokeDasharray="4 4" />
            </svg>
          </motion.div>
        </div>
      </div>
    )
  }
};

const WalletCards = () => {
  const [activeCard, setActiveCard] = useState<CardType>(null);

  const handleCardClick = (card: CardType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeCard === card) {
      setActiveCard(null);
    } else {
      setActiveCard(card);
    }
  };

  const handleBackgroundClick = () => {
    setActiveCard(null);
  };

  const currentContent = activeCard ? contentMap[activeCard] : null;

  return (
    <Container onClick={handleBackgroundClick}>
      {/* Background glow reacts to active card */}
      <BackgroundGlow 
        animate={{ 
          background: activeCard 
            ? `radial-gradient(circle at 50% 50%, ${currentContent?.glowColor} 0%, transparent 60%)` 
            : 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 60%)'
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      <LayoutWrapper>
        {/* Left Content Panel */}
        <AnimatePresence>
          {activeCard && currentContent && (
            <ContentPanel
              initial={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.h2 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              >
                {currentContent.title}
              </motion.h2>
              <motion.p className="subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                {currentContent.description}
              </motion.p>
              
              <motion.div className="visual-container" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                <currentContent.Visual />
              </motion.div>

              <motion.p className="feature" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                {currentContent.feature}
              </motion.p>
              
              <motion.button 
                className="cta"
                style={{ backgroundColor: currentContent.themeColor, color: currentContent.themeColor === '#FFEA00' || currentContent.themeColor === '#FFFFFF' ? '#121212' : '#FFFFFF' }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentContent.cta}
              </motion.button>
            </ContentPanel>
          )}
        </AnimatePresence>

        {/* Right side Wallet */}
        <WalletSection
          animate={activeCard ? { 
            x: '25%', // Shift right perfectly to the side
            rotateY: -10,
            rotateZ: 2,
            scale: 0.95
          } : { 
            x: '0%', 
            rotateY: 0,
            rotateZ: 0,
            scale: 1
          }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
        >
          <StyledWrapper $hasActive={!!activeCard}>
            <div className="app-container">
              <motion.div 
                className="wallet"
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="wallet-back" />
                
                {/* Stripe Card */}
                <CardWrapper 
                  className={`card stripe ${activeCard === 'stripe' ? 'active' : ''} ${activeCard && activeCard !== 'stripe' ? 'inactive' : ''}`}
                  onClick={(e) => handleCardClick('stripe', e)}
                  whileHover={!activeCard ? { y: -60, scale: 1.03, rotateZ: 0 } : {}}
                >
                  <div className="card-inner">
                    <div className="card-top">
                      <span>RAG Engine</span>
                      <div className="chip" />
                    </div>
                    <div className="card-bottom">
                      <div className="card-info">
                        <span className="label">Stack</span><span className="value">VECTOR DB</span>
                      </div>
                      <div className="card-number-wrapper">
                        <span className="hidden-stars">**** CHUNK</span>
                        <span className="card-number">SEMANTIC SEARCH</span>
                      </div>
                    </div>
                  </div>
                </CardWrapper>

                {/* Wise Card */}
                <CardWrapper 
                  className={`card wise ${activeCard === 'wise' ? 'active' : ''} ${activeCard && activeCard !== 'wise' ? 'inactive' : ''}`}
                  onClick={(e) => handleCardClick('wise', e)}
                  whileHover={!activeCard ? { y: -70, scale: 1.03, rotateZ: 0 } : {}}
                >
                  <div className="card-inner">
                    <div className="card-top">
                      <span>Fine-Tuning</span>
                      <div className="chip" />
                    </div>
                    <div className="card-bottom">
                      <div className="card-info">
                        <span className="label">Method</span><span className="value">QLoRA / PEFT</span>
                      </div>
                      <div className="card-number-wrapper">
                        <span className="hidden-stars">**** LOSS</span>
                        <span className="card-number">DOMAIN ADAPTED</span>
                      </div>
                    </div>
                  </div>
                </CardWrapper>

                {/* PayPal Card */}
                <CardWrapper 
                  className={`card paypal ${activeCard === 'paypal' ? 'active' : ''} ${activeCard && activeCard !== 'paypal' ? 'inactive' : ''}`}
                  onClick={(e) => handleCardClick('paypal', e)}
                  whileHover={!activeCard ? { y: -60, scale: 1.03, rotateZ: 0 } : {}}
                >
                  <div className="card-inner">
                    <div className="card-top">
                      <span>Multi-Agent<b style={{ color: '#121212' }}>ic</b></span>
                      <div className="chip" />
                    </div>
                    <div className="card-bottom">
                      <div className="card-info">
                        <span className="label">Framework</span><span className="value">LANGGRAPH</span>
                      </div>
                      <div className="card-number-wrapper">
                        <span className="hidden-stars">**** NODE</span>
                        <span className="card-number">AUTONOMOUS SWARM</span>
                      </div>
                    </div>
                  </div>
                </CardWrapper>

                <div className="pocket">
                  <svg className="pocket-svg" viewBox="0 0 280 160" fill="none">
                    <path d="M 0 20 C 0 10, 5 10, 10 10 C 20 10, 25 25, 40 25 L 240 25 C 255 25, 260 10, 270 10 C 275 10, 280 10, 280 20 L 280 120 C 280 155, 260 160, 240 160 L 40 160 C 20 160, 0 155, 0 120 Z" fill="#151515" />
                    <path d="M 8 22 C 8 16, 12 16, 15 16 C 23 16, 27 29, 40 29 L 240 29 C 253 29, 257 16, 265 16 C 268 16, 272 16, 272 22 L 272 120 C 272 150, 255 152, 240 152 L 40 152 C 25 152, 8 152, 8 120 Z" stroke="#333333" strokeWidth="1.5" strokeDasharray="6 4" />
                  </svg>
                  <div className="pocket-content">
                    <div style={{ position: 'relative', height: 24, width: '100%' }}>
                      <div className="balance-stars">******</div>
                      <div className="balance-real">15+ Models</div>
                    </div>
                    <div style={{ color: '#888888', fontSize: 12, fontWeight: 500 }}>
                      Total Experiments
                    </div>
                    <div className="eye-icon-wrapper">
                      <svg className="eye-icon eye-slash" width={20} height={20} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx={12} cy={12} r={3} />
                        <line x1={3} y1={3} x2={21} y2={21} />
                      </svg>
                      <svg className="eye-icon eye-open" style={{ opacity: 0 }} width={20} height={20} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx={12} cy={12} r={3} />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </StyledWrapper>
        </WalletSection>
      </LayoutWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 40px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: visible;
  background: transparent; /* Keep original background logic outside */
  perspective: 1200px;
`;

const BackgroundGlow = styled(motion.div)`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  z-index: 0;
  pointer-events: none;
`;

const LayoutWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 10;
  height: 460px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 40px 20px;
    gap: 40px;
  }
`;

const ContentPanel = styled(motion.div)`
  width: 45%;
  position: absolute;
  left: 5%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: white;

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    left: 0;
    align-items: center;
    text-align: center;
  }

  h2 {
    font-size: 3rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #fff, #a0a0a0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 1.25rem;
    color: #a0a0a0;
    margin: 0;
  }

  .visual-container {
    width: 100%;
    height: 180px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
  }

  .feature {
    font-size: 1rem;
    color: #888;
    line-height: 1.6;
    margin: 0;
  }

  .cta {
    padding: 14px 28px;
    border-radius: 30px;
    border: none;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    align-self: flex-start;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);

    @media (max-width: 768px) {
      align-self: center;
    }
  }
`;

const WalletSection = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
  
  @media (min-width: 769px) {
    position: absolute;
    right: 0;
    top: 0;
  }
`;

const CardWrapper = styled(motion.div)`
  cursor: pointer;
  transform-origin: bottom center;
`;

const StyledWrapper = styled.div<{ $hasActive: boolean }>`
  /* Wallet Wrapper */
  .wallet {
    position: relative;
    width: 280px;
    height: 230px;
    cursor: pointer;
    perspective: 1000px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
  
  .wallet::after {
    content: "Click a card to explore";
    position: absolute;
    bottom: -40px;
    font-style: italic;
    color: rgba(255, 255, 255, 0.4);
    font-size: 14px;
    font-weight: 400;
    opacity: ${props => props.$hasActive ? 0 : 1};
    transition: opacity 0.3s ease;
  }

  @keyframes slideIntoPocket {
    0% { transform: translateY(-100px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }

  .wallet-back {
    position: absolute;
    bottom: 0;
    width: 280px;
    height: 200px;
    background: #111111;
    border-radius: 22px 22px 60px 60px;
    z-index: 5;
    box-shadow: inset 0 25px 35px rgba(0, 0, 0, 0.6), inset 0 5px 15px rgba(0, 0, 0, 0.8), 0 10px 20px rgba(0,0,0,0.5);
  }

  /* Cards */
  .card {
    position: absolute;
    width: 260px;
    height: 140px;
    left: 10px;
    border-radius: 16px;
    padding: 18px;
    color: white;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.3), 0 -4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease, filter 0.4s ease;
    animation: slideIntoPocket 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
  }

  .card.active {
    transform: translateY(-80px) scale(1.05) translateZ(50px) !important;
    z-index: 100 !important;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.6);
    filter: brightness(1.1);
  }

  .card.inactive {
    opacity: 0.6;
    filter: blur(2px) brightness(0.7);
    transform: translateY(10px) scale(0.95) !important;
  }

  .card-inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .chip {
    width: 32px;
    height: 24px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .label { font-size: 8px; opacity: 0.7; text-transform: uppercase; margin-bottom: 2px; display: block; }
  .value { font-size: 10px; font-weight: 500; }
  .card-number-wrapper { text-align: right; }
  .hidden-stars { font-size: 16px; letter-spacing: 2px; }
  .card-number { display: none; font-size: 14px; letter-spacing: 1px; font-family: monospace; }

  /* card variants */
  .stripe { background: #FFEA00; color: #121212; bottom: 90px; z-index: 10; animation-delay: 0.1s; }
  .stripe .chip { background: rgba(0, 0, 0, 0.1); border: 1px solid rgba(0, 0, 0, 0.1); }
  .stripe .label { color: rgba(0,0,0,0.6); }

  .wise { background: #222222; bottom: 65px; z-index: 20; animation-delay: 0.2s; }
  
  .paypal { background: #ffffff; color: #121212; bottom: 40px; z-index: 30; animation-delay: 0.3s; }
  .paypal .chip { background: rgba(0, 0, 0, 0.05); border: 1px solid rgba(0, 0, 0, 0.1); }
  .paypal .label { color: #8c979d; }

  /* Pocket */
  .pocket {
    position: absolute;
    bottom: 0;
    width: 280px;
    height: 160px;
    z-index: 40;
    filter: drop-shadow(0 15px 25px rgba(20, 40, 20, 0.4));
  }

  .pocket-content {
    position: absolute;
    top: 45px;
    width: 100%;
    text-align: center;
    z-index: 50;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .balance-stars { color: #666666; font-size: 24px; letter-spacing: 4px; transition: 0.3s; }
  .balance-real { color: #ffffff; font-size: 22px; font-weight: 600; opacity: 0; position: absolute; top: 0; left: 50%; transform: translate(-50%, 10px); transition: 0.3s; }
  
  .eye-icon-wrapper { margin-top: 8px; height: 20px; width: 20px; position: relative; opacity: 0.3; transition: 0.3s; }
  .eye-icon { position: absolute; top: 0; left: 0; stroke: #FFEA00; transition: 0.3s; }

  /* Default hovers when NO card is active */
  ${props => !props.$hasActive && `
    .wallet:hover .eye-icon-wrapper { opacity: 1; }
    .wallet:hover .stripe { transform: translateY(-75px) rotate(-3deg); }
    .wallet:hover .wise { transform: translateY(-45px) rotate(2deg); }
    .wallet:hover .paypal { transform: translateY(-10px); }

    .card:hover .hidden-stars { display: none; }
    .card:hover .card-number { display: block; }

    .wallet:hover .balance-stars { opacity: 0; }
    .wallet:hover .balance-real { opacity: 1; transform: translate(-50%, 0); }
    .wallet:hover .eye-slash { opacity: 0; transform: scale(0.5); }
    .wallet:hover .eye-open { opacity: 1; transform: scale(1.1); }
  `}
  
  ${props => props.$hasActive && `
    .card-number { display: block; }
    .hidden-stars { display: none; }
  `}
`;

export default WalletCards;

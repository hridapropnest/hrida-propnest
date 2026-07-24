import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Crown, 
  Lock, 
  Unlock,
  ChevronRight, 
  Compass,
  Building
} from "lucide-react";

export function HpLogo({ className = "w-16 h-16", glow = true }: { className?: string; glow?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="gold-gradient-logo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdf6e2" />
          <stop offset="40%" stopColor="#d4af37" />
          <stop offset="70%" stopColor="#aa814c" />
          <stop offset="100%" stopColor="#fcf2d9" />
        </linearGradient>
        {glow && (
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>
      
      {/* Left leg of H */}
      <path 
        d="M 32 18 L 32 80" 
        stroke="url(#gold-gradient-logo)" 
        strokeWidth="6" 
        strokeLinecap="round" 
        filter={glow ? "url(#gold-glow)" : undefined}
      />
      {/* Right leg of H / Stem of P */}
      <path 
        d="M 60 18 L 60 80" 
        stroke="url(#gold-gradient-logo)" 
        strokeWidth="6" 
        strokeLinecap="round"
        filter={glow ? "url(#gold-glow)" : undefined}
      />
      {/* Roof forming the H crossbar */}
      <path 
        d="M 32 50 L 46 35 L 60 50" 
        stroke="url(#gold-gradient-logo)" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter={glow ? "url(#gold-glow)" : undefined}
      />
      {/* Loop of P */}
      <path 
        d="M 60 18 H 76 C 86 18 86 45 76 45 H 60" 
        stroke="url(#gold-gradient-logo)" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter={glow ? "url(#gold-glow)" : undefined}
      />
      {/* House window with 4 panes */}
      <rect 
        x="40" 
        y="56" 
        width="12" 
        height="12" 
        stroke="url(#gold-gradient-logo)" 
        strokeWidth="2" 
        filter={glow ? "url(#gold-glow)" : undefined}
      />
      <line 
        x1="46" 
        y1="56" 
        x2="46" 
        y2="68" 
        stroke="url(#gold-gradient-logo)" 
        strokeWidth="2" 
        filter={glow ? "url(#gold-glow)" : undefined}
      />
      <line 
        x1="40" 
        y1="62" 
        x2="52" 
        y2="62" 
        stroke="url(#gold-gradient-logo)" 
        strokeWidth="2" 
        filter={glow ? "url(#gold-glow)" : undefined}
      />
    </svg>
  );
}

interface ComingSoonProps {
  onUnlock: () => void;
}

export function ComingSoon({ onUnlock }: ComingSoonProps) {
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);

  const luxuryLocations = [
    "MALABAR HILL RESIDENCES",
    "WORLI SEAFACE PENTHOUSES",
    "BANDRA BANDSTAND MANORS",
    "CUFFE PARADE ESTATES",
    "JUHU BEACHFRONT VILLAS",
    "MUMBAI SEAFACE ESTATES",
    "DUBAI HILLS MANSIONS",
    "BEL-AIR PRIVATE RETREATS",
    "MONACO HARBOUR PENTHOUSES",
    "LONDON MAYFAIR RESIDENCES"
  ];

  // Rotate luxury locations for cinematic effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocationIndex(prev => (prev + 1) % luxuryLocations.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toUpperCase() === "HRIDA2026") {
      setPasscodeError("");
      setShowPasscodeModal(false);
      localStorage.setItem("hrida_vip_unlocked", "true");
      onUnlock();
    } else {
      setPasscodeError("Invalid Exclusive Passcode. Please try again.");
    }
  };

  const comingSoonText = "COMING SOON";

  return (
    <div className="relative min-h-screen bg-stone-950 font-sans text-stone-100 overflow-hidden select-none flex flex-col justify-between">
      
      {/* Cinematic Spotlights (Left and Right Sweeping Beams) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Left Spotlight */}
        <motion.div 
          className="absolute bottom-0 left-[15%] w-[450px] h-[120vh] origin-bottom blur-3xl opacity-20 bg-gradient-to-t from-cyan-800/20 via-cyan-600/10 to-transparent"
          animate={{
            rotate: [-20, 15, -20],
            scaleX: [1, 1.25, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Right Spotlight */}
        <motion.div 
          className="absolute bottom-0 right-[15%] w-[450px] h-[120vh] origin-bottom blur-3xl opacity-25 bg-gradient-to-t from-teal-800/20 via-cyan-700/10 to-transparent"
          animate={{
            rotate: [15, -20, 15],
            scaleX: [1.2, 0.9, 1.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Center Golden Aura Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />
      </div>

      {/* Floating Golden Dust Particles */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-cyan-200 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 1.6, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer select-none">
          <HpLogo className="w-9 h-9" glow={false} />
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 via-cyan-400 to-cyan-600 uppercase leading-none">
              HRIDA
            </span>
            <span className="text-[7px] font-sans font-black tracking-[0.3em] text-cyan-400 uppercase leading-none mt-1">
              — PROPNEST —
            </span>
            <span className="text-[5px] font-sans font-bold tracking-[0.4em] text-cyan-400/80 uppercase leading-none mt-1 pl-0.5">
              FIND | INVEST | GROW
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(212, 175, 55, 0.25)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPasscodeModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-900/90 border border-cyan-500/30 text-[11px] font-mono font-semibold text-cyan-400 tracking-wider hover:bg-stone-900 transition-all cursor-pointer shadow-lg"
          >
            <Crown size={12} className="text-cyan-400 animate-pulse" />
            <span>VIP ENTRANCE</span>
          </motion.button>
        </div>
      </header>

      {/* Main Centered Content Area */}
      <main className="relative z-10 max-w-4xl w-full mx-auto px-6 flex flex-col items-center justify-center text-center py-12 my-auto space-y-10">
        
        {/* Animated Golden HP Monogram Emblem & Rings */}
        <div className="flex flex-col items-center select-none">
          <div className="relative flex items-center justify-center h-28 w-28 mb-6">
            {/* Outer Pulsing Glow Ring */}
            <motion.div 
              className="absolute inset-0 rounded-full border border-cyan-500/20"
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Middle Rotating Dashed Ring */}
            <motion.div 
              className="absolute inset-2 rounded-full border border-dashed border-cyan-500/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner Glow Base with HP Monogram */}
            <div className="absolute inset-4 rounded-full bg-stone-950 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(204,168,95,0.15)]">
              <HpLogo className="w-14 h-14 drop-shadow-[0_2px_10px_rgba(204,168,95,0.4)]" glow={true} />
            </div>
          </div>

          {/* Full Logo Typography replicating the image */}
          <div className="flex flex-col items-center mb-6">
            <h1 className="font-serif font-black text-5xl sm:text-6xl tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 via-cyan-400 to-cyan-600 uppercase leading-none pl-[0.1em]">
              HRIDA
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-cyan-500/60" />
              <span className="text-[11px] font-sans font-black tracking-[0.3em] text-cyan-400 uppercase leading-none">
                PROPNEST
              </span>
              <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-cyan-500/60" />
            </div>
            <p className="text-[8px] sm:text-[9px] font-sans font-bold tracking-[0.55em] text-cyan-400/80 uppercase leading-none mt-3.5 pl-[0.55em]">
              FIND | INVEST | GROW
            </p>
          </div>
        </div>

        {/* Coming Soon Text */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-cyan-950/40 border border-cyan-800/40 rounded-full px-4 py-1">
            <Sparkles size={12} className="text-cyan-400 animate-spin-slow" />
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-cyan-400 font-bold">The Grand Curtains Await</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-semibold tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-b from-white to-stone-400 uppercase leading-none pl-[0.35em]">
            COMING SOON
          </h2>

          <p className="text-xs tracking-wider text-cyan-300/70 max-w-md mx-auto uppercase font-mono">
            Mumbai's Ultra-Luxury Real Estate Portal
          </p>
        </div>

        {/* Centered Golden Carpet Entrance Visualizer */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="relative h-48 w-full max-w-lg overflow-hidden rounded-3xl border border-stone-800/80 bg-stone-900/10 backdrop-blur-md p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-end"
        >
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent pointer-events-none z-10" />

          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[9px] uppercase font-mono tracking-widest text-stone-500 font-bold flex items-center gap-1.5">
            <Building size={10} className="text-cyan-500" />
            <span>Virtual VIP Entrance Walkway</span>
          </div>

          {/* Glowing grand double doors representation at the top */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-1.5 items-end z-10">
            <motion.div 
              className="w-12 h-16 bg-stone-900 border-t border-x border-cyan-500/50 rounded-t shadow-[0_-5px_15px_rgba(204,168,95,0.2)] flex items-center justify-center cursor-pointer"
              whileHover={{ borderColor: "#cca85f", boxShadow: "0_-5px_25px_rgba(204,168,95,0.4)" }}
            >
              <Crown size={12} className="text-cyan-500/40" />
            </motion.div>
            <motion.div 
              className="w-12 h-16 bg-stone-900 border-t border-x border-cyan-500/50 rounded-t shadow-[0_-5px_15px_rgba(204,168,95,0.2)] flex items-center justify-center cursor-pointer"
              whileHover={{ borderColor: "#cca85f", boxShadow: "0_-5px_25px_rgba(204,168,95,0.4)" }}
            >
              <Crown size={12} className="text-cyan-500/40" />
            </motion.div>
          </div>

          {/* Glowing Spotlight guides pointing at the doors */}
          <div className="absolute top-10 left-[41%] w-1.5 h-16 bg-gradient-to-b from-cyan-400/80 to-transparent blur-[1px] rotate-12 origin-top animate-pulse" />
          <div className="absolute top-10 right-[41%] w-1.5 h-16 bg-gradient-to-b from-cyan-400/80 to-transparent blur-[1px] -rotate-12 origin-top animate-pulse" />

          {/* 3D Perspective Golden Carpet Runner */}
          <div className="relative w-full h-24 flex justify-center z-10">
            <motion.div 
              className="w-24 h-full bg-gradient-to-t from-cyan-600 via-cyan-700 to-cyan-900 shadow-[0_0_25px_rgba(204,168,95,0.5)]"
              style={{
                clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
                transform: "perspective(120px) rotateX(8deg)",
                transformOrigin: "bottom center"
              }}
              animate={{
                boxShadow: [
                  "0_0_25px_rgba(204,168,95,0.4)",
                  "0_0_35px_rgba(204,168,95,0.6)",
                  "0_0_25px_rgba(204,168,95,0.4)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Left Stanchions (Gold Poles with glowing lights) */}
            <div className="absolute left-[26%] top-6 bottom-0 flex flex-col justify-between items-center py-2">
              <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(204,168,95,0.8)]" />
              <div className="w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(204,168,95,0.8)]" />
              <div className="w-1 h-9 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(204,168,95,0.8)]" />
            </div>

            {/* Right Stanchions */}
            <div className="absolute right-[26%] top-6 bottom-0 flex flex-col justify-between items-center py-2">
              <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(204,168,95,0.8)]" />
              <div className="w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(204,168,95,0.8)]" />
              <div className="w-1 h-9 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(204,168,95,0.8)]" />
            </div>

            {/* Golden ropes connecting stanchions */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-80">
              {/* Left ropes */}
              <path d="M 160 18 Q 170 24 172 42" stroke="#b38e46" strokeWidth="1.5" fill="none" />
              <path d="M 172 42 Q 182 56 184 85" stroke="#b38e46" strokeWidth="2.5" fill="none" />
              {/* Right ropes */}
              <path d="M 322 18 Q 312 24 310 42" stroke="#b38e46" strokeWidth="1.5" fill="none" />
              <path d="M 310 42 Q 300 56 298 85" stroke="#b38e46" strokeWidth="2.5" fill="none" />
            </svg>
          </div>
        </motion.div>

        {/* Crossfading Luxury Locations Ticker */}
        <div className="h-10 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLocationIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex items-center gap-2.5 text-xs font-mono font-bold text-stone-500 tracking-[0.3em]"
            >
              <Compass size={12} className="text-amber-500/60 animate-spin-slow" />
              <span>{luxuryLocations[currentLocationIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Luxury Statement */}
        <p className="text-xs text-stone-500 max-w-lg mx-auto font-mono leading-relaxed tracking-wide">
          Our private portal is undergoing verified compliance review. Private investor, family office, or broker verification is active.
        </p>

      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 border-t border-stone-900 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-600 font-mono">
        <p>© {new Date().getFullYear()} Hrida Propnest Premium Real Estate. All rights reserved.</p>
        <div className="flex items-center gap-3">
          <span className="text-stone-700">|</span>
          <span className="uppercase text-[9px] tracking-wider text-amber-500/60 font-semibold">PREMIERE PRIVATE PORTFOLIO</span>
        </div>
      </footer>

      {/* Passcode Modal (VIP Pass Code input) */}
      <AnimatePresence>
        {showPasscodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowPasscodeModal(false); setPasscodeError(""); }}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10"
            >
              <button 
                onClick={() => { setShowPasscodeModal(false); setPasscodeError(""); }}
                className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                  <Lock size={18} className="text-amber-400 animate-pulse" />
                </div>
                <h3 className="text-md uppercase font-mono font-bold text-white tracking-widest">
                  ENTER VIP PASSCODE
                </h3>
                <p className="text-xs text-stone-500 font-sans mt-1">
                  Private investor access or developer verification
                </p>
              </div>

              <form onSubmit={handleVerifyPasscode} className="space-y-4">
                <div>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter Private Passcode..."
                    className="w-full rounded-xl border border-stone-800 bg-stone-950 text-center py-3 text-sm font-mono tracking-widest text-amber-400 placeholder-stone-700 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 focus:outline-none transition-all shadow-inner uppercase"
                  />
                  {passcodeError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-red-400 font-mono text-center mt-2"
                    >
                      {passcodeError}
                    </motion.p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-stone-950 font-mono font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-lg hover:from-amber-300 hover:to-amber-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Unlock size={13} />
                    <span>VERIFY & DRAW CURTAINS</span>
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// X icon for closing
function X({ size, className }: { size?: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

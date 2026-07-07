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
          className="absolute bottom-0 left-[15%] w-[450px] h-[120vh] origin-bottom blur-3xl opacity-20 bg-gradient-to-t from-red-600/30 via-amber-500/20 to-cyan-400/5"
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
          className="absolute bottom-0 right-[15%] w-[450px] h-[120vh] origin-bottom blur-3xl opacity-25 bg-gradient-to-t from-red-600/30 via-amber-500/25 to-amber-300/5"
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />
      </div>

      {/* Floating Golden Dust Particles */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-amber-400 to-amber-200 rounded-full"
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
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-200 italic">
            HRIDA
          </span>
          <div className="rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-widest text-red-400 uppercase">
            PROPNEST
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(245, 158, 11, 0.25)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPasscodeModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-900/90 border border-amber-500/30 text-[11px] font-mono font-semibold text-amber-400 tracking-wider hover:bg-stone-900 transition-all cursor-pointer shadow-lg"
          >
            <Crown size={12} className="text-amber-400 animate-pulse" />
            <span>VIP ENTRANCE</span>
          </motion.button>
        </div>
      </header>

      {/* Main Centered Content Area */}
      <main className="relative z-10 max-w-4xl w-full mx-auto px-6 flex flex-col items-center justify-center text-center py-12 my-auto space-y-12">
        
        {/* Animated Golden Crown Emblem & Rings */}
        <div className="relative flex items-center justify-center h-28 w-28">
          {/* Outer Pulsing Glow Ring */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-amber-500/20"
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Middle Rotating Dashed Ring */}
          <motion.div 
            className="absolute inset-2 rounded-full border border-dashed border-amber-500/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          {/* Inner Glow Base */}
          <div className="absolute inset-4 rounded-full bg-stone-950 border border-amber-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <Crown size={28} className="text-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]" />
          </div>
        </div>

        {/* Luxury Coming Soon Letters Animation */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-950/40 border border-red-800/40 rounded-full px-4 py-1">
            <Sparkles size={12} className="text-amber-400 animate-spin-slow" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">The Grand Curtains Await</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-white uppercase flex flex-wrap justify-center gap-x-4">
            {comingSoonText.split(" ").map((word, wordIdx) => (
              <span key={wordIdx} className="inline-flex">
                {word.split("").map((letter, charIdx) => (
                  <motion.span
                    key={charIdx}
                    initial={{ opacity: 0, y: 25, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.8,
                      delay: (wordIdx * 4 + charIdx) * 0.08,
                      ease: [0.25, 1, 0.5, 1]
                    }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-stone-100 to-stone-400 hover:text-amber-400 transition-colors duration-300"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <p className="text-lg font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 max-w-xl mx-auto uppercase">
            Mumbai's Ultra-Luxury Real Estate Portal — Grand Premiere Coming Soon
          </p>
        </div>

        {/* Centered Red Carpet Entrance Visualizer (Grown & Polished) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="relative h-48 w-full max-w-lg overflow-hidden rounded-3xl border border-stone-800/80 bg-stone-900/10 backdrop-blur-md p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-end"
        >
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent pointer-events-none z-10" />

          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[9px] uppercase font-mono tracking-widest text-stone-500 font-bold flex items-center gap-1.5">
            <Building size={10} className="text-amber-500" />
            <span>Virtual VIP Entrance Walkway</span>
          </div>

          {/* Glowing grand double doors representation at the top */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-1.5 items-end z-10">
            <motion.div 
              className="w-12 h-16 bg-stone-900 border-t border-x border-amber-500/50 rounded-t shadow-[0_-5px_15px_rgba(245,158,11,0.2)] flex items-center justify-center cursor-pointer"
              whileHover={{ borderColor: "#f59e0b", boxShadow: "0_-5px_25px_rgba(245,158,11,0.4)" }}
            >
              <Crown size={12} className="text-amber-500/40" />
            </motion.div>
            <motion.div 
              className="w-12 h-16 bg-stone-900 border-t border-x border-amber-500/50 rounded-t shadow-[0_-5px_15px_rgba(245,158,11,0.2)] flex items-center justify-center cursor-pointer"
              whileHover={{ borderColor: "#f59e0b", boxShadow: "0_-5px_25px_rgba(245,158,11,0.4)" }}
            >
              <Crown size={12} className="text-amber-500/40" />
            </motion.div>
          </div>

          {/* Glowing Spotlight guides pointing at the doors */}
          <div className="absolute top-10 left-[41%] w-1.5 h-16 bg-gradient-to-b from-amber-400/80 to-transparent blur-[1px] rotate-12 origin-top animate-pulse" />
          <div className="absolute top-10 right-[41%] w-1.5 h-16 bg-gradient-to-b from-amber-400/80 to-transparent blur-[1px] -rotate-12 origin-top animate-pulse" />

          {/* 3D Perspective Red Carpet Runner */}
          <div className="relative w-full h-24 flex justify-center z-10">
            <motion.div 
              className="w-24 h-full bg-gradient-to-t from-red-600 via-red-700 to-rose-900 shadow-[0_0_25px_rgba(220,38,38,0.5)]"
              style={{
                clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
                transform: "perspective(120px) rotateX(8deg)",
                transformOrigin: "bottom center"
              }}
              animate={{
                boxShadow: [
                  "0_0_25px_rgba(220,38,38,0.4)",
                  "0_0_35px_rgba(220,38,38,0.6)",
                  "0_0_25px_rgba(220,38,38,0.4)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Left Stanchions (Gold Poles with glowing lights) */}
            <div className="absolute left-[26%] top-6 bottom-0 flex flex-col justify-between items-center py-2">
              <div className="w-1 h-4 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <div className="w-1 h-6 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <div className="w-1 h-9 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            </div>

            {/* Right Stanchions */}
            <div className="absolute right-[26%] top-6 bottom-0 flex flex-col justify-between items-center py-2">
              <div className="w-1 h-4 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <div className="w-1 h-6 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <div className="w-1 h-9 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            </div>

            {/* Velvet ropes connecting stanchions */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-80">
              {/* Left ropes */}
              <path d="M 160 18 Q 170 24 172 42" stroke="#dc2626" strokeWidth="1.5" fill="none" />
              <path d="M 172 42 Q 182 56 184 85" stroke="#dc2626" strokeWidth="2.5" fill="none" />
              {/* Right ropes */}
              <path d="M 322 18 Q 312 24 310 42" stroke="#dc2626" strokeWidth="1.5" fill="none" />
              <path d="M 310 42 Q 300 56 298 85" stroke="#dc2626" strokeWidth="2.5" fill="none" />
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

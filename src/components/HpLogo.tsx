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
    <img 
      src="/logo.png" 
      alt="Hrida Propnest Logo" 
      className={`${className} object-contain ${glow ? 'drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]' : ''}`}
    />
  );
}

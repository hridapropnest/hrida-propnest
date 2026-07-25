import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Lock, X, Check, ShieldAlert } from "lucide-react";

interface BrokerAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
}

export function BrokerAccessModal({
  isOpen,
  onClose,
  onSuccess,
}: BrokerAccessModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const CORRECT_PIN = import.meta.env.VITE_BROKER_PIN || "4040";

  useEffect(() => {
    if (!isOpen) {
      setPin("");
      setError(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        if (pin.length < 4) {
          setPin((p) => p + e.key);
          setError(false);
        }
      } else if (e.key === "Backspace") {
        setPin((p) => p.slice(0, -1));
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, pin]);

  useEffect(() => {
    if (pin.length !== 4) return;

    if (pin === CORRECT_PIN) {
      localStorage.setItem("hrida_vip_unlocked", "true");

      onSuccess(pin);

      onClose();

      setPin("");
    } else {
      setError(true);
      setShaking(true);

      setTimeout(() => {
        setPin("");
        setShaking(false);
      }, 500);
    }
  }, [pin]);

  const addDigit = (d: string) => {
    if (pin.length < 4) {
      setPin((p) => p + d);
      setError(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ scale: .9, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              x: shaking ? [0, -10, 10, -10, 10, 0] : 0
            }}
            exit={{ scale: .9, opacity: 0 }}
            className="relative w-[360px] rounded-3xl bg-stone-950/90 backdrop-blur-3xl border border-yellow-500/20 shadow-[0_0_50px_rgba(212,175,55,0.15)] p-8 overflow-hidden"
          >
            {/* Elegant corner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] pointer-events-none rounded-full" />
            
            <button
              onClick={onClose}
              className="absolute right-5 top-5 bg-white/5 hover:bg-white/10 text-stone-400 hover:text-yellow-400 rounded-full p-2 transition-colors"
            >
              <X size={16}/>
            </button>

            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-b from-stone-800 to-stone-900 border border-stone-700 shadow-inner">
                <Lock className="text-yellow-500 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" size={34}/>
              </div>
            </div>

            <h2 className="font-serif font-bold text-2xl text-center text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 uppercase tracking-wider">
              Broker Access
            </h2>

            <p className="text-center text-stone-400 uppercase tracking-widest font-mono text-[10px] mt-3">
              Enter VIP Passcode
            </p>

            <div className="flex justify-center gap-4 mt-8">
              {[0,1,2,3].map(i=>(
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                    pin.length>i
                      ? "bg-yellow-500 border-yellow-500 shadow-[0_0_10px_rgba(212,175,55,0.5)] scale-110"
                      : "border-stone-700 bg-stone-900/50"
                  }`}
                />
              ))}
            </div>

            {error && (
              <div className="text-red-400 text-[11px] font-mono tracking-widest uppercase text-center mt-4 flex justify-center items-center gap-1.5">
                <ShieldAlert size={14}/>
                Access Denied
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mt-8 relative z-10">
              {[1,2,3,4,5,6,7,8,9].map(n=>(
                <button
                  key={n}
                  onClick={()=>addDigit(n.toString())}
                  className="h-14 rounded-2xl bg-stone-900/50 border border-stone-800 hover:border-yellow-500/40 hover:bg-yellow-500/10 text-stone-300 hover:text-yellow-400 font-mono text-xl transition-all"
                >
                  {n}
                </button>
              ))}

              <button
                onClick={()=>setPin("")}
                className="h-14 rounded-2xl bg-stone-900/30 border border-stone-800/50 hover:border-stone-700 text-stone-500 hover:text-stone-300 font-mono text-xs tracking-widest uppercase transition-all"
              >
                Clear
              </button>

              <button
                onClick={()=>addDigit("0")}
                className="h-14 rounded-2xl bg-stone-900/50 border border-stone-800 hover:border-yellow-500/40 hover:bg-yellow-500/10 text-stone-300 hover:text-yellow-400 font-mono text-xl transition-all"
              >
                0
              </button>

              <button
                onClick={()=>setPin(pin.slice(0,-1))}
                className="h-14 rounded-2xl bg-stone-900/30 border border-stone-800/50 hover:border-stone-700 text-stone-500 hover:text-stone-300 font-mono text-lg transition-all"
              >
                ⌫
              </button>
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
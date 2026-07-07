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
            className="absolute inset-0 bg-black/80"
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
            className="relative w-[360px] rounded-2xl bg-stone-900 border border-stone-700 p-6"
          >

            <button
              onClick={onClose}
              className="absolute right-4 top-4"
            >
              <X size={18}/>
            </button>

            <div className="flex justify-center mb-4">
              <Lock className="text-cyan-400" size={34}/>
            </div>

            <h2 className="text-white text-center font-bold text-xl">
              Broker Access
            </h2>

            <p className="text-center text-stone-400 text-xs mt-2">
              Enter Broker PIN
            </p>

            <div className="flex justify-center gap-3 mt-8">
              {[0,1,2,3].map(i=>(
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 ${
                    pin.length>i
                      ? "bg-cyan-400 border-cyan-400"
                      : "border-stone-600"
                  }`}
                />
              ))}
            </div>

            {error && (
              <div className="text-red-400 text-xs text-center mt-3 flex justify-center gap-1">
                <ShieldAlert size={14}/>
                Wrong PIN
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mt-8">

              {[1,2,3,4,5,6,7,8,9].map(n=>(
                <button
                  key={n}
                  onClick={()=>addDigit(n.toString())}
                  className="h-12 rounded-xl bg-stone-800 hover:bg-cyan-500 hover:text-black"
                >
                  {n}
                </button>
              ))}

              <button
                onClick={()=>setPin("")}
                className="h-12 rounded-xl bg-stone-800"
              >
                Clear
              </button>

              <button
                onClick={()=>addDigit("0")}
                className="h-12 rounded-xl bg-stone-800"
              >
                0
              </button>

              <button
                onClick={()=>setPin(pin.slice(0,-1))}
                className="h-12 rounded-xl bg-stone-800"
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
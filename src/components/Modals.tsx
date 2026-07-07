import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock,Loader2, User, Mail, Phone, Home, DollarSign, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import { Property } from "../types";
import { WhatsAppIcon } from "../App";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperty?: Property;
  properties: Property[];
  onLeadCaptured: () => void;
}

export function BookingModal({ isOpen, onClose, selectedProperty, properties, onLeadCaptured }: BookingModalProps) {
  const [propertyId, setPropertyId] = useState(selectedProperty?.id || properties[0]?.id || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const selectedPropObj = properties.find((p) => p.id === propertyId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
const cleanEmail = email.trim();
const cleanPhone = phone.trim();
const cleanNotes = notes.trim();
    if (!cleanName || !cleanEmail || !date || !time) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          budget: selectedPropObj ? selectedPropObj.priceText : "Luxury Budget",
          propertyInterest: selectedPropObj ? `Booking Tour: ${selectedPropObj.name} (${selectedPropObj.location})` : "General Tour Booking",
          message: `Requested date: ${date} at ${time}. Client message: ${cleanNotes}`,
        }),
      });

      if (!response.ok) {
  throw new Error("Unable to submit booking.");
}

const data = await response.json();
      if (data.success) {
        setSuccess(true);
        onLeadCaptured();
        // Reset form
        const timer = window.setTimeout(() => {
          onClose();
          setSuccess(false);
          setName("");
          setEmail("");
          setPhone("");
          setDate("");
          setTime("");
          setNotes("");
          setPropertyId(properties[0]?.id || "");
        }, 3000);
      } else {
        setError(data.error || "Failed to submit. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
  if (!submitting) onClose();
}}
            className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-2xl md:p-8"
          >
            <button
              id="close-booking-modal"
              aria-label="Close Booking Modal"
              onClick={() => {
  if (!submitting) onClose();
}}
              className="absolute top-4 right-4 rounded-full p-1 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="mb-4 rounded-full bg-emerald-500/10 p-4 text-emerald-400">
                  <CheckCircle size={48} className="animate-bounce" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-white">Namaste! Private Tour Requested</h3>
                <p className="mt-2 text-stone-400 max-w-sm">
                  We have registered your private tour request for <strong className="text-stone-200">{selectedPropObj?.name || "the property"}</strong> on <span className="text-cyan-400 font-mono">{date}</span> at <span className="text-cyan-400 font-mono">{time}</span>.
                </p>
                <p className="mt-4 text-xs text-stone-500">Elena has informed our lead estate concierge.</p>
              </motion.div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-semibold tracking-widest text-cyan-400 uppercase font-mono">Elite VIP Experience</span>
                  <h3 className="font-display text-2xl font-bold text-white mt-1">Book a Private Tour</h3>
                  <p className="text-sm text-stone-400">Experience world-class real estate with local expert guidance.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-400 border border-rose-500/20">
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Property Selector */}
                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-stone-400 uppercase mb-1.5 font-mono">Select Villa</label>
                    <div className="relative">
                      <Home size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                      <select
                        id="booking-property-select"
                        value={propertyId}
                        onChange={(e) => setPropertyId(e.target.value)}
                        className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 pl-10 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                      >
                        {properties.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — {p.location} ({p.priceText})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-stone-400 uppercase mb-1.5 font-mono">Full Name *</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                      <input
                        id="booking-name-input"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold tracking-wider text-stone-400 uppercase mb-1.5 font-mono">Email Address *</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                        <input
                          id="booking-email-input"
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold tracking-wider text-stone-400 uppercase mb-1.5 font-mono">Phone Number</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                        <input
                          id="booking-phone-input"
                          type="tel"
                          pattern="[0-9+\-\s]{10,15}"
                          placeholder="+1 (555) 019-2834"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date & Time Grid */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold tracking-wider text-stone-400 uppercase mb-1.5 font-mono">Preferred Date *</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                        <input
                          id="booking-date-input"
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 pl-10 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold tracking-wider text-stone-400 uppercase mb-1.5 font-mono">Preferred Time *</label>
                      <div className="relative">
                        <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                        <input
                          id="booking-time-input"
                          type="time"
                          required
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 pl-10 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-stone-400 uppercase mb-1.5 font-mono">Special requests</label>
                    <textarea
                      id="booking-notes-input"
                      rows={2}
                      placeholder="E.g., virtual tour preferred, interested in specific financing options..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl border border-stone-800 bg-stone-950 p-3 text-sm text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                    />
                  </div>

                  {/* Submit button */}
                  <motion.button
                    id="booking-submit-btn"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={submitting}
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-3 text-sm font-semibold text-black shadow-lg shadow-cyan-500/15 hover:shadow-cyan-500/25 focus:outline-none disabled:opacity-50 transition-all cursor-pointer flex justify-center items-center gap-2"
                  >
                    {submitting ? (
  <div className="flex items-center gap-2">
    <Loader2 size={16} className="animate-spin" />
    Securing Tour...
  </div>
) : (
  "Confirm Private Tour VIP Booking"
)}
                  </motion.button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCaptured: () => void;
}

export function CallModal({ isOpen, onClose, onLeadCaptured }: CallModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCallRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    if (!cleanName || !cleanPhone) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: "callback-request@local",
          phone: cleanPhone,
          budget: "Flexible / Not disclosed",
          propertyInterest: "Immediate Callback Request",
          message: "Requesting a rapid callback from a Hrida Propnest senior agent.",
        }),
      });

      if (!response.ok) {
  throw new Error("Unable to request callback.");
}

const data = await response.json();
      if (data.success) {
        setSuccess(true);
        onLeadCaptured();
        const timer = window.setTimeout(() => {
          onClose();
          setSuccess(false);
          setName("");
          setPhone("");
        }, 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
  if (!submitting) onClose();
}}
            className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-2xl text-center"
          >
            <button
              id="close-call-modal"
              aria-label="Close Call Modal"
              onClick={() => {
  if (!submitting) onClose();
}}
              className="absolute top-4 right-4 rounded-full p-1 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            {success ? (
              <div className="py-8">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <CheckCircle size={28} className="animate-bounce" />
                </div>
                <h4 className="font-display text-xl font-bold text-white">Call Registered!</h4>
                <p className="mt-2 text-sm text-stone-400">
                  A senior broker will reach you at <span className="font-mono text-cyan-400">{phone}</span> in less than 5 minutes.
                </p>
              </div>
            ) : (
              <div>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 animate-pulse">
                  <Phone size={24} />
                </div>
                <h4 className="font-display text-xl font-bold text-white">Direct Agent Hotline</h4>
                <p className="mt-2 text-xs text-stone-400">
                  Have immediate questions? Request an instant callback from our premium Mumbai brokerage desk.
                </p>

                <form onSubmit={handleCallRequest} className="mt-6 space-y-3">
                  <input
                    id="call-name-input"
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-sm text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none"
                  />
                  <input
                    id="call-phone-input"
                    type="tel"
                    required
                    placeholder="Your Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-sm text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none font-mono"
                  />

                  <motion.button
                    id="call-submit-btn"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-2.5 text-sm font-semibold text-black hover:shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
  <div className="flex items-center gap-2">
    <Loader2 size={16} className="animate-spin" />
    Requesting Call...
  </div>
) : (
  "Call Me Now"
)}
                  </motion.button>
                </form>

                <div className="mt-4 border-t border-stone-800/60 pt-4 flex flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono block">Or Dial Directly</span>
                    <p className="mt-1 font-display text-base sm:text-lg font-bold text-white font-mono hover:text-cyan-400 transition-colors">
                      <a id="hotline-phone-link" href="tel:+919819876103">+91 98198 76103</a>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono block">WhatsApp Desk</span>
                    <p className="mt-1">
                      <a 
                        href="https://wa.me/919819876103" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-mono font-bold transition-colors"
                      >
                        <WhatsAppIcon size={12} />
                        <span>Chat Now</span>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

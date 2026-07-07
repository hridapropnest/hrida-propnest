import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, 
  MessageSquare, 
  PlusCircle, 
  Menu, 
  X, 
  ChevronRight, 
  MapPin, 
  Compass, 
  ArrowRight, 
  User, 
  ChevronLeft, 
  SlidersHorizontal,
  LayoutGrid,
  TrendingUp,
  Sparkles,
  Building,
  CheckCircle2,
  HelpCircle,
  IndianRupee,
  BadgeAlert,
  Search,
  Instagram,
  Mail
} from "lucide-react";
import { PROPERTIES, DEFAULT_PROPERTIES } from "./propertiesData";
import { Property } from "./types";
import { BookingModal, CallModal } from "./components/Modals";
import { AIChat } from "./components/AIChat";
import { LeadDashboard } from "./components/LeadDashboard";
import { ThreeBackground } from "./components/ThreeBackground";
import { BrokerAccessModal } from "./components/BrokerAccessModal";
import { ComingSoon } from "./components/ComingSoon";

export function WhatsAppIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      fill="currentColor" 
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.46h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// Safe import of Theatre.js
const theatreProject = null;
const theatreSheet = null;

// Comprehensive list of localities in Mumbai, Thane, and Navi Mumbai for premium listings
const MUMBAI_LOCATIONS = [
  "Altamount Road", "Malabar Hill", "Worli", "Bandra West", "Juhu", "Cuffe Parade",
  "Lower Parel", "Prabhadevi", "Powai", "Versova", "Lokhandwala", "Chembur",
  "Santacruz West", "Khar West", "Parel", "Byculla", "Dadar", "Matunga",
  "Wadala", "Ghatkopar", "Mulund", "Bhandup", "Andheri East", "Andheri West",
  "Goregaon West", "Goregaon East", "Malad West", "Kandivali East", "Borivali West",
  "Mira Road", "Dahisar", "Sion", "Kurla"
];

const THANE_LOCATIONS = [
  "Ghodbunder Road", "Hiranandani Estate", "Majiwada", "Pokhran Road No. 1", 
  "Pokhran Road No. 2", "Kolshet Road", "Vartak Nagar", "Panchpakhadi", "Naupada", 
  "Kopri", "Kalyan West", "Kalyan East", "Dombivli", "Ambernath", "Badlapur", "Kasheli", "Bhiwandi",
  "Thane West", "Thane East", "Wagle Estate", "Kasarvadavali", "Patlipada", "Manpada"
];

const NAVI_MUMBAI_LOCATIONS = [
  "Palm Beach Road", "Vashi", "Nerul", "Kharghar", "Belapur", "Seawoods", 
  "Sanpada", "Kopar Khairane", "Airoli", "Ghansoli", "Kamothe", "Panvel", 
  "Taloja", "Ulwe", "Dronagiri"
];

// Staggered fade-in animation variants for property gallery
const galleryContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const galleryCardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14
    }
  }
} as const;

export default function App() {
  const BROKER_PIN = import.meta.env.VITE_BROKER_PIN || "";
  const [isVipUnlocked, setIsVipUnlocked] = useState(() => {
    return localStorage.getItem("hrida_vip_unlocked") === "true";
  });

  const [properties, setProperties] = useState<Property[]>(() => {
    const stored = localStorage.getItem("hrida_properties");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse stored properties:", e);
      }
    }
    return [];
  });

  // Fetch properties from server on mount
  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await fetch("/api/properties");

if (!res.ok) {
    throw new Error("Unable to fetch properties.");
}

const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.properties) && data.properties.length > 0) {
            setProperties(data.properties);
            localStorage.setItem("hrida_properties", JSON.stringify(data.properties));
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch properties from server:", err);
      }
    };
    fetchProps();
  }, []);

  // Save properties to local storage and sync to server when updated locally
  const updatePropertiesList = async (newProps: Property[]) => {
    setProperties(newProps);
    localStorage.setItem("hrida_properties", JSON.stringify(newProps));
    
    // Sync to server in background
    try {
  const response = await fetch("/api/properties/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-broker-pin": BROKER_PIN,
    },
    body: JSON.stringify({
      properties: newProps,
    }),
  });

  if (!response.ok) {
    console.warn("Property sync failed.");
  }
} catch (e) {
  console.warn("Could not sync updated properties with server:", e);
}
  };

  // State variables for routing tabs
  // "home" -> Custom Landing Home page, "buy" -> Buy Properties, "rent" -> Rent Properties, "list" -> List Owner Property Form
  const [currentTab, setCurrentTab] = useState<"home" | "buy" | "rent" | "list">("home");
  
  // Selected property for detailed modal or slide presentation
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activePropertyIndex, setActivePropertyIndex] = useState<number>(0);
  const [isDetailView, setIsDetailView] = useState(false);
  
  // Dialog / Portal Overlays
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isBrokerAccessOpen, setIsBrokerAccessOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setIsBrokerAccessOpen(true);
        return 0;
      }
      return next;
    });
  };

  // Auto-reset click counter after 4 seconds of inactivity
  useEffect(() => {
    if (logoClicks === 0) return;
    const timer = setTimeout(() => {
      setLogoClicks(0);
    }, 4000);
    return () => clearTimeout(timer);
  }, [logoClicks]);
  
  // Indian State / City Filters
  const [selectedArea, setSelectedArea] = useState<string>("All Locations");
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Owners Listing Form state
  const [listName, setListName] = useState("");
  const [listEmail, setListEmail] = useState("");
  const [listPhone, setListPhone] = useState("");
  const [listPropName, setListPropName] = useState("");
  const [listPropType, setListPropType] = useState("Penthouse");
  const [listCity, setListCity] = useState("Mumbai");
  const [listSubLocation, setListSubLocation] = useState("");
  const [isLocationSuggestionsOpen, setIsLocationSuggestionsOpen] = useState(false);
  const [listPrice, setListPrice] = useState("");
  const [listBeds, setListBeds] = useState(3);
  const [listSqft, setListSqft] = useState("");
  const [listDesc, setListDesc] = useState("");
  const [listingSuccess, setListingSuccess] = useState(false);
  const [listingSubmitting, setListingSubmitting] = useState(false);

  // Live real-time lead analytics counter (notifies dashboard)
  const [leadsCount, setLeadsCount] = useState(0);

  // Responsive Drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Entrance state driven dynamically (or animated via Three/React fallback)
  const [entranceAnimationValues, setEntranceAnimationValues] = useState({
    titleY: -35,
    titleOpacity: 0,
    titleScale: 0.94,
    cardsY: 40,
    cardsOpacity: 0
  });

  const handleLeadCaptured = () => {
    setLeadsCount(prev => prev + 1);
  };

  // Run initial cinematic animations via Theatre.js simulation or core sequence

  const triggerReactEntrance = () => {
    setTimeout(() => {
      setEntranceAnimationValues({
        titleY: 0,
        titleOpacity: 1,
        titleScale: 1,
        cardsY: 0,
        cardsOpacity: 1
      });
    }, 150);
  };

  // Filter properties based on Tab (buy/rent), Location, and Search query
  const filteredProperties = properties.filter(p => {
    // 1. Filter by buy/rent tab
    const targetPurpose = currentTab === "home" ? "buy" : currentTab;
    if (p.purpose !== targetPurpose) return false;

    // 2. Filter by selected geographical city
    if (selectedArea !== "All Locations") {
      let matchesArea = false;
      if (selectedArea === "Mumbai") {
        matchesArea = p.location.toLowerCase().includes("mumbai") && !p.location.toLowerCase().includes("navi mumbai");
      } else if (selectedArea === "Thane") {
        matchesArea = p.location.toLowerCase().includes("thane");
      } else if (selectedArea === "Navi Mumbai") {
        matchesArea = p.location.toLowerCase().includes("navi mumbai");
      }
      if (!matchesArea) return false;
    }

    // 3. Filter by search query (name or location keyword)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchLocation = p.location.toLowerCase().includes(q);
      const matchTagline = p.tagline?.toLowerCase().includes(q);
      const matchDescription = p.description?.toLowerCase().includes(q);
      if (!matchName && !matchLocation && !matchTagline && !matchDescription) return false;
    }

    return true;
  });

  // Handle owner property listing submission
  const handleListPropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName || !listEmail || !listPropName || !listPrice) {
      alert("Please fill out the required owner credentials and price parameters.");
      return;
    }

    setListingSubmitting(true);
    try {
      const displayLocation = listSubLocation ? `${listSubLocation}, ${listCity}` : listCity;
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: listName,
          email: listEmail,
          phone: listPhone || "Not provided",
          budget: `Target Value: ₹ ${listPrice}`,
          propertyInterest: `OWNER LISTING SUBMISSION: ${listPropName} in ${displayLocation}`,
          message: `Owner submitted a ${listPropType} for listing. Specs: ${listBeds} BHK, ${listSqft || "N/A"} SqFt. Description: ${listDesc}`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setListingSuccess(true);
        handleLeadCaptured();
        // Reset state
        setListName("");
        setListEmail("");
        setListPhone("");
        setListPropName("");
        setListSubLocation("");
        setIsLocationSuggestionsOpen(false);
        setListPrice("");
        setListSqft("");
        setListDesc("");
      }
    } catch (err) {
      alert("Network error listing property. Please contact broker hotline.");
    } finally {
      setListingSubmitting(false);
    }
  };

  // Navigate to detailed property slide
  const openPropertyDetail = (property: Property, index: number) => {
    setSelectedProperty(property);
    setActivePropertyIndex(index);
    setIsDetailView(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextProperty = () => {
    const purpose = selectedProperty?.purpose || "buy";
    const propertiesOfSameTab = properties.filter(p => p.purpose === purpose);
    if (propertiesOfSameTab.length === 0) return;
    const nextIndex = (activePropertyIndex + 1) % propertiesOfSameTab.length;
    setActivePropertyIndex(nextIndex);
    setSelectedProperty(propertiesOfSameTab[nextIndex]);
  };

  const handlePrevProperty = () => {
    const purpose = selectedProperty?.purpose || "buy";
    const propertiesOfSameTab = properties.filter(p => p.purpose === purpose);
    if (propertiesOfSameTab.length === 0) return;
    const prevIndex = (activePropertyIndex - 1 + propertiesOfSameTab.length) % propertiesOfSameTab.length;
    setActivePropertyIndex(prevIndex);
    setSelectedProperty(propertiesOfSameTab[prevIndex]);
  };

  if (!isVipUnlocked) {
    return <ComingSoon onUnlock={() => setIsVipUnlocked(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-stone-950 font-sans text-stone-100 overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* 3D THREE.JS RESPONSIVE SCROLL BACKGROUND */}
      <ThreeBackground />

      {/* HEADER SECTION */}
      <header className="relative z-40 mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-stone-800/60 pb-4 bg-stone-950/40 backdrop-blur-md rounded-b-xl px-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => { setIsDetailView(false); setCurrentTab("home"); handleLogoClick(); }}>
            <motion.span 
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="font-display font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 italic"
            >
              HRIDA
            </motion.span>
            <div className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              PROPNEST
            </div>
          </div>

          {/* Tab Navigation: HOME, BUY, RENT, LIST A PROPERTY */}
          <div className="hidden md:flex items-center gap-2 bg-stone-900/60 p-1 rounded-full border border-stone-800/80">
            <button 
              id="tab-home-nav"
              onClick={() => { setCurrentTab("home"); setIsDetailView(false); }}
              className={`px-4 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all ${currentTab === "home" && !isDetailView ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow font-bold' : 'text-stone-400 hover:text-white'}`}
            >
              Home
            </button>
            <button 
              id="tab-buy-nav"
              onClick={() => { setCurrentTab("buy"); setIsDetailView(false); }}
              className={`px-4 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all ${currentTab === "buy" && !isDetailView ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow' : 'text-stone-400 hover:text-white'}`}
            >
              Buy
            </button>
            <button 
              id="tab-rent-nav"
              onClick={() => { setCurrentTab("rent"); setIsDetailView(false); }}
              className={`px-4 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all ${currentTab === "rent" && !isDetailView ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow' : 'text-stone-400 hover:text-white'}`}
            >
              Rent
            </button>
            <button 
              id="tab-list-nav"
              onClick={() => { setCurrentTab("list"); setIsDetailView(false); }}
              className={`px-4 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all ${currentTab === "list" && !isDetailView ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow' : 'text-stone-400 hover:text-white'}`}
            >
              List Your Property
            </button>
          </div>

          {/* Right Area Controls */}
          <div className="flex items-center gap-3">

            {/* AI Assistant Chat Trigger */}
            <motion.button
              id="header-chat-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 px-3 py-1.5 text-xs font-bold text-cyan-400 shadow-md hover:shadow-cyan-500/10 cursor-pointer"
            >
              <MessageSquare size={13} className="animate-pulse" />
              <span>CHAT WITH ELENA</span>
            </motion.button>

            {/* Mobile Menu Icon */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-stone-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden relative z-40 bg-stone-900 border-b border-stone-800 px-6 py-4 space-y-3"
          >
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { setCurrentTab("home"); setIsDetailView(false); setIsMobileMenuOpen(false); }}
                className={`text-left py-2 text-xs font-display font-semibold uppercase tracking-wider ${currentTab === "home" ? "text-cyan-400" : "text-stone-300"}`}
              >
                Home Landing
              </button>
              <button 
                onClick={() => { setCurrentTab("buy"); setIsDetailView(false); setIsMobileMenuOpen(false); }}
                className={`text-left py-2 text-xs font-display font-semibold uppercase tracking-wider ${currentTab === "buy" ? "text-cyan-400" : "text-stone-300"}`}
              >
                Buy Properties
              </button>
              <button 
                onClick={() => { setCurrentTab("rent"); setIsDetailView(false); setIsMobileMenuOpen(false); }}
                className={`text-left py-2 text-xs font-display font-semibold uppercase tracking-wider ${currentTab === "rent" ? "text-cyan-400" : "text-stone-300"}`}
              >
                Premium Rent
              </button>
              <button 
                onClick={() => { setCurrentTab("list"); setIsDetailView(false); setIsMobileMenuOpen(false); }}
                className={`text-left py-2 text-xs font-display font-semibold uppercase tracking-wider ${currentTab === "list" ? "text-cyan-400" : "text-stone-300"}`}
              >
                List Your Property
              </button>
              <button 
                onClick={() => { setIsDashboardOpen(true); setIsMobileMenuOpen(false); }}
                className="text-left py-2 text-xs text-emerald-400 font-mono font-bold"
              >
                Open Broker Lead Desk ({leadsCount})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE LAYOUT COMPONENT */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <AnimatePresence mode="wait">
          {!isDetailView ? (
            
            <motion.div
              key="landing-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              
              {currentTab === "home" ? (
                /* ======================================================================= */
                /* CUSTOM LANDING HOME PAGE AS REQUESTED                                   */
                /* ======================================================================= */
                <div className="space-y-16 py-4 md:py-8">
                  
                  {/* HERO SEGMENT WITH BRANDING AND PARALLAX TRIGGERS */}
                  <div className="relative text-center py-10 md:py-20 flex flex-col items-center">
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-3 inline-flex items-center gap-2 rounded-full bg-stone-900/80 border border-stone-800/80 px-4 py-1"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-cyan-400 font-bold">
                        mumbai • thane • navi mumbai
                      </span>
                    </motion.div>

                    <h1 className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-7xl leading-none">
                      THE NEW STANDARDS OF <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 italic">
                        LUXURY LIVING
                      </span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-stone-400 text-xs sm:text-sm leading-relaxed">
                      Acquire, lease, or list extraordinary residences across Mumbai.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                      <button
                        onClick={() => setCurrentTab("buy")}
                        className="rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 text-black px-6 py-3.5 text-xs font-bold uppercase tracking-wider font-mono shadow-lg hover:shadow-cyan-400/20 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <span>Acquisition Portfolio</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        onClick={() => setCurrentTab("rent")}
                        className="rounded-full border border-stone-800 bg-stone-900/80 hover:border-stone-700 text-stone-300 hover:text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider font-mono transition-all cursor-pointer flex items-center gap-2"
                      >
                        <span>Premium Leases</span>
                        <span>🏡</span>
                      </button>
                    </div>

                  </div>

                  {/* 3-COLUMN BEAUTIFUL EXPERIENTIAL DIRECTION CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div 
                      onClick={() => setCurrentTab("buy")}
                      className="group relative p-6 rounded-2xl border border-stone-800/80 bg-stone-900/40 backdrop-blur-sm hover:border-cyan-500/30 transition-all cursor-pointer overflow-hidden shadow-xl"
                    >
                      <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                        <Sparkles size={18} />
                      </div>
                      <h3 className="font-display text-lg font-bold text-white uppercase group-hover:text-cyan-400 transition-colors">Acquire Estates</h3>
                      <p className="text-stone-400 text-xs mt-2 leading-relaxed">Browse curated high-fashion penthouses, luxury duplexes, and seaside retreats starting at 60 lakhs/month.</p>
                      <div className="mt-5 flex items-center gap-1.5 text-xs text-cyan-400 font-mono font-bold uppercase tracking-wider">
                        <span>View Catalog</span>
                        <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    <div 
                      onClick={() => setCurrentTab("rent")}
                      className="group relative p-6 rounded-2xl border border-stone-800/80 bg-stone-900/40 backdrop-blur-sm hover:border-teal-500/30 transition-all cursor-pointer overflow-hidden shadow-xl"
                    >
                      <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                        <Building size={18} />
                      </div>
                      <h3 className="font-display text-lg font-bold text-white uppercase group-hover:text-teal-400 transition-colors">Premium Leases</h3>
                      <p className="text-stone-400 text-xs mt-2 leading-relaxed">Discover elite Grade-A long-term rentals in golf sanctuaries and prime sectors starting at 20,000/month.</p>
                      <div className="mt-5 flex items-center gap-1.5 text-xs text-teal-400 font-mono font-bold uppercase tracking-wider">
                        <span>Explore Leases</span>
                        <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    <div 
                      onClick={() => setCurrentTab("list")}
                      className="group relative p-6 rounded-2xl border border-stone-800/80 bg-stone-900/40 backdrop-blur-sm hover:border-emerald-500/30 transition-all cursor-pointer overflow-hidden shadow-xl"
                    >
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                        <PlusCircle size={18} />
                      </div>
                      <h3 className="font-display text-lg font-bold text-white uppercase group-hover:text-emerald-400 transition-colors">List Your Home</h3>
                      <p className="text-stone-400 text-xs mt-2 leading-relaxed">Direct representation desk for private builders & owners seeking VVIP clients with absolute discretion.</p>
                      <div className="mt-5 flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider">
                        <span>Submit Proposal</span>
                        <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>


                  </div>

                  {/* METRICS & PROOFS OF SUPERIORITY */}
                  <div className="border-t border-stone-800/50 pt-12 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-4 rounded-2xl bg-stone-900/20 border border-stone-900/40">
                      <span className="font-display text-3xl font-black text-cyan-400 font-mono">100%</span>
                      <p className="text-[10px] uppercase tracking-widest font-mono text-stone-500 mt-1">Physical Verification</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-stone-900/20 border border-stone-900/40">
                      <span className="font-display text-3xl font-black text-cyan-400 font-mono">₹ 450+ Cr</span>
                      <p className="text-[10px] uppercase tracking-widest font-mono text-stone-500 mt-1">Transacted Volume</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-stone-900/20 border border-stone-900/40">
                      <span className="font-display text-3xl font-black text-cyan-400 font-mono">24/7</span>
                      <p className="text-[10px] uppercase tracking-widest font-mono text-stone-500 mt-1">Contact Support</p>
                    </div>
                  </div>

                  {/* LUXURY EXPERT STATEMENT / BIOGRAPHY SIGNATURE */}
                  <div className="rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] p-6 sm:p-8 text-center max-w-4xl mx-auto">
                    <span className="text-amber-400 text-xs">✦ ✦ ✦</span>
                    <p className="italic text-stone-300 text-xs sm:text-sm mt-3 leading-relaxed">
                      "At Hrida Propnest, we don't present real estate listings; we preserve architectural heritage. From the billionaire enclaves of Altamount Road to spectacular coastal villas, every residence represents an exceptional standard of lifestyle across Mumbai. Our team secures seamless RERA-compliant acquisitions with absolute discretion."
                    </p>
                    <div className="mt-4">
                      <span className="text-stone-400 font-mono text-xs font-bold uppercase tracking-wider block">Chetan Pansare</span>
                      <span className="text-[9px] font-mono text-stone-500 block uppercase tracking-widest">Founder, Hrida Propnest</span>
                    </div>
                  </div>

                </div>
              ) : (
                /* OTHERWISE RENDER CATALOG OR OWNER FORMS */
                <>
                  {/* HERO BLOCK */}
                  <div className="relative text-center py-10 md:py-16 flex flex-col items-center">
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="mb-3 inline-flex items-center gap-2 rounded-full bg-stone-900/80 border border-stone-800/80 px-4 py-1"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                      </span>
                      <span className="text-[10px] uppercase tracking-widest font-mono text-stone-400 font-bold">
                        Now Active: mumbai • thane • navi mumbai
                      </span>
                    </motion.div>

                    {/* Heading Title tailored for India */}
                    <motion.div
                      style={{
                        y: entranceAnimationValues.titleY,
                        opacity: entranceAnimationValues.titleOpacity,
                        scale: entranceAnimationValues.titleScale,
                      }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      className="max-w-4xl"
                    >
                      <h1 className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-7xl leading-none">
                        LUXURY HOMES <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 italic">
                          IN INDIA
                        </span>
                      </h1>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="mt-4 max-w-xl text-stone-400 text-xs sm:text-sm leading-relaxed"
                    >
                     Acquire, lease, or list extraordinary residences across Mumbai.
                    </motion.p>

                    {/* GEOGRAPHY AREA FILTER */}
                    {currentTab !== "list" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="relative mt-6 z-30"
                      >
                        <button
                          id="area-dropdown-btn"
                          onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                          className="flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/90 px-5 py-2.5 text-xs font-bold uppercase tracking-widest font-mono text-stone-200 hover:border-cyan-500/40 hover:bg-stone-900 transition-all cursor-pointer shadow-xl"
                        >
                          <Compass size={13} className="text-cyan-400" />
                          <span>REGION: {selectedArea}</span>
                          <span className="text-[8px] text-stone-500">▼</span>
                        </button>

                        <AnimatePresence>
                          {isAreaDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 rounded-xl border border-stone-800 bg-stone-900 p-2 shadow-2xl z-30"
                            >
                              {["All Locations", "Mumbai", "Thane", "Navi Mumbai"].map((area) => (
                                <button
                                  key={area}
                                  onClick={() => {
                                    setSelectedArea(area);
                                    setIsAreaDropdownOpen(false);
                                  }}
                                  className={`w-full rounded-lg px-4 py-2 text-left text-xs font-semibold font-mono tracking-wider transition-colors ${
                                    selectedArea === area
                                      ? "bg-cyan-500/10 text-cyan-400"
                                      : "text-stone-400 hover:bg-stone-800 hover:text-white"
                                  }`}
                                >
                                  {area === "All Locations" ? "🌍 All Regions" : area === "Mumbai" ? "🌇 Mumbai" : area === "Thane" ? "⛰️ Thane Region" : "🌊 Navi Mumbai"}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}

                  </div>

                  {/* BUY & RENT CARDS GRID DISPLAY */}
                  {currentTab !== "list" ? (
                    <div className="border-t border-stone-800/50 pt-10">
                      
                      <div className="text-center mb-8">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                          {currentTab === "buy" ? "Villas & Penthouses for Sale" : "Elite Multi-Lakh Monthly Rentals"}
                        </span>
                        <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white mt-1">
                          {currentTab === "buy" ? "EXHIBIT COLLECTION: FOR ACQUISITION" : "EXHIBIT COLLECTION: LONG-TERM LEASES"}
                        </h2>
                      </div>

                      {/* Modern Search Input */}
                      <div className="max-w-md mx-auto mb-8 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <Search className="h-4 w-4 text-stone-500" />
                        </div>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Filter by name or location keyword..."
                          className="w-full rounded-full border border-stone-800 bg-stone-900/60 py-2.5 pl-11 pr-10 text-xs font-mono text-white placeholder-stone-500 focus:border-cyan-500/50 focus:bg-stone-900/90 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all shadow-inner"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-500 hover:text-stone-300 transition-colors"
                            title="Clear search"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Curated Grid matching filters */}
                      {filteredProperties.length === 0 ? (
                        <div className="text-center py-20 rounded-2xl border border-stone-800 bg-stone-900/20 backdrop-blur-sm">
                          <BadgeAlert size={36} className="text-stone-600 mx-auto mb-2" />
                          <p className="text-sm text-stone-400 font-mono">No matching boutique properties currently found.</p>
                          <button 
                            onClick={() => {
                              setSelectedArea("All Locations");
                              setSearchQuery("");
                            }}
                            className="mt-4 text-xs font-mono text-cyan-400 underline hover:text-cyan-300"
                          >
                            Reset all filters to view all listings
                          </button>
                        </div>
                      ) : (
                        <motion.div
                          key={`${currentTab}-${selectedArea}-${searchQuery}`}
                          variants={galleryContainerVariants}
                          initial="hidden"
                          animate="show"
                          className="grid grid-cols-1 gap-6 md:grid-cols-3"
                        >
                          {filteredProperties.map((property, idx) => (
                            <motion.div
                              key={property.id}
                              variants={galleryCardVariants}
                              whileHover={{ y: -8 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className="group relative h-[420px] overflow-hidden rounded-2xl border border-stone-800/80 bg-stone-900/40 backdrop-blur-sm shadow-2xl cursor-pointer"
                              onClick={() => openPropertyDetail(property, idx)}
                            >
                              {/* Photo */}
                              <img 
                                src={property.image} 
                                alt={property.name} 
                                className="h-full w-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                              />
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-transparent" />

                              {/* Top Badges */}
                              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                                <span className="rounded-md bg-stone-950/90 border border-stone-800/60 px-2.5 py-1 text-[10px] font-mono tracking-wider font-semibold text-stone-300">
                                  {property.location}
                                </span>
                                <span className="rounded-md bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider text-cyan-400">
                                  {property.beds} BHK
                                </span>
                              </div>

                              {/* Bottom info panel */}
                              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                                <span className="text-[10px] font-bold tracking-widest text-cyan-400 font-mono uppercase block mb-0.5">
                                  {property.sqft.toLocaleString()} SQ FT • PRIVATE
                                </span>

                                <h3 className="font-display text-xl font-bold tracking-wide text-white group-hover:text-cyan-400 transition-colors">
                                  {property.name}
                                </h3>

                                <p className="text-xs text-stone-400 line-clamp-1 mt-1">
                                  {property.tagline}
                                </p>

                                <div className="mt-4 border-t border-stone-800/80 pt-3 flex items-center justify-between">
                                  <span className="font-display font-black text-white text-base sm:text-lg font-mono">
                                    {property.priceText}
                                  </span>

                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-950 border border-stone-800 group-hover:bg-cyan-500 group-hover:border-cyan-500 text-stone-400 group-hover:text-black transition-all">
                                    <ChevronRight size={15} />
                                  </div>
                                </div>
                              </div>

                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                    </div>
                  ) : (
                    
                    /* ======================================================================= */
                    /* TAB: LIST A PROPERTY OWNER SUBMISSION FORM                             */
                    /* ======================================================================= */
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-3xl mx-auto border border-stone-800 bg-stone-900/80 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-2xl"
                    >
                      {listingSuccess ? (
                        <div className="text-center py-12">
                          <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle2 size={36} />
                          </div>
                          <h3 className="font-display text-2xl font-bold text-white">Listing Submitted to Broker Desk!</h3>
                          <p className="mt-2 text-sm text-stone-400 max-w-md mx-auto">
                            Namaste! We have securely logged your luxury property proposal. One of our senior representatives from our premium desk will call you within 2 hours to conduct physical validation.
                          </p>
                          <button
                            onClick={() => setListingSuccess(false)}
                            className="mt-6 rounded-full bg-stone-800 border border-stone-700 px-6 py-2.5 text-xs font-mono font-bold text-stone-300 hover:text-white"
                          >
                            List Another Property
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-6 border-b border-stone-800/80 pb-4">
                            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">Exclusive Owner Representation</span>
                            <h2 className="font-display text-2xl font-black text-white mt-1">SELL OR RENT YOUR BOUTIQUE HOME</h2>
                            <p className="text-xs text-stone-400 mt-1">Unlock direct access to India's most affluent high-net-worth buyers and tenants.</p>
                          </div>

                          <form onSubmit={handleListPropertySubmit} className="space-y-4">
                            
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Owner Name *</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="E.g., Anirudh Sharma"
                                  value={listName}
                                  onChange={(e) => setListName(e.target.value)}
                                  className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Primary Email *</label>
                                <input
                                  type="email"
                                  required
                                  placeholder="anirudh@sharmacapital.in"
                                  value={listEmail}
                                  onChange={(e) => setListEmail(e.target.value)}
                                  className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Contact Phone *</label>
                                <input
                                  type="tel"
                                  required
                                  placeholder="+91 98765 43210"
                                  value={listPhone}
                                  onChange={(e) => setListPhone(e.target.value)}
                                  className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Preferred Purpose</label>
                                <select
                                  value={listPropType}
                                  onChange={(e) => setListPropType(e.target.value)}
                                  className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white focus:border-cyan-500 focus:outline-none"
                                >
                                  <option value="Penthouse">Boutique Penthouse</option>
                                  <option value="Heritage Bungalow">Heritage Mansion / Bungalow</option>
                                  <option value="Coastal Villa">Beachside / Sea Facing Villa</option>
                                  <option value="Golf Duplex">Exclusive Golf Course Facing Duplex</option>
                                </select>
                              </div>
                            </div>

                            <div className="border-t border-stone-800/80 pt-4 my-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">Property Details</span>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Property Title / Name *</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="E.g., The Sharma Vista Triplex"
                                  value={listPropName}
                                  onChange={(e) => setListPropName(e.target.value)}
                                  className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Metro Location</label>
                                <select
                                  value={listCity}
                                  onChange={(e) => {
                                    setListCity(e.target.value);
                                    setListSubLocation("");
                                    setIsLocationSuggestionsOpen(false);
                                  }}
                                  className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white focus:border-cyan-500 focus:outline-none"
                                >
                                  <option value="Mumbai">Mumbai</option>
                                  <option value="Thane">Thane Region</option>
                                  <option value="Navi Mumbai">Navi Mumbai</option>
                                </select>
                              </div>
                            </div>

                            {/* Detailed Sub-locality specification for Mumbai, Thane, Navi Mumbai */}
                            {(listCity === "Mumbai" || listCity === "Thane" || listCity === "Navi Mumbai") && (
                              <div className="relative rounded-xl border border-stone-800/80 bg-stone-950/40 p-4">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1 font-mono">
                                  Locality / Area in {listCity} *
                                </label>
                                <span className="text-[10px] text-stone-500 font-mono block mb-2 leading-relaxed">
                                  Enter any local suburb, enclave, or luxury sector. Type any custom area to list.
                                </span>
                                
                                <div className="relative z-10">
                                  <input
                                    type="text"
                                    required
                                    placeholder={
                                      listCity === "Mumbai" 
                                        ? "Search or type, e.g., Bandra West, Worli, Malabar Hill..." 
                                        : listCity === "Thane" 
                                          ? "Search or type, e.g., Hiranandani Estate, Ghodbunder Road..." 
                                          : "Search or type, e.g., Palm Beach Road, Vashi, Kharghar..."
                                    }
                                    value={listSubLocation}
                                    onChange={(e) => {
                                      setListSubLocation(e.target.value);
                                      setIsLocationSuggestionsOpen(true);
                                    }}
                                    onFocus={() => setIsLocationSuggestionsOpen(true)}
                                    className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none"
                                  />
                                  
                                  {listSubLocation && (
                                    <button
                                      type="button"
                                      onClick={() => setListSubLocation("")}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white text-[10px] font-mono px-1"
                                    >
                                      CLEAR
                                    </button>
                                  )}
                                </div>

                                {/* Floating Autocomplete Dropdown */}
                                <AnimatePresence>
                                  {isLocationSuggestionsOpen && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-20" 
                                        onClick={() => setIsLocationSuggestionsOpen(false)} 
                                      />
                                      <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="absolute left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto rounded-xl border border-stone-800 bg-stone-950 p-1.5 shadow-2xl custom-scrollbar"
                                      >
                                        {(() => {
                                          const searchPool = 
                                            listCity === "Mumbai" 
                                              ? MUMBAI_LOCATIONS 
                                              : listCity === "Thane" 
                                                ? THANE_LOCATIONS 
                                                : NAVI_MUMBAI_LOCATIONS;
                                          
                                          const matches = searchPool.filter(loc => 
                                            loc.toLowerCase().includes(listSubLocation.toLowerCase())
                                          );

                                          return (
                                            <>
                                              {matches.length > 0 ? (
                                                matches.map((loc) => (
                                                  <button
                                                    key={loc}
                                                    type="button"
                                                    onClick={() => {
                                                      setListSubLocation(loc);
                                                      setIsLocationSuggestionsOpen(false);
                                                    }}
                                                    className="w-full rounded-lg text-left py-2 px-3 text-xs text-stone-300 hover:bg-stone-900 hover:text-cyan-400 transition-colors flex items-center justify-between"
                                                  >
                                                    <span>{loc}</span>
                                                    <span className="text-[10px] font-mono text-stone-600 uppercase">Select</span>
                                                  </button>
                                                ))
                                              ) : (
                                                <div className="py-3 px-3 text-xs text-stone-500 font-mono text-center">
                                                  "{(listSubLocation.length > 15 ? listSubLocation.substring(0, 15) + '...' : listSubLocation)}" will be listed as a custom {listCity} location.
                                                </div>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </motion.div>
                                    </>
                                  )}
                                </AnimatePresence>

                                {/* Popular Quick Tags */}
                                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                                  <span className="text-[10px] font-mono uppercase text-stone-500 mr-1">Popular:</span>
                                  {(listCity === "Mumbai" 
                                    ? ["Altamount Road", "Malabar Hill", "Bandra West", "Worli", "Juhu", "Lower Parel"]
                                    : listCity === "Thane" 
                                      ? ["Hiranandani Estate", "Ghodbunder Road", "Majiwada", "Pokhran Road No. 2", "Naupada"]
                                      : ["Palm Beach Road", "Vashi", "Kharghar", "Nerul", "Belapur"]
                                  ).map((popLoc) => (
                                    <button
                                      key={popLoc}
                                      type="button"
                                      onClick={() => {
                                        setListSubLocation(popLoc);
                                        setIsLocationSuggestionsOpen(false);
                                      }}
                                      className={`rounded-full px-2.5 py-1 text-[10px] font-mono transition-all border ${
                                        listSubLocation === popLoc
                                          ? "bg-cyan-500/10 border-cyan-400 text-cyan-400"
                                          : "bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-600 hover:text-white"
                                      }`}
                                    >
                                      {popLoc}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Desired Value *</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="E.g., ₹ 45 Crores or ₹ 6 Lakhs/mo"
                                  value={listPrice}
                                  onChange={(e) => setListPrice(e.target.value)}
                                  className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Bedrooms (BHK)</label>
                                <select
                                  value={listBeds}
                                  onChange={(e) => setListBeds(Number(e.target.value))}
                                  className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                                >
                                  <option value={2}>2 BHK</option>
                                  <option value={3}>3 BHK</option>
                                  <option value={4}>4 BHK</option>
                                  <option value={5}>5+ BHK / Mansion</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Total Sq Ft</label>
                                <input
                                  type="number"
                                  placeholder="E.g., 4800"
                                  value={listSqft}
                                  onChange={(e) => setListSqft(e.target.value)}
                                  className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Special Narrative / Interior Highlights</label>
                              <textarea
                                rows={3}
                                placeholder="E.g., Snaidero cabinets, Private pool, imported French window glass panels, direct sea-breeze vectors..."
                                value={listDesc}
                                onChange={(e) => setListDesc(e.target.value)}
                                className="w-full rounded-xl border border-stone-800 bg-stone-950 p-3 text-xs text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none resize-none"
                              />
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              disabled={listingSubmitting}
                              type="submit"
                              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-3 text-xs font-bold uppercase tracking-wider font-mono text-black shadow-lg cursor-pointer"
                            >
                              {listingSubmitting ? "Securing file submission..." : "Submit Proposal for VVIP Broker Review"}
                            </motion.button>

                          </form>
                        </div>
                      )}
                    </motion.div>
                  )}
                </>
              )}

            </motion.div>
          ) : (
            
            /* ======================================================================= */
            /* SINGLE PROPERTY DETAILED IMMERSIVE SHOWCASE SLIDE                       */
            /* ======================================================================= */
            <motion.div
              key="detail-slide-panel"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="relative py-4"
            >
              
              <button
                id="back-to-listings-btn"
                onClick={() => setIsDetailView(false)}
                className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/80 px-4 py-2 text-xs font-bold uppercase tracking-widest font-mono text-stone-300 hover:border-cyan-500/30 hover:text-white transition-colors cursor-pointer mb-6"
              >
                <ChevronLeft size={14} />
                <span>BACK TO {currentTab.toUpperCase()} COLLECTION</span>
              </button>

              <div className="overflow-hidden rounded-3xl border border-stone-800 bg-stone-900 shadow-2xl">
                
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  
                  {/* Left slide column */}
                  <div className="relative h-[320px] sm:h-[420px] lg:h-[580px] lg:col-span-7 overflow-hidden">
                    
                    <img 
                      src={selectedProperty?.image} 
                      alt={selectedProperty?.name} 
                      className="h-full w-full object-cover transition-all duration-700"
                    />

                    {/* Pagination elements directly on canvas matching premium feel */}
                    <div className="absolute inset-y-0 left-4 flex items-center">
                      <button
                        id="prev-slide-btn"
                        onClick={handlePrevProperty}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-950/70 border border-stone-800 text-white hover:bg-cyan-500 hover:text-black transition-all shadow-lg"
                      >
                        <ChevronLeft size={18} />
                      </button>
                    </div>

                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <button
                        id="next-slide-btn"
                        onClick={handleNextProperty}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-950/70 border border-stone-800 text-white hover:bg-cyan-500 hover:text-black transition-all shadow-lg"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/20" />

                    {/* Left overlay badge */}
                    <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2 justify-between items-end">
                      <div className="rounded-xl bg-stone-950/90 border border-stone-800 p-3 backdrop-blur-md max-w-sm">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400">Prime Location</span>
                        <p className="font-display font-bold text-white text-xs sm:text-sm">{selectedProperty?.location}</p>
                      </div>

                      {/* Micro slide pagination trackers */}
                      <div className="flex gap-1.5 bg-stone-950/80 px-2.5 py-1.5 rounded-full border border-stone-800 backdrop-blur-sm">
                        {PROPERTIES.filter(p => p.purpose === currentTab).map((p, idx) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setSelectedProperty(p);
                              setActivePropertyIndex(idx);
                            }}
                            className={`h-1.5 w-1.5 rounded-full transition-all ${p.id === selectedProperty?.id ? 'bg-cyan-400 w-3.5' : 'bg-stone-600'}`}
                          />
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right description info column */}
                  <div className="p-6 md:p-8 lg:col-span-5 flex flex-col justify-between bg-stone-900 border-t lg:border-t-0 lg:border-l border-stone-800">
                    
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase">
                            {selectedProperty?.sqft.toLocaleString()} SQ FT • ELITE SECTOR
                          </span>
                          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wide text-white uppercase mt-1">
                            {selectedProperty?.name}
                          </h1>
                        </div>
                        
                        <div className="rounded-xl border border-stone-800 bg-stone-950/60 px-3 py-1.5 text-right shrink-0">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500 block">Exquisite Value</span>
                          <span className="font-display text-sm sm:text-base font-bold font-mono text-cyan-400">{selectedProperty?.priceText}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 my-5 border-y border-stone-800/80 py-3 text-center">
                        <div>
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono block">Layout</span>
                          <p className="mt-0.5 font-display font-bold text-white text-sm sm:text-base font-mono">{selectedProperty?.beds} BHK</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono block">Baths</span>
                          <p className="mt-0.5 font-display font-bold text-white text-sm sm:text-base font-mono">{selectedProperty?.baths}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono block">Metro Rank</span>
                          <p className="mt-0.5 font-display font-bold text-emerald-400 text-sm sm:text-base font-mono">Grade-A</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-300">Architectural Narrative</h4>
                        <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                          {selectedProperty?.description}
                        </p>
                      </div>

                      <div className="mt-5">
                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 block">VVIP Amenities included</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-300">
                          {selectedProperty?.highlights.map((highlight, hidx) => (
                            <li key={hidx} className="flex items-center gap-1.5">
                              <span className="text-cyan-400">⚡</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    <div className="mt-6 pt-5 border-t border-stone-800/85">
                      <div className="flex gap-3">
                        <motion.button
                          id="detail-call-btn"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsCallOpen(true)}
                          className="flex-1 rounded-xl border border-stone-700 py-2.5 text-xs font-bold uppercase tracking-wider font-mono hover:bg-stone-800 hover:text-white hover:border-white transition-all cursor-pointer flex justify-center items-center gap-1"
                        >
                          <Phone size={12} />
                          <span>Call Office</span>
                        </motion.button>

                        <motion.button
                          id="detail-book-btn"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsBookingOpen(true)}
                          className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-black py-2.5 text-xs font-bold uppercase tracking-wider font-mono transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/20 flex justify-center items-center gap-1"
                        >
                          <span>Request Visit</span>
                          <span>🔑</span>
                        </motion.button>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-stone-900 bg-stone-950 py-12 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-stone-900 pb-8 items-start">
            {/* Branding */}
            <div className="text-left">
              <span 
                className="font-display font-black text-xl text-white tracking-wider cursor-pointer hover:text-cyan-400 select-none transition-colors duration-300"
                onClick={handleLogoClick}
                title="Hrida Propnest Premium Brokerage"
              >
                HRIDA PROPNEST
              </span>
              <p className="text-xs text-stone-500 mt-2 max-w-sm leading-relaxed">
                Bespoke portfolio advisory and private builder partnerships spanning across Mumbai, Thane, and Navi Mumbai.
              </p>
            </div>

            {/* Direct Contact Info */}
            <div className="text-left md:text-center space-y-3">
              <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono font-bold block">Contact Details</span>
              <div className="flex flex-col items-start md:items-center space-y-2">
                <a 
                  href="tel:+919819876103" 
                  className="inline-flex items-center gap-2 text-xs text-stone-300 hover:text-cyan-400 transition-colors font-mono"
                >
                  <Phone size={12} className="text-cyan-400" />
                  <span>+91 98198 76103</span>
                </a>
                <a 
                  href="https://wa.me/919819876103" 
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-stone-300 hover:text-emerald-400 transition-colors font-mono font-bold"
                >
                  <WhatsAppIcon size={12} className="text-emerald-400" />
                  <span>WhatsApp: +91 98198 76103</span>
                </a>
                <a 
                  href="mailto:hridapropnest@gmail.com" 
                  className="inline-flex items-center gap-2 text-xs text-stone-300 hover:text-cyan-400 transition-colors font-mono"
                >
                  <Mail size={12} className="text-cyan-400" />
                  <span>hridapropnest@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="text-left md:text-right space-y-3">
              <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono font-bold block">Follow Our Collection</span>
              <div className="flex items-center md:justify-end gap-3">
                <a 
                  href="https://wa.me/919819876103" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="h-8 w-8 rounded-full border border-stone-800 bg-stone-900 flex items-center justify-center text-emerald-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all duration-300"
                  aria-label="WhatsApp"
                  title="WhatsApp Chat"
                >
                  <WhatsAppIcon size={14} />
                </a>
                <a 
                  href="https://www.instagram.com/hridapropnest?igsh=bm04ajI0anN2bm80" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="h-8 w-8 rounded-full border border-stone-800 bg-stone-900 flex items-center justify-center text-stone-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={14} />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-stone-600 gap-2">
            <span>© {new Date().getFullYear()} Hrida Propnest Premium Brokerage. All rights reserved.</span>
            <span className="font-mono text-[10px] text-stone-700">RERA Compliant Portfolio</span>
          </div>

        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3 items-end">
        {/* WhatsApp Floating CTA */}
        <motion.a
          href="https://wa.me/919819876103"
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl hover:shadow-emerald-500/30 cursor-pointer border border-emerald-500/20"
          title="WhatsApp Chat"
        >
          <WhatsAppIcon size={20} />
        </motion.a>

        {/* Elena Chat Toggle */}
        <motion.button
          id="floating-chat-trigger"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-black shadow-xl hover:shadow-cyan-400/20 cursor-pointer border border-cyan-400/20"
        >
          {isChatOpen ? <X size={22} /> : <MessageSquare size={22} />}
        </motion.button>
      </div>

      {/* MODALS */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        selectedProperty={selectedProperty || properties[0]} 
        properties={properties}
        onLeadCaptured={handleLeadCaptured}
      />

      <CallModal 
        isOpen={isCallOpen} 
        onClose={() => setIsCallOpen(false)} 
        onLeadCaptured={handleLeadCaptured}
      />

      <AIChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        onOpenBooking={() => {
          setIsChatOpen(false);
          setIsBookingOpen(true);
        }}
      />

      <BrokerAccessModal
  isOpen={isBrokerAccessOpen}
  onClose={() => setIsBrokerAccessOpen(false)}
  onSuccess={() => {
  console.log("PIN SUCCESS");

  setIsVipUnlocked(true);
  setIsDashboardOpen(true);

  localStorage.setItem("hrida_vip_unlocked", "true");
}}
/>

      <LeadDashboard 
        isOpen={isDashboardOpen} 
        onClose={() => setIsDashboardOpen(false)}
        leadsCount={leadsCount}
        properties={properties}
        onPropertiesUpdate={updatePropertiesList}
      />

    </div>
  );
}

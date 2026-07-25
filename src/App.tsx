import React, { useState, useEffect, useRef } from "react";
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
import ContactPage from "./components/ContactPage";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { LeadDashboard } from "./components/LeadDashboard";
import { ThreeBackground } from "./components/ThreeBackground";
import { BrokerAccessModal } from "./components/BrokerAccessModal";
import { HpLogo } from "./components/HpLogo";

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
    return DEFAULT_PROPERTIES;
  });

  // Fetch properties from server on mount
  useEffect(() => {
    const fetchProps = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const fbProps: Property[] = [];
        querySnapshot.forEach((doc) => {
          fbProps.push({ id: doc.id, ...doc.data() } as Property);
        });

        if (fbProps.length > 0) {
          setProperties(fbProps);
          localStorage.setItem("hrida_properties", JSON.stringify(fbProps));
          return;
        }
      } catch (err) {
        console.error("Failed to fetch properties from Firebase, using local data source fallback:", err);
        setProperties(prev => prev.length === 0 ? DEFAULT_PROPERTIES : prev);
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
      // With Firebase, individual adds/deletes are preferred over bulk array sync
    } catch (e) {
      console.warn("Could not sync array to backend.");
    }
  };

  // State variables for routing tabs
  // "home" -> Custom Landing Home page, "projects" -> Luxury Projects portfolio, "about" -> About Us page
  const [currentTab, setCurrentTab] = useState<"home" | "projects" | "about">("home");
  
  // Carousel ref for Brochures
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth * 0.5; // Scroll half the screen width
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

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

  // Filter properties based on Tab, Location, and Search query
  const filteredProperties = properties.filter(p => {
    // 1. Filter by tab purpose (home shows buy, projects shows all)
    if (currentTab === "home") {
      if (p.purpose !== "buy") return false;
    }

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



  return (
    <div className="relative min-h-screen bg-stone-950 font-sans text-stone-100 overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* 3D THREE.JS RESPONSIVE SCROLL BACKGROUND */}
      {!(currentTab === "home" && !isDetailView) && <ThreeBackground />}

      {/* HEADER SECTION */}
      {currentTab !== "projects" && (
        <>
        <header className="relative z-40 mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-stone-800/60 pb-4 bg-stone-950/40 backdrop-blur-md rounded-b-xl px-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => { setIsDetailView(false); setCurrentTab("home"); handleLogoClick(); }}>
            <HpLogo className="w-12 h-12" glow={false} />
            <div className="flex flex-col justify-center">
              <span className="font-serif font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-700 uppercase leading-none">
                HRIDA PROPNEST
              </span>
            </div>
          </div>

          {/* Tab Navigation: HOME, PROJECTS, ABOUT US */}
          <div className="hidden md:flex items-center gap-2 bg-stone-900/60 p-1 rounded-full border border-stone-800/80">
            <button 
              id="tab-home-nav"
              onClick={() => { setCurrentTab("home"); setIsDetailView(false); }}
              className={`px-5 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all ${currentTab === "home" && !isDetailView ? 'bg-cyan-500 text-black shadow font-bold' : 'text-stone-400 hover:text-white'}`}
            >
              Home
            </button>
            <button 
              id="tab-projects-nav"
              onClick={() => { setCurrentTab("projects"); setIsDetailView(false); }}
              className={`px-5 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all ${currentTab === "projects" && !isDetailView ? 'bg-cyan-500 text-black shadow font-bold' : 'text-stone-400 hover:text-white'}`}
            >
              Projects
            </button>
            <button 
              id="tab-about-nav"
              onClick={() => { setCurrentTab("about"); setIsDetailView(false); }}
              className={`px-5 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all ${currentTab === "about" && !isDetailView ? 'bg-cyan-500 text-black shadow font-bold' : 'text-stone-400 hover:text-white'}`}
            >
              About Us
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
                Home
              </button>
              <button 
                onClick={() => { setCurrentTab("projects"); setIsDetailView(false); setIsMobileMenuOpen(false); }}
                className={`text-left py-2 text-xs font-display font-semibold uppercase tracking-wider ${currentTab === "projects" ? "text-cyan-400" : "text-stone-300"}`}
              >
                Projects
              </button>
              <button 
                onClick={() => { setCurrentTab("about"); setIsDetailView(false); setIsMobileMenuOpen(false); }}
                className={`text-left py-2 text-xs font-display font-semibold uppercase tracking-wider ${currentTab === "about" ? "text-cyan-400" : "text-stone-300"}`}
              >
                About Us
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
      </>
      )}

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
                /* CUSTOM LANDING HOME PAGE AS REQUESTED (IMMERSIVE CINEMATIC)             */
                /* ======================================================================= */
                <div className="-mt-8 relative w-screen" style={{ marginLeft: "calc(50% - 50vw)" }}>
                  
                  {/* FULL-SCREEN IMMERSIVE HERO */}
                  <div className="relative h-[95vh] w-full overflow-hidden flex flex-col justify-end">
                    
                    {/* Background Media */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute inset-0 z-0"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80" 
                        alt="Cinematic luxury estate" 
                        className="w-full h-full object-cover object-center origin-center animate-cinematic-pan"
                      />
                      {/* Deep moody gradients */}
                      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-transparent to-stone-950" />
                      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/20 to-transparent" />
                    </motion.div>

                    {/* Content Overlay */}
                    <div className="relative z-10 px-6 sm:px-12 md:px-20 pb-24 md:pb-32 w-full flex flex-col items-center text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                        className="flex flex-col items-center"
                      >
                        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tight max-w-4xl mx-auto">
                          Redefining <br />
                          <span className="italic font-light text-stone-300">Legacy.</span>
                        </h1>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                        className="mt-8 md:mt-12 max-w-md mx-auto flex flex-col items-center"
                      >
                        <p className="text-stone-300/80 text-sm md:text-base leading-relaxed font-light">
                          Exclusive off-market acquisitions and bespoke leasing for Mumbai’s most distinguished enclaves.
                        </p>
                        
                        <div className="mt-10 flex justify-center">
                          <button
                            onClick={() => setCurrentTab("projects")}
                            className="group flex items-center gap-4 text-xs font-mono uppercase tracking-[0.25em] text-white hover:text-cyan-400 transition-colors cursor-pointer"
                          >
                            <div className="h-10 w-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-cyan-400/50 transition-colors backdrop-blur-sm">
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                            <span>Enter Portfolio</span>
                          </button>
                        </div>
                      </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5, duration: 1 }}
                      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10"
                    >
                      <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-stone-500 origin-center rotate-90 translate-y-4">Scroll</span>
                      <div className="w-px h-16 bg-gradient-to-b from-stone-600 to-transparent" />
                    </motion.div>
                  </div>

                  {/* IMMERSIVE SECTION 2: THE EXPERIENCE */}
                  <div className="relative min-h-screen w-full bg-stone-950 py-32 px-6 sm:px-12 md:px-20 flex flex-col justify-center overflow-hidden">
                    
                    {/* Abstract atmospheric background elements */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    
                    <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center relative z-10">
                      
                      <div className="space-y-8 flex flex-col items-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="h-px w-12 bg-cyan-500/50" />
                          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-400/80">The Approach</span>
                        </div>
                        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] max-w-2xl">
                          Curated for <br />
                          the <i className="text-stone-400 font-light">Discerning Few.</i>
                        </h2>
                        <p className="text-stone-400 text-sm leading-relaxed max-w-xl font-light">
                          We bypass the traditional market. Our private network grants access to unlisted architectural marvels across Altamount Road, Worli Sea Face, and Malabar Hill before they ever reach the public eye.
                        </p>
                        <div className="pt-8">
                          <button
                            onClick={() => setCurrentTab("about")}
                            className="text-xs font-mono uppercase tracking-[0.2em] text-stone-300 hover:text-white border-b border-stone-700 hover:border-cyan-400 pb-2 transition-all cursor-pointer"
                          >
                            Speak with an Advisor
                          </button>
                        </div>
                      </div>

                      <div className="relative h-[600px] w-full rounded-sm overflow-hidden mt-16 max-w-4xl mx-auto">
                        <img 
                          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80" 
                          alt="Luxury interior architecture" 
                          className="w-full h-full object-cover object-center filter grayscale-[30%] hover:grayscale-0 transition-all duration-1000 scale-100 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-stone-950/20" />
                      </div>

                    </div>
                  </div>

                  {/* FULL-WIDTH CINEMATIC STATS STRIP */}
                  <div className="relative h-[400px] w-full bg-stone-900 overflow-hidden flex items-center">
                    <img 
                      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80" 
                      alt="Architecture detail" 
                      className="absolute inset-0 w-full h-full object-cover object-center opacity-20 filter grayscale"
                    />
                    <div className="absolute inset-0 bg-stone-950/70" />
                    
                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-stone-800">
                      <div className="py-6">
                        <div className="font-serif text-5xl md:text-6xl text-white mb-2">₹450<span className="text-3xl text-cyan-500">+</span></div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-400">Crores Transacted</div>
                      </div>
                      <div className="py-6">
                        <div className="font-serif text-5xl md:text-6xl text-white mb-2">100<span className="text-3xl text-cyan-500">%</span></div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-400">Title & RERA Verified</div>
                      </div>
                      <div className="py-6">
                        <div className="font-serif text-5xl md:text-6xl text-white mb-2">24<span className="text-3xl text-cyan-500">/</span>7</div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-400">Private Concierge</div>
                      </div>
                    </div>
                  </div>

                </div>
              ) : currentTab === "projects" ? (
                /* ======================================================================= */
                /* PROJECTS PORTFOLIO TAB - APPLE STYLE VERTICAL SNAP                      */
                /* ======================================================================= */
                <div className="fixed inset-0 z-[100] bg-stone-950 overflow-y-auto overflow-x-hidden snap-y snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  
                  {/* Floating Header */}
                  <div className="fixed top-0 left-0 right-0 z-50 p-4 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-b from-stone-950/90 via-stone-950/50 to-transparent pointer-events-none">
                     <div className="flex gap-3 pointer-events-auto">
                        <button 
                          onClick={() => setCurrentTab("home")} 
                          className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors bg-stone-900/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-stone-800 shadow-xl"
                        >
                          <ChevronLeft size={16} /> <span className="font-mono text-xs font-bold uppercase tracking-widest">Back</span>
                        </button>

                        <div className="relative">
                          <button 
                            onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)} 
                            className="flex items-center gap-2 text-stone-200 hover:text-white transition-colors bg-stone-900/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-stone-800 font-mono text-xs font-bold uppercase tracking-widest shadow-xl"
                          >
                            <Compass size={14} className="text-cyan-400"/>
                            {selectedArea}
                          </button>
                          
                          <AnimatePresence>
                            {isAreaDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-14 left-0 w-56 bg-stone-900 border border-stone-800 rounded-2xl p-2 shadow-2xl"
                              >
                                {["All Locations", "Mumbai", "Thane", "Navi Mumbai"].map((area) => (
                                  <button
                                    key={area}
                                    onClick={() => {
                                      setSelectedArea(area);
                                      setIsAreaDropdownOpen(false);
                                    }}
                                    className={`w-full rounded-xl px-4 py-3 text-left text-xs font-bold font-mono tracking-wider transition-colors ${
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
                        </div>
                     </div>

                     <div className="relative pointer-events-auto w-full sm:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search luxury properties..."
                          className="w-full sm:w-72 bg-stone-900/60 backdrop-blur-md border border-stone-800 rounded-full py-2.5 pl-12 pr-4 text-sm font-mono text-white placeholder-stone-500 focus:outline-none focus:border-cyan-500/50 shadow-xl"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                     </div>
                  </div>

                  {filteredProperties.length === 0 ? (
                    <div className="h-screen w-full flex flex-col items-center justify-center snap-start snap-always">
                       <BadgeAlert size={48} className="text-stone-700 mb-6" />
                       <h2 className="text-2xl text-stone-500 font-serif uppercase tracking-widest">No brochures found.</h2>
                       <button 
                          onClick={() => { setSelectedArea("All Locations"); setSearchQuery(""); }}
                          className="mt-6 text-xs font-mono font-bold uppercase tracking-widest text-cyan-500 hover:text-cyan-400 underline"
                       >
                         Reset Filters
                       </button>
                    </div>
                  ) : (
                    filteredProperties.map((property, idx) => (
                      <div key={property.id} className="relative h-screen w-full snap-start snap-always flex items-center justify-center overflow-hidden bg-stone-950">
                        
                        {/* Immersive Background */}
                        <motion.img 
                          initial={{ scale: 1.1 }}
                          whileInView={{ scale: 1 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          src={property.image}
                          alt={property.name}
                          className="absolute inset-0 w-full h-full object-cover origin-center"
                        />
                        <div className="absolute inset-0 bg-stone-950/40" />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />
                        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-transparent to-transparent" />

                        {/* Property Content */}
                        <div className="relative z-10 text-center px-6 max-w-5xl flex flex-col items-center mt-20 md:mt-0">
                           <motion.div 
                             initial={{ opacity: 0, y: 20 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             transition={{ duration: 0.8, delay: 0.2 }}
                             className="mb-6 rounded-full bg-stone-950/80 border border-stone-800/80 px-5 py-2 backdrop-blur-md inline-block shadow-2xl"
                           >
                             <span className="text-cyan-400 font-mono text-xs font-bold tracking-[0.3em] uppercase">
                               {property.location}
                             </span>
                           </motion.div>
                           
                           <motion.h2
                             initial={{ opacity: 0, y: 40 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             transition={{ duration: 1, delay: 0.3 }}
                             className="text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-display font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl"
                           >
                             {property.name}
                           </motion.h2>

                           <motion.p
                             initial={{ opacity: 0 }}
                             whileInView={{ opacity: 1 }}
                             transition={{ duration: 1, delay: 0.5 }}
                             className="text-stone-300 max-w-2xl text-sm md:text-lg font-light leading-relaxed mb-12 drop-shadow-lg"
                           >
                             {property.description}
                           </motion.p>

                           <motion.button
                             initial={{ opacity: 0, scale: 0.9 }}
                             whileInView={{ opacity: 1, scale: 1 }}
                             transition={{ duration: 0.5, delay: 0.7 }}
                             onClick={() => window.open(property.pdfUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "_blank")}
                             className="group relative overflow-hidden rounded-full bg-cyan-500/10 border border-cyan-500/30 px-8 py-4 backdrop-blur-md transition-all hover:bg-cyan-500/20 hover:border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:shadow-[0_0_60px_rgba(6,182,212,0.3)]"
                           >
                              <span className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-cyan-400 group-hover:text-cyan-200 flex items-center gap-3">
                                Download Brochure <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </span>
                           </motion.button>
                        </div>

                        {/* Scroll Indicator */}
                        {idx < filteredProperties.length - 1 && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce"
                          >
                            <span className="text-[9px] uppercase font-mono tracking-widest text-stone-400">Scroll</span>
                            <div className="w-[1px] h-12 bg-gradient-to-b from-stone-400 to-transparent" />
                          </motion.div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                ) : (
                    /* ======================================================================= */
                    /* TAB: ABOUT US, VISION, MISSION & CONTACT                                */
                    /* ======================================================================= */
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-12 max-w-5xl mx-auto py-8"
                    >
                      {/* Hero Section */}
                      <div className="text-center space-y-4 mb-16">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                          Mumbai's Elite Real Estate Boutique
                        </span>
                        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] uppercase max-w-3xl mx-auto drop-shadow-2xl">
                          Discretion. Heritage. Advisory.
                        </h2>
                        <p className="text-sm sm:text-base text-stone-400 leading-relaxed font-light max-w-2xl mx-auto mt-6">
                          Founded on the principles of absolute client discretion and deep structural evaluation, Hrida Propnest represents the pinnacle of residential advisory in Mumbai.
                        </p>
                      </div>

                      {/* Vision & Mission Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Vision Card */}
                        <div className="relative overflow-hidden bg-stone-900/60 border border-stone-800 backdrop-blur-md rounded-3xl p-10 shadow-2xl group hover:border-cyan-500/30 transition-all duration-500">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-500" />
                           <h3 className="relative z-10 font-display text-2xl font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-3">
                             <Sparkles className="text-cyan-400" size={24} /> Our Vision
                           </h3>
                           <p className="relative z-10 text-stone-300 leading-relaxed font-light text-sm">
                             To be the definitive authority and most trusted enclave for ultra-luxury real estate transactions across South Mumbai, offering an unparalleled level of access and exclusive curation that traditional brokerages simply cannot match. We envision a future where elite property acquisition is completely seamless, private, and breathtakingly bespoke.
                           </p>
                        </div>

                        {/* Mission Card */}
                        <div className="relative overflow-hidden bg-stone-900/60 border border-stone-800 backdrop-blur-md rounded-3xl p-10 shadow-2xl group hover:border-cyan-500/30 transition-all duration-500">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-500" />
                           <h3 className="relative z-10 font-display text-2xl font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-3">
                             <Building className="text-emerald-400" size={24} /> Our Mission
                           </h3>
                           <p className="relative z-10 text-stone-300 leading-relaxed font-light text-sm">
                             To rigorously protect our clients' interests by conducting comprehensive physical title verifications, providing elite structural narrative evaluations, and maintaining a strictly RERA-compliant portfolio. We are on a mission to represent only the highest echelon of architectural marvels and deliver them with absolute fidelity and zero friction.
                           </p>
                        </div>
                      </div>

                      {/* Contact & Founder Section */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
                        
                        {/* Contact & Socials Grid */}
                        <div className="md:col-span-7 bg-stone-900/40 border border-stone-800/80 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col justify-between">
                           <div>
                             <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-cyan-400 mb-2 block">Concierge Desk</span>
                             <h3 className="font-serif text-3xl font-bold text-white uppercase mb-8">Connect With Us</h3>
                             
                             <div className="space-y-6">
                               <a href="tel:+919819876103" className="group flex items-center gap-5 p-4 rounded-2xl bg-stone-950/50 border border-stone-800 hover:border-cyan-500/40 transition-all">
                                 <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                   <Phone size={20} />
                                 </div>
                                 <div>
                                   <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest mb-1">Direct Hotline</div>
                                   <div className="text-white font-mono text-lg font-bold tracking-wider">+91 98198 76103</div>
                                 </div>
                               </a>
                               
                               <a href="mailto:hridapropnest@gmail.com" className="group flex items-center gap-5 p-4 rounded-2xl bg-stone-950/50 border border-stone-800 hover:border-cyan-500/40 transition-all">
                                 <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                   <Mail size={20} />
                                 </div>
                                 <div>
                                   <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest mb-1">Private Email Inquiry</div>
                                   <div className="text-white text-sm font-medium tracking-wide">hridapropnest@gmail.com</div>
                                 </div>
                               </a>
                             </div>
                           </div>

                           <div className="mt-10 pt-8 border-t border-stone-800">
                             <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest mb-4">Follow Our Collection</div>
                             <div className="flex flex-wrap gap-4">
                                <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-950 border border-stone-800 text-stone-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all hover:scale-110 hover:-translate-y-1 shadow-xl">
                                  <Instagram size={20} />
                                </a>
                                <a href="https://wa.me/919819876103" target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all hover:scale-110 hover:-translate-y-1 shadow-xl">
                                  <WhatsAppIcon size={20} />
                                </a>
                             </div>
                           </div>
                        </div>

                        {/* Founder Card */}
                        <div className="md:col-span-5 border border-stone-800/80 bg-stone-900/60 backdrop-blur-md rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-xl">
                          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-transparent blur-3xl rounded-full" />
                          <div className="h-20 w-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative z-10">
                            <User size={40} strokeWidth={1.5} />
                          </div>
                          <h3 className="font-serif text-2xl font-bold text-white uppercase relative z-10">Chetan Pansare</h3>
                          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.2em] mt-2 block relative z-10">Founder & Managing Advisor</span>
                          
                          <div className="mt-8 relative z-10 bg-stone-950/40 border border-stone-800 rounded-2xl p-6">
                            <p className="text-xs italic text-stone-300 leading-relaxed font-light">
                              "Mumbai's real estate represents more than cement and steel; it holds architectural heritage and legacy. Our team is dedicated to providing physical title verification and representing luxury listings with absolute fidelity and privacy."
                            </p>
                          </div>
                        </div>

                      </div>
                    </motion.div>
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
                        {filteredProperties.map((p, idx) => (
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
      {currentTab !== "projects" && (
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
      )}

      {/* Floating Action Buttons */}
      {currentTab !== "projects" && (
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
      )}

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


import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Mail, 
  Phone, 
  Search, 
  Trash2, 
  Check, 
  RefreshCw, 
  X, 
  FileSpreadsheet, 
  Briefcase,
  Plus,
  Image as ImageIcon,
  Upload,
  Sparkles,
  Info,
  CheckCircle2
} from "lucide-react";
import { Lead, Property } from "../types";
import { DEFAULT_PROPERTIES } from "../propertiesData";
import { toast } from "sonner";

interface LeadDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  leadsCount: number;
  properties: Property[];
  onPropertiesUpdate: (properties: Property[]) => void;
}

const AREAS: Record<string, string[]> = {
  Mumbai: [
    "Bandra West",
    "Andheri West",
    "Worli",
    "Juhu",
    "Powai",
    "Lower Parel",
    "Malabar Hill",
    "Colaba",
    "Chembur",
    "Ghatkopar",
    "Borivali",
    "Kandivali",
    "Malad",
    "Dadar",
    "Parel",
  ],

  Thane: [
    "Ghodbunder Road",
    "Hiranandani Estate",
    "Majiwada",
    "Manpada",
    "Kasarvadavali",
    "Vartak Nagar",
    "Panchpakhadi",
    "Naupada",
    "Pokhran Road",
  ],

  "Navi Mumbai": [
    "Vashi",
    "Nerul",
    "Seawoods",
    "Belapur",
    "Kharghar",
    "Kamothe",
    "Ulwe",
    "Panvel",
    "Airoli",
    "Ghansoli",
  ],
};

export function LeadDashboard({ 
  isOpen, 
  onClose, 
  leadsCount, 
  properties, 
  onPropertiesUpdate 
}: LeadDashboardProps) {
  // Main Navigation Tabs: "leads" or "properties"
  const [activeMainTab, setActiveMainTab] = useState<"leads" | "properties">("leads");

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "tours" | "callbacks">("all");

  // Form State for Adding Property
  const [propName, setPropName] = useState("");
  const [propPurpose, setPropPurpose] = useState<"buy" | "rent">("buy");
  const [propPriceText, setPropPriceText] = useState("");
  const [propPriceNumerical, setPropPriceNumerical] = useState("");
  const [propSqft, setPropSqft] = useState("");
  const [propBeds, setPropBeds] = useState(3);
  const [propBaths, setPropBaths] = useState(3);
  const [propImage, setPropImage] = useState("");
  const [propTagline, setPropTagline] = useState("");
  const [propDescription, setPropDescription] = useState("");
  const [propHighlights, setPropHighlights] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [area, setArea] = useState("");
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);

  const [formSuccess, setFormSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [savingProperty, setSavingProperty] = useState(false);

  const [error, setError] = useState("");

  const BROKER_PIN = import.meta.env.VITE_BROKER_PIN || "";

  // Quick high-res luxury real estate presets
  const IMAGE_PRESETS = [
    {
      label: "Modern Penthouse",
      url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    },
    {
      label: "Oceanfront Villa",
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    },
    {
      label: "Classic Manor",
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    },
    {
      label: "Minimalist Atrium",
      url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    }
  ];

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/leads", {
    headers:{
        "x-broker-pin":BROKER_PIN
    }
});

if(!response.ok){
    throw new Error("Unable to fetch leads");
}

const data = await response.json();
      if (data.success) {
        setLeads([...data.leads].reverse());
      }
    } 
    catch (err) {
  console.error("Error fetching leads:", err);
  setError("Unable to connect to the server.");
}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeads();
    }
  }, [isOpen, leadsCount]);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.propertyInterest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "tours") return matchesSearch && lead.propertyInterest.includes("Tour");
    if (activeTab === "callbacks") return matchesSearch && lead.propertyInterest.includes("Callback");
    return matchesSearch;
  });

  const exportLeadsText = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Budget", "Interest", "Message", "Captured At"],
      ...filteredLeads.map((l) => [
        l.name,
        l.email,
        l.phone,
        l.budget,
        l.propertyInterest,
        l.message.replace(/\n/g, " "),
        l.createdAt,
      ]),
    ]
      .map((row) =>
  row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
)
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hrida_propnest_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Image File Handling (Click & Drag-and-Drop)
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.success("Please upload a valid image file.");
      return;
    }

if (file.size > 5 * 1024 * 1024) {
  toast.success("Maximum image size is 5MB.");
  return;
}

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPropImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  useEffect(() => {
  const closeDropdown = () => {
    setShowAreaDropdown(false);
  };

  window.addEventListener("click", closeDropdown);

  return () => {
    window.removeEventListener("click", closeDropdown);
  };
}, []);

  // Add Property Handler
  const handleAddPropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propName || !area || !city || !propPriceText) {
  toast.error("Property Name, Area, City and Price are required.");
  return;
}

    const highlightsArray = propHighlights
      ? propHighlights.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const newPropertyObj: Property = {
      id: Math.random().toString(36).substring(2, 9),
      name: propName.toUpperCase(),
      purpose: propPurpose,
      priceText: propPriceText,
      priceNumerical: Number(propPriceNumerical) || 0,
      sqft: Number(propSqft) || 1000,
      beds: Number(propBeds) || 1,
      baths: Number(propBaths) || 1,
      location: `${area}, ${city}`,
      image: propImage || IMAGE_PRESETS[0].url,
      tagline: propTagline || "Spectacular bespoke estate",
      description: propDescription || "Curated modern mansion crafted for distinguished lifestyles.",
      highlights: highlightsArray.length > 0 ? highlightsArray : ["Elite Location", "Premium Automation", "24/7 Security Desk"],
    };

    // Update frontend state
    const updatedProperties = [...properties, newPropertyObj];
    onPropertiesUpdate(updatedProperties);
setSavingProperty(true);
    // Call server to add it as well
    try {
      const response = await fetch("/api/properties", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-broker-pin": BROKER_PIN,
  },
  body: JSON.stringify(newPropertyObj),
});

if (!response.ok) {
  throw new Error("Property could not be saved.");
}
    } catch (err) {
      console.warn("Server connection failed, property saved to local browser cache.");
    }
finally {
  setSavingProperty(false);
}
    // Success banner & Reset
    setFormSuccess(true);
    window.setTimeout(() => {
  setFormSuccess(false);
}, 3000);

    // Reset Form Fields
    setPropPurpose("buy");
    setPropName("");
    setPropPriceText("");
    setPropPriceNumerical("");
    setPropSqft("");
    setPropBeds(3);
    setPropBaths(3);
    setPropImage("");
    setPropTagline("");
    setPropDescription("");
    setPropHighlights("");
    setCity("Mumbai");
setArea("");
setShowAreaDropdown(false);
  };

  // Delete Property Handler
  const handleDeleteProperty = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently withdraw this boutique residence from the portfolio?");
    if (!confirmDelete) return;

    // Filter out
    const updated = properties.filter((p) => p.id !== id);
    onPropertiesUpdate(updated);

    // Call server to delete
    try {
      const response = await fetch(`/api/properties/${id}`, {
  method: "DELETE",
  headers: {
    "x-broker-pin": BROKER_PIN,
  },
});

if (!response.ok) {
  throw new Error("Delete failed");
}
    } catch (err) {
      console.warn("Could not delete from server list, updated in browser.");
    }
  };

  // Seed Default Properties Handler
  const handleSeedDefaults = async () => {
    const confirmSeed = window.confirm("Load the 6 original bespoke Indian showcase properties into the broker portfolio?");
    if (!confirmSeed) return;

    onPropertiesUpdate(DEFAULT_PROPERTIES);

    // Call server to sync
    try {
      const response = await fetch("/api/properties/sync", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-broker-pin": BROKER_PIN,
  },
  body: JSON.stringify({
    properties: DEFAULT_PROPERTIES,
  }),
});

if (!response.ok) {
  throw new Error("Unable to load sample properties.");
}
    } catch (e) {
      console.warn("Server sync failed, default properties loaded in browser.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/90 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-800 bg-stone-900 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Briefcase size={22} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white tracking-wide">VIP BROKER LEAD DESK</h3>
                  <p className="text-xs text-stone-400">Secure real-time lead analytics & investor tracking</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeMainTab === "leads" && (
                  <button
                    id="refresh-leads-btn"
                    onClick={fetchLeads}
                    disabled={loading}
                    className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
                    title="Refresh leads"
                  >
                    <RefreshCw size={18} className={loading ? "animate-spin text-cyan-400" : ""} />
                  </button>
                )}
                <button
                  id="close-leads-btn"
                  onClick={onClose}
                  className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* MAIN NAVIGATION TABS FOR DESK */}
            <div className="flex border-b border-stone-800 bg-stone-950/40 px-6">
              <button
                id="leads-tab-nav"
                onClick={() => setActiveMainTab("leads")}
                className={`border-b-2 px-4 py-3.5 text-xs font-bold uppercase tracking-widest font-mono transition-all ${
                  activeMainTab === "leads"
                    ? "border-cyan-400 text-cyan-400"
                    : "border-transparent text-stone-500 hover:text-stone-300"
                }`}
              >
                📊 Leads Ledger ({leads.length})
              </button>
              <button
                id="properties-tab-nav"
                onClick={() => setActiveMainTab("properties")}
                className={`border-b-2 px-4 py-3.5 text-xs font-bold uppercase tracking-widest font-mono transition-all ${
                  activeMainTab === "properties"
                    ? "border-teal-400 text-teal-400"
                    : "border-transparent text-stone-500 hover:text-stone-300"
                }`}
              >
                🏢 Property Portfolio ({properties.length})
              </button>
            </div>

            {/* CONTENT AREA */}
            <div className="custom-scrollbar flex-1 overflow-y-auto bg-stone-950">
              
              {activeMainTab === "leads" ? (
                /* ======================================================================= */
                /* LEADS LEDGER TAB                                                        */
                /* ======================================================================= */
                <div className="flex flex-col h-full">
                  
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-1 gap-4 border-b border-stone-800 bg-stone-950/40 p-6 sm:grid-cols-3">
                    <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-4">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 font-mono">Total Inquiries</span>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-display text-3xl font-bold text-white">{leads.length}</span>
                        <span className="text-xs text-emerald-400 font-mono">Active</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-4">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 font-mono">VIP Tour Bookings</span>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-display text-3xl font-bold text-cyan-400">
                          {leads.filter((l) => l.propertyInterest.includes("Tour")).length}
                        </span>
                        <span className="text-xs text-stone-500 font-mono">Pending Desk</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-4">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 font-mono">Immediate Callbacks</span>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-display text-3xl font-bold text-teal-400">
                          {leads.filter((l) => l.propertyInterest.includes("Callback")).length}
                        </span>
                        <span className="text-xs text-stone-500 font-mono">Urgent Desk</span>
                      </div>
                    </div>
                  </div>

                  {/* Filters Bar */}
                  <div className="flex flex-col gap-4 border-b border-stone-800 bg-stone-900/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex rounded-lg bg-stone-950 p-1">
                      {(["all", "tours", "callbacks"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider font-mono transition-all ${
                            activeTab === tab
                              ? "bg-stone-800 text-cyan-400"
                              : "text-stone-400 hover:text-white"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-1 items-center gap-3 sm:max-w-md">
                      <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                        <input
                          id="lead-search"
                          type="text"
                          placeholder="Search name, phone, villa interest..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full rounded-lg border border-stone-800 bg-stone-950 py-2 pl-9 pr-4 text-xs text-white placeholder-stone-600 focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <button
                        id="export-csv-btn"
                        onClick={exportLeadsText}
                        className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-xs font-semibold text-stone-300 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
                      >
                        <FileSpreadsheet size={14} />
                        <span>CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Leads List */}

                  {error && (
  <div className="mb-4 rounded-lg border border-red-800 bg-red-500/10 p-3 text-sm text-red-300">
    {error}
  </div>
)}
                  <div className="p-6">
                    {loading ? (
                      <div className="flex h-48 flex-col items-center justify-center gap-3">
                        <RefreshCw size={24} className="animate-spin text-cyan-400" />
                        <p className="text-sm text-stone-400 font-mono">Loading active real estate inquiries...</p>
                      </div>
                    ) : filteredLeads.length === 0 ? (
                      <div className="flex h-48 flex-col items-center justify-center text-center">
                        <Users size={32} className="text-stone-700 mb-2" />
                        <p className="text-sm font-semibold text-stone-400">No active leads found</p>
                        <p className="text-xs text-stone-600 mt-1">Submit inquiries through the main site elements to test.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredLeads.map((lead) => {
                          const isTour = lead.propertyInterest.includes("Tour");
                          const isCallback = lead.propertyInterest.includes("Callback");
                          
                          return (
                            <motion.div
                              key={lead.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="rounded-xl border border-stone-800/80 bg-stone-900/50 p-4 hover:border-stone-700 transition-all"
                            >
                              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-display font-bold text-white text-base">{lead.name}</span>
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold font-mono uppercase tracking-wider ${
                                        isTour
                                          ? "bg-cyan-500/10 text-cyan-400"
                                          : isCallback
                                          ? "bg-rose-500/10 text-rose-400"
                                          : "bg-teal-500/10 text-teal-400"
                                      }`}
                                    >
                                      {isTour ? "VIP Tour" : isCallback ? "Callback Desk" : "Inquiry"}
                                    </span>
                                  </div>

                                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-400">
                                    <span className="flex items-center gap-1">
                                      <Mail size={12} className="text-stone-500" />
                                      <a href={`mailto:${lead.email}`} className="hover:text-cyan-400 transition-colors">
                                        {lead.email}
                                      </a>
                                    </span>
                                    {lead.phone && lead.phone !== "Not provided" && (
                                      <span className="flex items-center gap-1">
                                        <Phone size={12} className="text-stone-500" />
                                        <a href={`tel:${lead.phone}`} className="hover:text-cyan-400 transition-colors">
                                          {lead.phone}
                                        </a>
                                      </span>
                                    )}
                                    <span className="text-stone-500">|</span>
                                    <span className="text-stone-400">
                                      Budget: <strong className="text-stone-200 font-mono">{lead.budget}</strong>
                                    </span>
                                  </div>

                                  <div className="mt-3 rounded-lg bg-stone-950 px-3 py-1.5 text-xs">
                                    <span className="text-stone-500 font-mono text-[10px] uppercase block tracking-wider">Property Focus</span>
                                    <span className="text-stone-300 font-semibold">{lead.propertyInterest}</span>
                                  </div>

                                  {lead.message && (
                                    <p className="mt-2 text-xs italic text-stone-400 border-l border-stone-800 pl-3">
                                      "{lead.message}"
                                    </p>
                                  )}
                                </div>

                                <div className="flex flex-row items-center justify-between border-t border-stone-800/60 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 gap-2">
                                  <span className="text-[10px] text-stone-500 font-mono">
                                    {new Date(lead.createdAt).toLocaleString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  
                                  <div className="flex gap-2">
                                    <button
                                      id={`lead-mark-read-${lead.id}`}
                                      className="flex items-center gap-1 rounded-md bg-stone-800 px-2 py-1 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                                      onClick={() => {
                                        toast.success(`Lead ${lead.name} marked as acknowledged!`);
                                      }}
                                    >
                                      <Check size={10} />
                                      <span>Acknowledge</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* ======================================================================= */
                /* PROPERTY PORTFOLIO & ADMIN PANEL TAB                                    */
                /* ======================================================================= */
                <div className="p-6 space-y-8">
                  
                  {/* Seeding Box & Actions banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-stone-800/80 bg-stone-900/40 p-4">
                    <div className="flex items-start gap-2.5">
                      <Info size={16} className="text-teal-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Boutique Listing Management</h4>
                        <p className="text-[11px] text-stone-400 mt-0.5">Add custom listings with direct image support or reload the 6 template Indian residences into local memory.</p>
                      </div>
                    </div>
                    <button
                      id="seed-defaults-btn"
                      onClick={handleSeedDefaults}
                      className="rounded-lg bg-stone-900 border border-stone-700 hover:border-teal-400 px-3.5 py-1.5 text-xs font-bold text-teal-400 hover:text-white transition-all cursor-pointer font-mono uppercase"
                    >
                      🌱 Seed Sample Listings
                    </button>
                  </div>

                  {/* Active Properties Overview Grid */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 font-mono">Current Boutique Listings ({properties.length})</h3>
                    
                    {properties.length === 0 ? (
                      <div className="text-center py-10 rounded-xl border border-dashed border-stone-800 bg-stone-950">
                        <ImageIcon size={32} className="text-stone-700 mx-auto mb-2" />
                        <p className="text-xs font-mono text-stone-500">Your boutique portfolio has no active listings.</p>
                        <p className="text-[10px] text-stone-600 mt-0.5">Use the "Seed Sample Listings" button above or fill out the form below to begin.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {
                        
                        [...properties]
  .sort((a, b) => b.priceNumerical - a.priceNumerical)
  .map((property) => (
                          <div 
                            key={property.id}
                            className="flex items-center gap-3 rounded-xl border border-stone-800/80 bg-stone-900/30 p-3"
                          >
                            <img 
                              src={property.image} 
                              alt={property.name}
                              className="h-16 w-16 rounded-lg object-cover bg-stone-950 border border-stone-800 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="rounded-md bg-stone-950 px-1.5 py-0.5 text-[9px] font-mono text-stone-500 uppercase">
                                  {property.purpose === "buy" ? "Buy" : "Rent"}
                                </span>
                                <span className="text-[9px] text-cyan-400 font-mono font-bold">
                                  {property.beds} BHK • {property.sqft.toLocaleString()} SqFt
                                </span>
                              </div>
                              <h4 className="font-display font-bold text-white text-xs sm:text-sm truncate mt-0.5">{property.name}</h4>
                              <p className="text-[10px] text-stone-500 truncate">{property.location}</p>
                              <p className="text-xs font-bold text-stone-300 font-mono mt-1">{property.priceText}</p>
                            </div>
                            <button
                              id={`delete-property-${property.id}`}
                              onClick={() => handleDeleteProperty(property.id)}
                              className="rounded-lg p-2 text-stone-500 hover:bg-red-500/10 hover:text-red-400 transition-colors shrink-0"
                              title="Withdraw Listing"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Property Form Area */}
                  <div className="rounded-xl border border-stone-800 bg-stone-900/30 p-6 space-y-6">
                    <div className="border-b border-stone-800/80 pb-4">
                      <div className="flex items-center gap-2 text-teal-400">
                        <Plus size={18} />
                        <h3 className="font-display font-bold text-white text-base uppercase tracking-wide">Add New Boutique Signature Residence</h3>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">Submit high-end properties into your active portfolio. New properties will instantly show up in the visitor carousel and metrics index.</p>
                    </div>

                    <form onSubmit={handleAddPropertySubmit} className="space-y-5">
                      
                      {/* Name & Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Residence Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="E.g., RAHEJA ARTESIA DUPLEX"
                            value={propName}
                            onChange={(e) => setPropName(e.target.value)}
                            className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-700 focus:border-teal-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <div className="grid grid-cols-2 gap-4">

  <div>
    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">
      City
    </label>

    <select
      value={city}
      onChange={(e) => {
        setCity(e.target.value);
        setArea("");
      }}
      className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white"
    >
      <option>Mumbai</option>
      <option>Thane</option>
      <option>Navi Mumbai</option>
    </select>
  </div>

  <div>
    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">
      Area
    </label>

    <div
  className="relative"
  onClick={(e) => e.stopPropagation()}
>
  <input
    type="text"
    value={area}
    placeholder="Search Area..."
    onChange={(e) => {
      setArea(e.target.value);
      setShowAreaDropdown(true);
    }}
    onFocus={() => setShowAreaDropdown(true)}
    className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-600"
  />

  {showAreaDropdown && (
    <div className="absolute left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl border border-stone-800 bg-stone-950 shadow-xl z-50">

      {AREAS[city]
        .filter((item) =>
          item.toLowerCase().includes(area.toLowerCase())
        )
        .map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setArea(item);
              setShowAreaDropdown(false);
            }}
            className="block w-full text-left px-4 py-2 text-xs text-stone-300 hover:bg-stone-800 hover:text-cyan-400"
          >
            {item}
          </button>
        ))}

    </div>
  )}
</div>
  </div>

</div>
                        </div>
                      </div>

                      {/* Purpose, Price text, and Numerical Price */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Purpose *</label>
                          <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800">
                            <button
                              type="button"
                              onClick={() => setPropPurpose("buy")}
                              className={`flex-1 rounded-lg py-1.5 text-xs font-bold uppercase tracking-wider font-mono transition-all ${
                                propPurpose === "buy"
                                  ? "bg-stone-800 text-cyan-400"
                                  : "text-stone-500 hover:text-stone-300"
                              }`}
                            >
                              BUY
                            </button>
                            <button
                              type="button"
                              onClick={() => setPropPurpose("rent")}
                              className={`flex-1 rounded-lg py-1.5 text-xs font-bold uppercase tracking-wider font-mono transition-all ${
                                propPurpose === "rent"
                                  ? "bg-stone-800 text-teal-400"
                                  : "text-stone-500 hover:text-stone-300"
                              }`}
                            >
                              RENT
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Display Price *</label>
                          <input
                            type="text"
                            required
                            placeholder="E.g., ₹ 48 Crores or ₹ 6.5 Lakhs/mo"
                            value={propPriceText}
                            onChange={(e) => setPropPriceText(e.target.value)}
                            className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-700 focus:border-teal-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Sorting Price (Numeric Value) *</label>
                          <input
                            type="number"
                            required
                            placeholder="E.g., 480000000 or 650000"
                            value={propPriceNumerical}
                            onChange={(e) => setPropPriceNumerical(e.target.value)}
                            className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-700 focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Sqft, Beds, Baths */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Built-up Size (SQ FT) *</label>
                          <input
                            type="number"
                            required
                            placeholder="E.g., 7200"
                            value={propSqft}
                            onChange={(e) => setPropSqft(e.target.value)}
                            className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-700 focus:border-teal-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Beds / BHK Configuration</label>
                          <select
                            value={propBeds}
                            onChange={(e) => setPropBeds(Number(e.target.value))}
                            className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white focus:border-teal-500 focus:outline-none"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <option key={num} value={num} className="bg-stone-950">
                                {num} BHK
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Bathrooms</label>
                          <select
                            value={propBaths}
                            onChange={(e) => setPropBaths(Number(e.target.value))}
                            className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white focus:border-teal-500 focus:outline-none"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <option key={num} value={num} className="bg-stone-950">
                                {num} Baths
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Tagline & Highlights */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Pitch Tagline</label>
                          <input
                            type="text"
                            placeholder="E.g., Seductive sunset views over Worli sea face..."
                            value={propTagline}
                            onChange={(e) => setPropTagline(e.target.value)}
                            className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-700 focus:border-teal-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Amenities Highlights (Comma separated)</label>
                          <input
                            type="text"
                            placeholder="E.g., Private Infinity Pool, Saint Amand Concierge, Italian Marble"
                            value={propHighlights}
                            onChange={(e) => setPropHighlights(e.target.value)}
                            className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-700 focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Narrative Description */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Architectural Narrative / Description</label>
                        <textarea
                          rows={3}
                          placeholder="Provide a prestigious editorial description of the estate, its materials, architecture, and layouts..."
                          value={propDescription}
                          onChange={(e) => setPropDescription(e.target.value)}
                          className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 px-4 text-xs text-white placeholder-stone-700 focus:border-teal-500 focus:outline-none resize-none"
                        />
                      </div>

                      {/* IMAGE UPLOADER & PRESETS */}
                      <div className="space-y-3">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">Property Representation Image</label>
                        
                        {/* Drag and Drop Container */}
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                            dragOver
                              ? "border-cyan-400 bg-cyan-500/10"
                              : "border-stone-800 bg-stone-950/40 hover:border-stone-700"
                          }`}
                        >
                          <input
                            type="file"
                            id="property-image-upload"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label htmlFor="property-image-upload" className="cursor-pointer block">
                            <Upload size={28} className="mx-auto text-stone-500 mb-2" />
                            <p className="text-xs text-stone-300 font-semibold">Drag & Drop Image File here, or <span className="text-cyan-400 underline">Browse files</span></p>
                            <p className="text-[10px] text-stone-500 mt-1 font-mono uppercase">Supports PNG, JPG, WEBP • Max Size: 5MB</p>
                          </label>
                        </div>

                        {/* Presets and URL input */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div>
                            <span className="block text-[9px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 font-mono">Or Quick Select a Premium Unsplash Preset:</span>
                            <div className="flex flex-wrap gap-2">
                              {IMAGE_PRESETS.map((preset, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setPropImage(preset.url)}
                                  className={`rounded bg-stone-900 border px-2 py-1 text-[10px] font-mono transition-all uppercase ${
                                    propImage === preset.url
                                      ? "border-teal-400 text-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                                      : "border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-300"
                                  }`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="block text-[9px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 font-mono">Or Enter Custom Image URL directly:</span>
                            <input
                              type="text"
                              placeholder="https://images.unsplash.com/photo-..."
                              value={propImage}
                              onChange={(e) => {
  const url = e.target.value;

  if (
    url === "" ||
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:image/")
  ) {
    setPropImage(url);
  }
}}
                              className="w-full rounded-lg border border-stone-800 bg-stone-950 py-1.5 px-3 text-xs text-white placeholder-stone-700 focus:border-teal-500 focus:outline-none font-mono"
                            />
                          </div>
                        </div>

                        {/* Image Preview */}
                        {propImage && (
                          <div className="rounded-lg border border-stone-800 bg-stone-950/40 p-3 flex items-center gap-3">
                            <img 
                              src={propImage} 
                              alt="Preview" 
                              className="h-12 w-20 rounded object-cover border border-stone-800 shrink-0" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] font-mono text-emerald-400 font-bold block uppercase tracking-wider">Representation Image Connected</span>
                              <span className="text-[10px] text-stone-500 truncate block font-mono mt-0.5">{propImage}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPropImage("")}
                              className="rounded-full bg-stone-800 p-1 text-stone-400 hover:text-white transition-colors"
                              title="Clear Image"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Success & Submit */}
                      <div className="flex items-center justify-between border-t border-stone-800/80 pt-4 gap-4 flex-wrap">
                        {formSuccess ? (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-bold"
                          >
                            <CheckCircle2 size={14} className="animate-bounce" />
                            <span>RESIDENCE SIGNATURE ADDED SUCCESSFULLY!</span>
                          </motion.div>
                        ) : (
                          <span className="text-[10px] text-stone-500 font-mono">* All marked parameters required for portfolio integrity verification.</span>
                        )}

                        <button
                          id="submit-custom-property-btn"
                          type="submit"
                          disabled={savingProperty}
                          className="rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider font-mono shadow-lg hover:shadow-teal-500/10 cursor-pointer flex items-center gap-1.5 transition-all"
                        >
                          <Plus size={14} />
                          <span>
  {savingProperty ? "Saving..." : "Add Listing to Portfolio"}
</span>
                        </button>
                      </div>

                    </form>
                  </div>

                </div>
              )}

            </div>

            {/* Footer */}
            <div className="border-t border-stone-800 bg-stone-900 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">
                Hrida Propnest Broker Portal v1.4.0 — End-to-End Encrypted
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Security clearance level: ADMIN DESK
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export interface Property {
  id: string;
  name: string;
  priceText: string; // e.g. "₹ 18 Crores" or "₹ 4.5 Lakhs/mo"
  priceNumerical: number; // For filtering
  purpose: "buy" | "rent";
  featured?: boolean;
  sqft: number;
  beds: number;
  baths: number;
  location: string;
  image: string;
  tagline: string;
  description: string;
  highlights: readonly string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  budget: string;
  propertyInterest: string;
  message: string;
  createdAt: string;
  status?: "new" | "contacted" | "closed";
}

export interface Booking {
  id?: string;
  propertyName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  createdAt?: string;
  status?: "pending" | "confirmed" | "completed";
}

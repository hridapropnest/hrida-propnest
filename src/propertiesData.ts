import { Property } from "./types";

export const DEFAULT_PROPERTIES: Property[] = [
  {
    id: "altamount",
    name: "LODHA ALTAMOUNT PENTHOUSE",
    priceText: "₹ 85 Crores",
    priceNumerical: 850000000,
    purpose: "buy",
    sqft: 8500,
    beds: 5,
    baths: 6,
    location: "Altamount Road, Mumbai",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    tagline:
      "Spectacular Arabian Sea views from India's most billionaire-populated street.",
    description:
      "Perched high above Mumbai's premium skyline, the Lodha Altamount Penthouse delivers unparalleled panoramic views of the sea and the glittering cityscape. Styled with bespoke Italian marble, double-height floor-to-ceiling glass, and a private cantilevered temperature-controlled swimming pool. Experience the epitome of high-society living.",
    highlights: [
      "Private Infinity Lap Pool",
      "Concierge Service by Saint Amand",
      "Bespoke Italian Crema Marble",
      "Secure Multi-car Private Garage",
    ],
  },
  {
    id: "amara",
    name: "AMARA PALM BEACH SKY-VILLA",
    priceText: "₹ 24 Crores",
    priceNumerical: 240000000,
    purpose: "buy",
    sqft: 6500,
    beds: 4,
    baths: 5,
    location: "Palm Beach Road, Navi Mumbai",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    tagline:
      "Ultra-private sea-view sanctuary with sprawling lawns and custom basalt features.",
    description:
      "Designed as a modern tropical masterpiece overlooking the creek. Fronting the sparkling waters of the Navi Mumbai boulevard, it presents massive indoor-outdoor lounge corridors, a serene black basalt reflection pool, and custom architectural woodwork.",
    highlights: [
      "Fronts Palm Beach Boulevard",
      "Private Creek-front Access",
      "Basalt Stone Waterways",
      "State-of-the-art Wellness Courtyard",
    ],
  },
  {
    id: "hiranandani",
    name: "HIRANANDANI EAGLE'S NEST PENTHOUSE",
    priceText: "₹ 18 Crores",
    priceNumerical: 180000000,
    purpose: "buy",
    sqft: 7200,
    beds: 5,
    baths: 6,
    location: "Hiranandani Estate, Thane",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    tagline:
      "Majestic sky-residence overlooking the serene Ulhas River and Thane skyline.",
    description:
      "Designed for discerning connoisseurs, this triplex penthouse blends classical neoclassical architecture with modern smart-home design. Spreading over 7,200 sqft, it boasts a private swimming pool, custom double-height chandelier hall, and panoramic views of the Yeoor Hills.",
    highlights: [
      "Neoclassical Architecture",
      "Yeoor Hills Sunset View",
      "Double-Height Lounge",
      "Smart Automated Controls",
    ],
  },
  {
    id: "bandra_retreat",
    name: "BANDRA RETREAT COLONIAL VILLA",
    priceText: "₹ 6.5 Lakhs / Month",
    priceNumerical: 650000,
    purpose: "rent",
    sqft: 5800,
    beds: 4,
    baths: 5,
    location: "Carter Road, Bandra West, Mumbai",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    tagline:
      "Bespoke sea-facing colonial sanctuary on the elite shoreline of Bandra.",
    description:
      "A meticulously restored colonial bungalow offering absolute privacy amidst dense tropical gardens. Comprising extensive teakwood balconies, high-speed fiber connectivity, a modern home theatre, and custom private security detail.",
    highlights: [
      "Restored Shoreline Bungalow",
      "Teakwood Wrap-around Balconies",
      "Private Tropical Garden",
      "Premium Carter Road Address",
    ],
  },
  {
    id: "worli_suite",
    name: "WORLI SEA LINK VIEW-SUITE",
    priceText: "₹ 8.5 Lakhs / Month",
    priceNumerical: 850000,
    purpose: "rent",
    sqft: 4200,
    beds: 3,
    baths: 4,
    location: "Worli Sea Face, Mumbai",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    tagline:
      "Elite high-floor glass residence directly framing the iconic Bandra-Worli Sea Link.",
    description:
      "This custom-decorated duplex features bespoke furniture imported from Milan, a massive temperature-controlled sky deck, and direct proximity to South Mumbai's finest business clubs and high-end dining.",
    highlights: [
      "Direct Sea Link Views",
      "Italian Imported Furnishings",
      "Temperature-controlled Sky Deck",
      "Bespoke Concierge Desk",
    ],
  },
  {
    id: "thane_meadows",
    name: "THE MEADOWS GARDEN DUPLEX",
    priceText: "₹ 4.5 Lakhs / Month",
    priceNumerical: 450000,
    purpose: "rent",
    sqft: 5200,
    beds: 4,
    baths: 5,
    location: "Pokhran Road, Thane",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    tagline:
      "Elegant modern duplex offering dramatic forest views over Yeoor Foothills.",
    description:
      "Sitting alongside the premium green lung of Thane, this contemporary residence blends clean minimalist layouts with extensive private balconies. Fully furnished with international premium items, a private gym room, and multi-tiered terrace gardens.",
    highlights: [
      "Breathtaking Yeoor Forest Views",
      "Private Fitness Studio",
      "Multi-tiered Terrace Gardens",
      "24/7 Security & Automation",
    ],
  },
];

export const PROPERTIES: Property[] = [...DEFAULT_PROPERTIES];
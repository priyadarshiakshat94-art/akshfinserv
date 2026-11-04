// One source for the business's name, address and phone (NAP), so the site, the structured data
// and the Google Business Profile always say the same thing.

// The canonical domain. Hard-coded on purpose: the Netlify env var once pointed at
// akshfinserv.netlify.app, which sent every canonical tag and the sitemap to the wrong host.
export const SITE_URL = "https://akshfinserv.net";

export const BUSINESS = {
  name: "Aksh Finserv",
  arn: "ARN-121998",
  foundingYear: "2004",
  phoneDisplay: "+91 98209 32489",
  phoneE164: "+919820932489",
  phone2Display: "+91 99870 05783",
  phone2E164: "+919987005783",
  email: "plabita@akshfinserv.com",
  address: {
    line1: "363, Powai Plaza, Central Avenue",
    line2: "Hiranandani Gardens, Powai",
    city: "Mumbai",
    region: "Maharashtra",
    postalCode: "400076",
    country: "IN",
  },
  areaServed: ["Powai", "Hiranandani Gardens", "Chandivali", "Mumbai"],
  sameAs: [
    "https://www.instagram.com/aksh.finserv/",
    "https://www.facebook.com/61593836442406/",
    "https://in.linkedin.com/in/plabita-priyadarshi-43492643",
  ],
} as const;

const ADDRESS_QUERY = "Powai Plaza, Central Avenue, Hiranandani Gardens, Powai, Mumbai 400076";

// Until the Google Business Profile is verified these open the Powai Plaza building (its Maps CID).
// Swap both for the Aksh Finserv listing's own links once it is live.
export const MAPS_URL = "https://maps.google.com/?cid=2753947715952180411";
export const DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(ADDRESS_QUERY);

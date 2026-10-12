// IP Geolocation and Network Intelligence Service with Google Maps Integration
// Resilient multi-provider client & server lookups with fallback caching

export interface IpGeoData {
  ip: string;
  country: string;
  countryCode: string;
  flagEmoji: string;
  city: string;
  region: string;
  isp: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  timezone: string;
  isVpnOrProxy?: boolean;
}

const geoCache: Map<string, IpGeoData> = new Map();

// Helper to convert country code (e.g. "EG", "SA", "AE", "US") to unicode flag emoji
export const getFlagEmoji = (countryCode?: string): string => {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const code = countryCode.toUpperCase();
  const offset = 127397;
  try {
    return String.fromCodePoint(...code.split('').map(c => c.charCodeAt(0) + offset));
  } catch (e) {
    return '🌐';
  }
};

// Generate direct Google Maps link from coordinates or query
export const getGoogleMapsUrl = (lat?: number, lon?: number, query?: string): string => {
  if (lat !== undefined && lon !== undefined && (lat !== 0 || lon !== 0)) {
    return `https://www.google.com/maps?q=${lat},${lon}`;
  }
  if (query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
  return 'https://maps.google.com';
};

// Lookup location details for any IP
export const lookupIpGeo = async (ip: string): Promise<IpGeoData> => {
  const cleanIp = (ip || '').replace('::ffff:', '').trim();
  
  // Local or private IP handling
  if (!cleanIp || cleanIp === '127.0.0.1' || cleanIp === 'localhost' || cleanIp.startsWith('192.168.') || cleanIp.startsWith('10.')) {
    return {
      ip: cleanIp || '127.0.0.1',
      country: 'محلي / سيرفر خاص',
      countryCode: 'EG',
      flagEmoji: '🇪🇬',
      city: 'القاهرة',
      region: 'الشرق الأوسط',
      isp: 'مزود خدمة محلي',
      latitude: 30.0444,
      longitude: 31.2357,
      googleMapsUrl: 'https://www.google.com/maps?q=30.0444,31.2357',
      timezone: 'Africa/Cairo'
    };
  }

  if (geoCache.has(cleanIp)) {
    return geoCache.get(cleanIp)!;
  }

  // Check localStorage cache
  try {
    const cached = localStorage.getItem(`geo_${cleanIp}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      geoCache.set(cleanIp, parsed);
      return parsed;
    }
  } catch (e) {}

  // Provider 1: ipwho.is (HTTPS, CORS friendly, fast, has flags & coordinates)
  try {
    const res = await fetch(`https://ipwho.is/${cleanIp}`, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        const geo: IpGeoData = {
          ip: cleanIp,
          country: data.country || 'دولة غير محددة',
          countryCode: data.country_code || 'XX',
          flagEmoji: data.flag?.emoji || getFlagEmoji(data.country_code),
          city: data.city || 'المدينة',
          region: data.region || '',
          isp: data.connection?.isp || data.connection?.org || 'مزود خدمة إنترنت',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          googleMapsUrl: getGoogleMapsUrl(data.latitude, data.longitude, `${data.city}, ${data.country}`),
          timezone: data.timezone?.id || 'UTC'
        };
        geoCache.set(cleanIp, geo);
        try { localStorage.setItem(`geo_${cleanIp}`, JSON.stringify(geo)); } catch(e){}
        return geo;
      }
    }
  } catch (e) {}

  // Provider 2: ip-api.com via backend or direct
  try {
    const res = await fetch(`https://freeipapi.com/api/json/${cleanIp}`, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.cityName) {
        const geo: IpGeoData = {
          ip: cleanIp,
          country: data.countryName || 'دولة غير محددة',
          countryCode: data.countryCode || 'XX',
          flagEmoji: getFlagEmoji(data.countryCode),
          city: data.cityName || '',
          region: data.regionName || '',
          isp: 'شبكة اتصال',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          googleMapsUrl: getGoogleMapsUrl(data.latitude, data.longitude, `${data.cityName}, ${data.countryName}`),
          timezone: data.timeZones?.[0] || 'UTC'
        };
        geoCache.set(cleanIp, geo);
        try { localStorage.setItem(`geo_${cleanIp}`, JSON.stringify(geo)); } catch(e){}
        return geo;
      }
    }
  } catch (e) {}

  // Default fallback
  const fallbackGeo: IpGeoData = {
    ip: cleanIp,
    country: 'دولة العضو',
    countryCode: 'UN',
    flagEmoji: '🌍',
    city: 'الموقع الجغرافي',
    region: 'الشبكة',
    isp: 'مزود خدمة الإنترنت',
    latitude: 30.0444,
    longitude: 31.2357,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanIp)}`,
    timezone: 'UTC'
  };

  geoCache.set(cleanIp, fallbackGeo);
  return fallbackGeo;
};

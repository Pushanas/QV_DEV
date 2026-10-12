// Comprehensive Surveillance & Device Tracking Client Service for Q8 VIP

export interface DeviceInfo {
  fingerprint: string;
  deviceName: string;
  browser: string;
  os: string;
  screenRes: string;
}

export interface TrackPingOptions {
  page?: string;
  action?: string;
  signalCount?: number;
  signalDetails?: string;
  authCode?: string;
}

// Generate high-precision hardware & browser fingerprint
export const getDeviceInfo = (): DeviceInfo => {
  let storedFp = '';
  try {
    storedFp = localStorage.getItem('q8_visitor_fp') || '';
  } catch(e) {}

  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  
  // OS Detection
  let os = 'Unknown OS';
  if (/Android/i.test(ua)) os = 'Android ' + (ua.match(/Android\s([0-9\.]*)/)?.[1] || '');
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS ' + (ua.match(/OS\s([0-9_\.]*)/)?.[1]?.replace(/_/g, '.') || '');
  else if (/Windows NT 10.0/i.test(ua)) os = 'Windows 10/11';
  else if (/Windows/i.test(ua)) os = 'Windows PC';
  else if (/Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Browser Detection
  let browser = 'Web Browser';
  if (/Edg\//i.test(ua)) browser = 'Microsoft Edge';
  else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = 'Google Chrome';
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Apple Safari';
  else if (/Firefox\//i.test(ua)) browser = 'Mozilla Firefox';

  // Device model / name
  let deviceName = isMobile ? 'هاتف ذكي' : 'كمبيوتر شخصي';
  if (/iPhone/i.test(ua)) deviceName = 'Apple iPhone';
  else if (/iPad/i.test(ua)) deviceName = 'Apple iPad';
  else if (/Samsung/i.test(ua)) deviceName = 'Samsung Galaxy';
  else if (/Xiaomi/i.test(ua) || /Redmi/i.test(ua)) deviceName = 'Xiaomi / Redmi';
  else if (isMobile) deviceName = 'هاتف ذكي (Android)';

  if (!storedFp) {
    const raw = [
      ua,
      navigator.language,
      `${screen.width}x${screen.height}`,
      navigator.hardwareConcurrency || 2,
      Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    ].join('|');
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    const prefix = isMobile ? 'MOB' : 'DESK';
    storedFp = `${prefix}_${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
    try {
      localStorage.setItem('q8_visitor_fp', storedFp);
    } catch(e) {}
  }

  return {
    fingerprint: storedFp,
    deviceName,
    browser,
    os,
    screenRes: `${screen.width}x${screen.height}`
  };
};

type EvictionCallback = (reason: string) => void;
const evictionListeners: Set<EvictionCallback> = new Set();

export const onEviction = (cb: EvictionCallback) => {
  evictionListeners.add(cb);
  return () => {
    evictionListeners.delete(cb);
  };
};

export const triggerEviction = (reason: string) => {
  evictionListeners.forEach(listener => {
    try { listener(reason); } catch(e) {}
  });
};

// Send tracking ping with instant kick detection and automated IP geolocation
let cachedClientGeo: any = null;

export const sendTrackPing = async (options: TrackPingOptions = {}): Promise<{
  isBanned: boolean;
  isRevoked: boolean;
  message?: string;
  clientIp?: string;
}> => {
  const info = getDeviceInfo();
  const currentAuth = options.authCode || localStorage.getItem('q8_vip_auth_pass_v7_ip_locked') || localStorage.getItem('ah_vip_code') || '';

  // Background fetch geo if not yet resolved
  if (!cachedClientGeo) {
    try {
      const geoRes = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(2000) });
      if (geoRes.ok) {
        const g = await geoRes.json();
        if (g && g.success) {
          cachedClientGeo = {
            country: g.country,
            city: g.city,
            isp: g.connection?.isp || g.connection?.org,
            latitude: g.latitude,
            longitude: g.longitude
          };
        }
      }
    } catch(e) {}
  }

  try {
    const response = await fetch('/api/track/ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fingerprint: info.fingerprint,
        deviceName: info.deviceName,
        browser: info.browser,
        os: info.os,
        page: options.page,
        action: options.action,
        signalCount: options.signalCount || 0,
        signalDetails: options.signalDetails,
        authCode: currentAuth,
        country: cachedClientGeo?.country,
        city: cachedClientGeo?.city,
        isp: cachedClientGeo?.isp,
        latitude: cachedClientGeo?.latitude,
        longitude: cachedClientGeo?.longitude
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      // If server responded with BANNED or REVOKED, enforce immediate eviction!
      if (data.status === 'BANNED' || data.isBanned) {
        triggerEviction(data.message || 'تم حظر عنوان IP أو جهازك بواسطة الإدارة فوراً!');
        return { isBanned: true, isRevoked: true, message: data.message };
      }

      if (data.status === 'REVOKED' || data.isRevoked) {
        triggerEviction(data.message || 'تم حذف أو تعطيل كود الدخول الخاص بك بواسطة الإدارة!');
        return { isBanned: false, isRevoked: true, message: data.message };
      }

      return { isBanned: false, isRevoked: false, clientIp: data.clientIp };
    }
  } catch (err) {
    // If backend is unreachable (e.g. static Vercel hosting), use client-side persistent monitoring
    return handleClientFallbackPing(info, options, currentAuth);
  }

  return { isBanned: false, isRevoked: false };
};

// Resilient Client-Side Fallback for Static Vercel Hosting
function handleClientFallbackPing(
  info: DeviceInfo, 
  options: TrackPingOptions, 
  authCode: string
): { isBanned: boolean; isRevoked: boolean; message?: string } {
  try {
    // Check if banned in local storage
    const bannedIps = JSON.parse(localStorage.getItem('q8_banned_ips') || '[]');
    const bannedFps = JSON.parse(localStorage.getItem('q8_banned_fps') || '[]');

    if (bannedFps.includes(info.fingerprint)) {
      triggerEviction('تم حظر جهازك بواسطة الإدارة');
      return { isBanned: true, isRevoked: true, message: 'تم حظر جهازك بواسطة الإدارة' };
    }

    // Save visitor in local tracking store for admin panel
    const visitors = JSON.parse(localStorage.getItem('q8_local_visitors') || '[]');
    const now = new Date().toISOString();
    const existingIndex = visitors.findIndex((v: any) => v.fingerprint === info.fingerprint);

    if (existingIndex >= 0) {
      visitors[existingIndex].lastSeen = now;
      if (options.page && !visitors[existingIndex].pagesViewed?.includes(options.page)) {
        visitors[existingIndex].pagesViewed = visitors[existingIndex].pagesViewed || [];
        visitors[existingIndex].pagesViewed.push(options.page);
      }
      if (options.signalDetails) {
        visitors[existingIndex].createdItems = visitors[existingIndex].createdItems || [];
        visitors[existingIndex].createdItems.unshift(options.signalDetails);
      }
      if (options.signalCount) {
        visitors[existingIndex].totalSignals = (visitors[existingIndex].totalSignals || 0) + options.signalCount;
      }
    } else {
      visitors.unshift({
        id: Date.now(),
        ip: '197.34.112.89', // Simulated client IP if offline
        fingerprint: info.fingerprint,
        deviceName: info.deviceName,
        browser: info.browser,
        os: info.os,
        sessionCount: 1,
        firstSeen: now,
        lastSeen: now,
        pagesViewed: options.page ? [options.page] : ['بوابة تسجيل الدخول'],
        createdItems: options.signalDetails ? [options.signalDetails] : [],
        totalSignals: options.signalCount || 0,
        authCode,
        isBanned: false
      });
    }

    localStorage.setItem('q8_local_visitors', JSON.stringify(visitors.slice(0, 100)));
  } catch (e) {}

  return { isBanned: false, isRevoked: false };
}

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Shield, 
  Users, 
  Monitor, 
  Smartphone, 
  Globe, 
  Eye, 
  Ban, 
  Trash2, 
  PowerOff, 
  RefreshCw, 
  Key, 
  Copy, 
  Check, 
  Clock, 
  Plus, 
  Search, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Radio, 
  Cpu, 
  Sliders, 
  Lock, 
  Unlock, 
  Activity, 
  CalendarPlus, 
  CheckCircle2, 
  LogOut,
  Laptop,
  CheckCircle,
  FileText,
  MapPin,
  FolderLock,
  UserCheck,
  UserX,
  ExternalLink
} from 'lucide-react';
import { copyToClipboard } from './utils';
import { lookupIpGeo, getFlagEmoji, getGoogleMapsUrl, IpGeoData } from './services/ipGeoService';
import MaterialsModal from './components/MaterialsModal';

const ADMIN_MASTER_PASSWORD = "Q8_ADMIN_9731_ROOT_X2";
const CURRENT_VIP_PASSWORD = "Q8_VIP_6419_T2Z";

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/session');
      if (res.ok) {
        setIsAdmin(true);
        setLoading(false);
        return;
      }
    } catch(e) {}

    // Fallback check
    if (localStorage.getItem('q8_admin_logged_in') === 'true') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040612] flex items-center justify-center font-sans text-cyan-400" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_20px_rgba(0,240,255,0.5)]" />
          <span className="text-xs font-mono font-bold tracking-widest">QV DEV ROOT VERIFICATION...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050716] text-slate-100 font-sans overflow-x-hidden selection:bg-cyan-500/30 relative" dir="rtl">
      {/* Cinematic Cyber Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(to right, #00F0FF 1px, transparent 1px), linear-gradient(to bottom, #00F0FF 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} 
        />
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-600/10 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full min-h-screen p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col">
        {!isAdmin ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <AdminLoginScreen onLogin={() => setIsAdmin(true)} />
          </div>
        ) : (
          <AdminDashboardView onLogout={() => {
            fetch('/api/admin/logout', { method: 'POST' }).finally(() => {
              localStorage.removeItem('q8_admin_logged_in');
              localStorage.removeItem('q8_admin_token');
              setIsAdmin(false);
            });
          }} />
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// LOGIN SCREEN
// ----------------------------------------------------
function AdminLoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() })
      });

      if (res.ok) {
        localStorage.setItem('q8_admin_logged_in', 'true');
        onLogin();
      } else {
        if (password.trim() === ADMIN_MASTER_PASSWORD) {
          localStorage.setItem('q8_admin_logged_in', 'true');
          onLogin();
        } else {
          setError('كلمة مرور الإدارة غير صحيحة');
        }
      }
    } catch (e) {
      if (password.trim() === ADMIN_MASTER_PASSWORD) {
        localStorage.setItem('q8_admin_logged_in', 'true');
        onLogin();
      } else {
        setError('تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً');
      }
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full max-w-md bg-gradient-to-b from-[#0c102a]/95 via-[#07091d]/95 to-[#03040f]/98 p-6 sm:p-8 rounded-3xl border-2 border-cyan-500/40 shadow-[0_20px_80px_rgba(0,240,255,0.25)] relative overflow-hidden backdrop-blur-2xl"
    >
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent" />

      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border-2 border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.3)] animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>
      </div>

      <h1 className="text-2xl font-black text-center text-white mb-2">لوحة القيادة والمراقبة VIP</h1>
      <p className="text-xs text-slate-400 text-center mb-6 font-bold leading-relaxed">
        تسجيل دخول المسؤولين فقط • مراقبة الزوار وأجهزة المستخدمين وإدارة الأكواد فورياً
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة مرور المسؤول..."
            autoFocus
            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-cyan-500/30 text-white placeholder-slate-500 text-center font-mono text-base focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-400 text-center font-bold bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-sm transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'جاري التحقق الأمني...' : 'تسجيل الدخول للنظام'}
        </button>

        <a
          href="/"
          className="text-center text-xs text-slate-400 hover:text-cyan-300 font-bold mt-2 transition-colors"
        >
          العودة لواجهة البوت الرئيسية
        </a>
      </form>
    </motion.div>
  );
}

// ----------------------------------------------------
// MAIN DASHBOARD VIEW
// ----------------------------------------------------
function AdminDashboardView({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'visitors' | 'codes' | 'vip' | 'materials' | 'logs'>('visitors');
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [stats, setStats] = useState<any>({
    totalVisitors: 0,
    onlineNow: 0,
    totalSessions: 0,
    totalSignals: 0,
    bannedIpsCount: 0,
    codes: { total: 0, active: 0, unused: 0, expired: 0, suspended: 0 },
    vipLock: { isBound: false, boundIp: null, boundDevice: null, activatedAt: null }
  });

  const [visitors, setVisitors] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [visitorFilter, setVisitorFilter] = useState<'all' | 'online' | 'registered' | 'guests' | 'banned'>('all');
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [cairoTime, setCairoTime] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // New Code Form State
  const [genCount, setGenCount] = useState(1);
  const [genPrefix, setGenPrefix] = useState('QV-DEV');
  const [genDays, setGenDays] = useState(30);
  const [genNotes, setGenNotes] = useState('تم الإنشاء بواسطة الإدارة');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Clock in Cairo
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Date().toLocaleTimeString('en-US', {
          timeZone: 'Africa/Cairo',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        });
        setCairoTime(timeStr);
      } catch (e) {}
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch all dashboard data
  const fetchData = useCallback(async () => {
    try {
      const [statsRes, visitorsRes, codesRes, logsRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.ok ? r.json() : null),
        fetch('/api/admin/visitors').then(r => r.ok ? r.json() : null),
        fetch('/api/admin/codes').then(r => r.ok ? r.json() : null),
        fetch('/api/admin/logs').then(r => r.ok ? r.json() : null)
      ]);

      if (statsRes) setStats(statsRes);
      if (visitorsRes) setVisitors(visitorsRes);
      if (codesRes) setCodes(codesRes);
      if (logsRes) setLogs(logsRes);

      // Fallback local visitors if server returned empty (e.g. static Vercel)
      if (!visitorsRes || visitorsRes.length === 0) {
        try {
          const localVisitors = JSON.parse(localStorage.getItem('q8_local_visitors') || '[]');
          if (localVisitors.length > 0) {
            setVisitors(localVisitors);
            setStats((prev: any) => ({
              ...prev,
              totalVisitors: localVisitors.length,
              onlineNow: 1
            }));
          }
        } catch(e) {}
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh interval (every 4 seconds for real-time surveillance)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchData();
    }, 4000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  // Ban Visitor / IP
  const handleBanVisitor = async (ip: string, fingerprint?: string) => {
    if (!confirm(`هل أنت متأكد من حظر عنوان IP (${ip}) وطرد هذا الجهاز فوراً من البوت؟`)) return;
    try {
      await fetch('/api/admin/visitors/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, fingerprint, reason: 'حظر يدوي أمني من الإدارة' })
      });
      showNotification(`تم حظر IP (${ip}) وطرد الجهاز فوراً.`);
      fetchData();
    } catch (e) {
      showNotification('حدث خطأ أثناء الحظر');
    }
  };

  // Unban Visitor / IP
  const handleUnbanVisitor = async (ip: string, fingerprint?: string) => {
    try {
      await fetch('/api/admin/visitors/unban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, fingerprint })
      });
      showNotification(`تم إلغاء حظر IP (${ip}) بنجاح.`);
      fetchData();
    } catch (e) {
      showNotification('حدث خطأ أثناء فك الحظر');
    }
  };

  // Generate Codes
  const handleGenerateCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/codes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: genCount,
          prefix: genPrefix,
          days: genDays,
          notes: genNotes
        })
      });
      if (res.ok) {
        showNotification(`تم توليد ${genCount} كود جديد بنجاح.`);
        fetchData();
      }
    } catch (e) {
      showNotification('فشل توليد الأكواد');
    }
    setLoading(false);
  };

  // Code Action (Delete, Suspend, Extend)
  const handleCodeAction = async (code: string, action: string, data?: any) => {
    try {
      if (action === 'delete') {
        if (!confirm(`تحذير أمني: حذف الكود (${code}) سيؤدي لطرد أي مستخدم مسجل به فوراً لي صفحة تسجيل الدخول! هل تريد المتابعة؟`)) return;
        await fetch(`/api/admin/codes/${code}`, { method: 'DELETE' });
        showNotification(`تم حذف الكود (${code}) وطرد أي جهاز مسجل به فوراً.`);
      } else if (action === 'status') {
        await fetch(`/api/admin/codes/${code}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: data })
        });
        showNotification(`تم تغيير حالة الكود (${code}) إلى ${data}.`);
      } else if (action === 'extend') {
        const days = prompt('أدخل عدد الأيام لتمديد الكود:', '30');
        if (!days) return;
        await fetch(`/api/admin/codes/${code}/extend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ days: parseInt(days) })
        });
        showNotification(`تم تمديد الكود (${code}) لمدة ${days} يوم.`);
      }
      fetchData();
    } catch (e) {
      showNotification('فشل تنفيذ الإجراء');
    }
  };

  // Reset VIP Device & IP Binding
  const handleResetVipBinding = async () => {
    if (!confirm('هل تريد فك ارتباط الهاتف وشبكة الواي فاي الحالية لكلمة مرور VIP والسماح بربط هاتف وشبكة جديدة؟')) return;
    try {
      const res = await fetch('/api/admin/vip/reset', { method: 'POST' });
      if (res.ok) {
        showNotification('تم فك ارتباط الجهاز وشبكة الواي فاي لكلمة مرور VIP بنجاح.');
        fetchData();
      }
    } catch(e) {
      showNotification('فشل فك الارتباط');
    }
  };

  // Filter visitors
  const filteredVisitors = visitors.filter(v => {
    const matchSearch = 
      (v.ip && v.ip.includes(search)) ||
      (v.deviceName && v.deviceName.toLowerCase().includes(search.toLowerCase())) ||
      (v.fingerprint && v.fingerprint.toLowerCase().includes(search.toLowerCase())) ||
      (v.authCode && v.authCode.toLowerCase().includes(search.toLowerCase())) ||
      (v.country && v.country.toLowerCase().includes(search.toLowerCase())) ||
      (v.city && v.city.toLowerCase().includes(search.toLowerCase()));

    if (!matchSearch) return false;
    if (visitorFilter === 'online') return v.isOnline;
    if (visitorFilter === 'registered') return !!(v.authCode && v.authCode.trim().length > 0);
    if (visitorFilter === 'guests') return !v.authCode || v.authCode.trim().length === 0;
    if (visitorFilter === 'banned') return v.isBanned;
    return true;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-cyan-950/95 border border-cyan-400 text-cyan-200 text-xs font-black shadow-[0_0_30px_rgba(0,240,255,0.4)] backdrop-blur-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <ShieldAlert className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">مركز إدارة ومراقبة QV DEV</h1>
              <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold">PRO ROOT</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">مراقبة عنوان IP، تصفح الزوار، الجلسات، الأكواد، والأمان الفوري</p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Cairo Live Time */}
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>توقيت مصر: {cairoTime || "00:00:00"}</span>
          </div>

          {/* Auto Refresh Switch */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              autoRefresh 
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300' 
                : 'bg-white/5 border border-white/10 text-slate-400'
            }`}
            title="تحديث تلقائي كل 4 ثواني للمراقبة الحية"
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span>مراقبة حية {autoRefresh ? 'مفعلة' : 'متوقفة'}</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={() => fetchData()}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="تحديث يدوي"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Back to Bot */}
          <a
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-black transition-all flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>الواجهة</span>
          </a>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* Global Real-Time Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
        {[
          { label: 'متصلون الآن', val: stats.onlineNow || 0, sub: 'نشط خلال 60 ثانية', icon: Radio, color: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'from-emerald-950/20' },
          { label: 'إجمالي الزوار', val: stats.totalVisitors || 0, sub: `${visitors.filter(v => v.authCode).length} مسجلين • ${visitors.filter(v => !v.authCode).length} زوار`, icon: Users, color: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'from-cyan-950/20' },
          { label: 'الأعضاء المسجلون', val: visitors.filter(v => v.authCode).length, sub: 'مسجل بكود دخول', icon: UserCheck, color: 'text-blue-400', border: 'border-blue-500/30', glow: 'from-blue-950/20' },
          { label: 'الزوار غير المسجلين', val: visitors.filter(v => !v.authCode).length, sub: 'تصفح البوابة فقط', icon: Eye, color: 'text-purple-400', border: 'border-purple-500/30', glow: 'from-purple-950/20' },
          { label: 'أكواد فعالة', val: stats.codes?.active || 0, sub: `${stats.codes?.unused || 0} جديدة`, icon: Key, color: 'text-amber-400', border: 'border-amber-500/30', glow: 'from-amber-950/20' },
          { label: 'عناوين محظورة', val: stats.bannedIpsCount || 0, sub: 'محظور من الإدارة', icon: Ban, color: 'text-rose-400', border: 'border-rose-500/30', glow: 'from-rose-950/20' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`p-4 rounded-2xl bg-gradient-to-b ${card.glow} to-white/[0.01] border ${card.border} backdrop-blur-md flex flex-col justify-between shadow-lg relative overflow-hidden`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-400 font-bold">{card.label}</span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div>
                <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${card.color}`}>{card.val}</span>
                <p className="text-[10px] text-slate-500 mt-0.5">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md overflow-x-auto">
        {[
          { id: 'visitors', label: 'رادار مراقبة الزوار ورصد IP والخرائط', count: visitors.length, icon: Globe },
          { id: 'codes', label: 'إدارة وتوليد الأكواد (حذف وطرد)', count: codes.length, icon: Key },
          { id: 'materials', label: 'خزنة المواد والاستراتيجيات (Vercel)', count: undefined, icon: FolderLock },
          { id: 'vip', label: 'قفل VIP (هاتف واحد + واي فاي)', icon: Lock },
          { id: 'logs', label: 'سجل العمليات والأمان المباشر', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/25 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-white/10 text-slate-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* TAB 1: LIVE VISITORS SURVEILLANCE & IP MONITORING               */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'visitors' && (
        <div className="flex flex-col gap-4">
          
          {/* Controls & Search */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400">تصفية الزوار:</span>
              {[
                { id: 'all', label: `جميع الزوار (${visitors.length})` },
                { id: 'registered', label: `👑 المسجلين فقط (${visitors.filter(v => v.authCode).length})` },
                { id: 'guests', label: `👁️ الزوار غير المسجلين (${visitors.filter(v => !v.authCode).length})` },
                { id: 'online', label: `🟢 المتصلون الآن (${visitors.filter(v => v.isOnline).length})` },
                { id: 'banned', label: `🚫 المحظورون (${visitors.filter(v => v.isBanned).length})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setVisitorFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    visitorFilter === f.id
                      ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="بحث بـ IP أو الدولة أو الجهاز أو الكود..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          {/* Visitors Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredVisitors.map((v) => {
              const mapsUrl = getGoogleMapsUrl(v.latitude, v.longitude, `${v.city || ''}, ${v.country || v.ip}`);
              const isRegistered = !!(v.authCode && v.authCode.trim().length > 0);

              return (
              <motion.div
                key={v.id || v.fingerprint}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border backdrop-blur-xl flex flex-col gap-3.5 transition-all ${
                  v.isBanned 
                    ? 'bg-rose-950/20 border-rose-500/40' 
                    : v.isOnline 
                      ? 'bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.1)]' 
                      : 'bg-white/[0.02] border-white/10'
                }`}
              >
                {/* Header: IP & Device info & Geolocation Google Maps */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      v.isBanned ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                    }`}>
                      {v.deviceName?.includes('هاتف') || v.deviceName?.includes('iPhone') || v.deviceName?.includes('Android') ? (
                        <Smartphone className="w-5 h-5" />
                      ) : (
                        <Laptop className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      {/* IP and Direct Google Maps Icon Link */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-white tracking-wide">{v.ip}</span>
                        
                        {/* Copy IP button */}
                        <button
                          onClick={() => copyToClipboard(v.ip)}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="نسخ عنوان IP"
                        >
                          <Copy className="w-3 h-3" />
                        </button>

                        {/* Google Maps Pin & Direct Location Link */}
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                          title="عرض موقع IP ومكان الاتصال على خرائط Google Maps"
                        >
                          <MapPin className="w-3 h-3 text-emerald-400 animate-bounce" />
                          <span>Google Maps</span>
                        </a>
                      </div>

                      {/* Device & Location details */}
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-cyan-300 font-bold flex items-center gap-1">
                          <span>{v.country ? `${v.country}` : 'موقع جغرافي مرصود'}</span>
                          {v.city && <span className="text-slate-400">({v.city})</span>}
                        </span>
                        <span>•</span>
                        <span>{v.deviceName || 'جهاز غير محدد'}</span>
                        <span>•</span>
                        <span>{v.browser}</span>
                        <span>•</span>
                        <span>{v.os}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges: Registered/Guest & Online/Banned */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div>
                      {v.isBanned ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-1">
                          <Ban className="w-3 h-3" />
                          <span>محظور أمنياً</span>
                        </span>
                      ) : v.isOnline ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>متصل الآن</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-slate-400">
                          غير متصل
                        </span>
                      )}
                    </div>

                    {/* Member type badge */}
                    <div>
                      {isRegistered ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                          <UserCheck className="w-2.5 h-2.5" />
                          <span>عضو مسجل</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center gap-1">
                          <Eye className="w-2.5 h-2.5" />
                          <span>زائر بوابة</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metrics Row: Sessions, Signals, Dates, Registration Code */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-black/30 border border-white/5 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">الجلسات في البوت:</span>
                    <span className="font-mono font-bold text-cyan-300">{v.sessionCount || 1} جلسات</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">الإشارات المنشأة:</span>
                    <span className="font-mono font-bold text-amber-300">{v.totalSignals || 0} صفقة</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">حالة التسجيل والكود:</span>
                    <span className={`font-mono font-bold ${isRegistered ? 'text-emerald-300' : 'text-slate-400'}`}>
                      {isRegistered ? (v.authCode || 'كود VIP') : 'غير مسجل (زائر)'}
                    </span>
                  </div>
                </div>

                {/* Timestamps: First seen & Last seen */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono bg-white/[0.01] px-2 py-1 rounded-lg">
                  <div>
                    <span className="text-slate-500 ml-1">أول ظهور:</span>
                    <span>{v.firstSeen ? new Date(v.firstSeen).toLocaleDateString('ar-EG') + ' ' + new Date(v.firstSeen).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 ml-1">آخر نشاط:</span>
                    <span>{v.lastSeen ? new Date(v.lastSeen).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}</span>
                  </div>
                </div>

                {/* What they browsed (ماذا تصفح) */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span>ماذا تصفح في البوت:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {v.pagesViewed && v.pagesViewed.length > 0 ? (
                      v.pagesViewed.map((page: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                          {page}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-500">بوابة تسجيل الدخول</span>
                    )}
                  </div>
                </div>

                {/* What they created (ماذا انشئ) */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>ماذا أنشأ من صفقات وإشارات:</span>
                  </span>
                  <div className="flex flex-col gap-1 max-h-24 overflow-y-auto pr-1">
                    {v.createdItems && v.createdItems.length > 0 ? (
                      v.createdItems.map((item: string, idx: number) => (
                        <div key={idx} className="px-2 py-1 rounded bg-amber-950/20 border border-amber-500/20 text-amber-200 text-[10px] font-mono leading-tight">
                          • {item}
                        </div>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">لم يقم بتوليد إشارات حتى الآن</span>
                    )}
                  </div>
                </div>

                {/* Actions: Instant Ban or Unban */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
                  <span className="text-[9px] font-mono text-slate-500 truncate">
                    بصمة الجهاز: {v.fingerprint}
                  </span>

                  <div>
                    {v.isBanned ? (
                      <button
                        onClick={() => handleUnbanVisitor(v.ip, v.fingerprint)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>فك الحظر</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBanVisitor(v.ip, v.fingerprint)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
                        title="حظر عنوان IP وطرد الجهاز فوراً"
                      >
                        <Ban className="w-3 h-3" />
                        <span>حظر IP وطرد فوري</span>
                      </button>
                    )}
                  </div>
                </div>

              </motion.div>
              );
            })}

            {filteredVisitors.length === 0 && (
              <div className="col-span-full p-12 text-center rounded-2xl bg-white/[0.01] border border-white/5 text-slate-500">
                لا توجد سجلات زوار مطابقة للبحث
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 2: CODE GENERATOR & INSTANT REVOCATION                        */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'codes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Generator Box */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl flex flex-col gap-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>توليد أكواد اشتراك جديدة</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">بادئة الكود (Prefix):</label>
                <input
                  type="text"
                  value={genPrefix}
                  onChange={(e) => setGenPrefix(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono font-bold focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">المدة والصلاحية:</label>
                <select
                  value={genDays}
                  onChange={(e) => setGenDays(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d1f] border border-white/10 text-white text-xs font-bold focus:border-cyan-400 outline-none"
                >
                  <option value={1}>يوم واحد (تجريبي)</option>
                  <option value={7}>أسبوع واحد (7 أيام)</option>
                  <option value={30}>شهر كامل (30 يوم)</option>
                  <option value={90}>3 أشهر (90 يوم)</option>
                  <option value={365}>سنة كاملة (365 يوم)</option>
                  <option value={3650}>دائم مدى الحياة</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">عدد الأكواد المراد إنشاؤها:</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={genCount}
                  onChange={(e) => setGenCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono font-bold focus:border-cyan-400 outline-none text-center"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">ملاحظات / اسم العضو:</label>
                <input
                  type="text"
                  value={genNotes}
                  onChange={(e) => setGenNotes(e.target.value)}
                  placeholder="مثال: اشتراك VIP خاص..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed">
                ⚡ بمجرد حذف الكود أو إيقافه من اللوحة، سيتم طرد أي عضو مسجل بهذا الكود فوراً لي صفحة تسجيل الدخول!
              </div>

              <button
                onClick={handleGenerateCodes}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'جاري التوليد...' : `توليد (${genCount}) كود الآن`}
              </button>
            </div>
          </div>

          {/* Codes List Table */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl lg:col-span-2 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>قائمة الأكواد المسجلة في النظام ({codes.length})</span>
              </h3>

              <div className="relative w-full sm:w-60">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث بالكود أو الملاحظات..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pr-9 pl-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 pb-2">
                    <th className="pb-3 pr-2 font-bold">الكود</th>
                    <th className="pb-3 font-bold">الحالة</th>
                    <th className="pb-3 font-bold">الانتهاء</th>
                    <th className="pb-3 font-bold">IP المربوط</th>
                    <th className="pb-3 font-bold text-center">إجراءات الأمان الفورية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {codes
                    .filter(c => c.code?.toLowerCase().includes(search.toLowerCase()) || (c.notes && c.notes.includes(search)))
                    .map((c) => (
                      <tr key={c.id || c.code} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs">{c.code}</span>
                            <button
                              onClick={() => copyToClipboard(c.code)}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                              title="نسخ الكود"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          {c.notes && <span className="text-[10px] text-slate-500 font-sans block">{c.notes}</span>}
                        </td>

                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            c.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            c.status === 'unused' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                            c.status === 'expired' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {c.status === 'active' ? 'فعال' : c.status === 'unused' ? 'جديد' : c.status === 'expired' ? 'منتهي' : 'موقوف'}
                          </span>
                        </td>

                        <td className="py-3 text-[11px] text-slate-300 font-sans">
                          {c.expires_at ? new Date(c.expires_at).toLocaleDateString('ar-EG') : 'دائم'}
                        </td>

                        <td className="py-3 text-[11px] text-slate-400">
                          {c.bound_ip || '-'}
                        </td>

                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5 font-sans">
                            {/* Toggle Suspend / Active */}
                            {c.status === 'active' ? (
                              <button
                                onClick={() => handleCodeAction(c.code, 'status', 'suspended')}
                                className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[10px] font-black cursor-pointer"
                                title="إيقاف مؤقت وطرد المستخدم فوراً"
                              >
                                إيقاف (طرد)
                              </button>
                            ) : c.status === 'suspended' ? (
                              <button
                                onClick={() => handleCodeAction(c.code, 'status', 'active')}
                                className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[10px] font-black cursor-pointer"
                                title="إعادة التفعيل"
                              >
                                تفعيل
                              </button>
                            ) : null}

                            {/* Extend */}
                            <button
                              onClick={() => handleCodeAction(c.code, 'extend')}
                              className="p-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300"
                              title="تمديد الصلاحية"
                            >
                              <CalendarPlus className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete (Instant Kick) */}
                            <button
                              onClick={() => handleCodeAction(c.code, 'delete')}
                              className="p-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 cursor-pointer"
                              title="حذف نهائي وطرد المستخدم فوراً"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 3: VIP 1-PHONE & 1-WI-FI HARDWARE LOCK                        */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'vip' && (
        <div className="max-w-2xl mx-auto w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0c102a]/95 via-[#07091d]/95 to-[#03040f]/98 border-2 border-cyan-500/40 backdrop-blur-2xl shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">نظام القفل الحصري لكلمة مرور VIP</h3>
              <p className="text-xs text-slate-400 mt-0.5">مربوط بهاتف واحد وشبكة واي فاي واحدة فقط لمنع أي مشاركة</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/30 flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-slate-400 font-sans">كلمة مرور VIP الحالية:</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-cyan-300 text-sm">{CURRENT_VIP_PASSWORD}</span>
                <button
                  onClick={() => copyToClipboard(CURRENT_VIP_PASSWORD)}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-white/5 font-sans">
              <span className="text-slate-400">حالة القفل والربط:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                stats.vipLock?.isBound 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {stats.vipLock?.isBound ? '🔒 مقفل على هاتف وشبكة معينة' : '🔓 بانتظار أول دخول لربط الهاتف'}
              </span>
            </div>

            {stats.vipLock?.isBound && (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-400 font-sans">الجهاز المقفل عليه:</span>
                  <span className="text-white font-bold">{stats.vipLock.boundDevice || 'هاتف العضو الأساسي'}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-400 font-sans">شبكة الواي فاي المقفلة:</span>
                  <span className="text-cyan-300 font-bold">{stats.vipLock.boundIp || 'IP مسجل'}</span>
                </div>

                <div className="flex items-center justify-between font-sans">
                  <span className="text-slate-400">تاريخ أول ربط:</span>
                  <span className="text-slate-300">
                    {stats.vipLock.activatedAt ? new Date(stats.vipLock.activatedAt).toLocaleString('ar-EG') : '-'}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs leading-relaxed font-sans">
            🛡️ في حال أراد العضو تغيير هاتفه أو شبكة الواي فاي، يمكنك النقر على الزر أدناه لفك الارتباط والسماح له بالدخول من الجهاز الجديد ليتم قفله عليه تلقائياً.
          </div>

          <button
            onClick={handleResetVipBinding}
            className="w-full py-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Unlock className="w-4 h-4" />
            <span>فك ارتباط الهاتف وشبكة الواي فاي الحالية</span>
          </button>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB: MATERIALS VAULT (Vercel-Compatible Cloud Storage)            */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'materials' && (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-cyan-400" />
                <span>مساحة تخزين المواد والاستراتيجيات (متوافقة 100% مع Vercel)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                تخزين ومزامنة استراتيجيات التداول، ملفات PDF، شروحات الفيديو وروابط القنوات مع دعم التخزين السحابي على استضافة Vercel.
              </p>
            </div>

            <button
              onClick={() => setShowMaterialsModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.35)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>فتح وتصفح خزنة المواد التخزينية</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col gap-1.5">
              <span className="text-xs font-black text-cyan-300">توافق كامل مع Vercel</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تعمل الخزنة بنظام التخزين المزدوج (Dual Storage Vault) مع حفظ دائم في الذاكرة المحلية وقاعدة البيانات لمنع فقدان أي ملف أو مادة.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col gap-1.5">
              <span className="text-xs font-black text-purple-300">تحميل ومشاهدة فورية</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تسمح للأعضاء والزوار بفتح كتب واستراتيجيات التداول وفيديوهات البوت مباشرة بنقرة زر واحدة دون الحاجة لتطبيقات إضافية.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-1.5">
              <span className="text-xs font-black text-emerald-300">حماية محتوى VIP</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                إمكانية تخصيص المواد الحساسة وتحديد ما إذا كانت حصرية فقط لمشتركي VIP أو عامة لكافة زوار البوت.
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowMaterialsModal(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <FolderLock className="w-4 h-4" />
              <span>إدارة المواد المرفوعة (إضافة، تعديل، حذف، تحميل)</span>
            </button>
          </div>
        </div>
      )}

      {/* Materials Modal */}
      <MaterialsModal
        isOpen={showMaterialsModal}
        onClose={() => setShowMaterialsModal(false)}
        isAdmin={true}
      />

      {/* ----------------------------------------------------------------- */}
      {/* TAB 4: AUDIT LOGS                                                 */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'logs' && (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl flex flex-col gap-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>سجل الأحداث والعمليات الأمنية المباشرة ({logs.length})</span>
          </h3>

          <div className="space-y-2 font-mono text-xs">
            {logs.map((log: any) => (
              <div key={log.id} className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] font-bold">
                    {log.action}
                  </span>
                  <span className="text-slate-300">{log.details}</span>
                  <span className="text-slate-500 text-[10px]">({log.ip})</span>
                </div>
                <span className="text-slate-500 text-[10px]">
                  {log.timestamp ? new Date(log.timestamp).toLocaleTimeString('ar-EG') : ''}
                </span>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="p-8 text-center text-slate-500 font-sans">
                لا توجد سجلات أمنية حديثة
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

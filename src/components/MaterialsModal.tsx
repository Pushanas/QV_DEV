import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderLock, 
  Download, 
  ExternalLink, 
  FileText, 
  Video, 
  LineChart, 
  Share2, 
  Sparkles, 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Globe, 
  ShieldAlert,
  Search,
  BookOpen
} from 'lucide-react';
import { BotMaterial, getStoredMaterials, saveMaterial, deleteMaterial } from '../services/materialStorage';

interface MaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export default function MaterialsModal({ isOpen, onClose, isAdmin = false }: MaterialsModalProps) {
  const [materials, setMaterials] = useState<BotMaterial[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BotMaterial | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'strategy' | 'video' | 'pdf' | 'indicator' | 'announcement' | 'link'>('strategy');
  const [formDesc, setFormDesc] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formBadge, setFormBadge] = useState('حصري');
  const [formVipOnly, setFormVipOnly] = useState(true);
  const [formFileSize, setFormFileSize] = useState('2.5 MB');

  useEffect(() => {
    if (isOpen) {
      loadMaterials();
    }
  }, [isOpen]);

  const loadMaterials = async () => {
    const list = await getStoredMaterials();
    setMaterials(list);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    await saveMaterial({
      id: editingItem ? editingItem.id : undefined,
      title: formTitle.trim(),
      category: formCategory,
      description: formDesc.trim(),
      url: formUrl.trim() || 'https://t.me/QV_CODE',
      badge: formBadge.trim() || 'حصري',
      isVipOnly: formVipOnly,
      fileSize: formFileSize.trim() || '1.5 MB'
    });

    // Reset Form
    setShowAddModal(false);
    setEditingItem(null);
    setFormTitle('');
    setFormDesc('');
    setFormUrl('');
    loadMaterials();
  };

  const handleEdit = (item: BotMaterial) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormDesc(item.description);
    setFormUrl(item.url || '');
    setFormBadge(item.badge || 'حصري');
    setFormVipOnly(item.isVipOnly);
    setFormFileSize(item.fileSize || '2 MB');
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المادة التخزينية نهائياً؟')) return;
    await deleteMaterial(id);
    loadMaterials();
  };

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'strategy', label: 'استراتيجيات' },
    { id: 'pdf', label: 'ملفات PDF' },
    { id: 'video', label: 'فيديوهات' },
    { id: 'link', label: 'قنوات وروابط' },
  ];

  const filteredMaterials = materials.filter(m => {
    const matchCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                        m.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl max-h-[90vh] bg-[#070b1a] border border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <FolderLock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">خزنة المواد والاستراتيجيات الحصرية</h2>
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold">
                  QV CLOUD VAULT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">مساحة تخزين سحابية لكافة الأدلة والكتب وفيديوهات التداول الخاصة بالبوت</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormTitle('');
                  setFormDesc('');
                  setFormUrl('');
                  setShowAddModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مادة جديدة</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-white/5 bg-white/[0.01] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === c.id 
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
                    : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="بحث في المواد والاستراتيجيات..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pr-9 pl-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Materials List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-3 group relative backdrop-blur-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                    {item.badge || 'حصري'}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                    <span>{item.fileSize}</span>
                    {item.isVipOnly && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-bold">
                        VIP
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                </span>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                        title="تعديل المادة"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="حذف المادة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  <a
                    href={item.url || 'https://t.me/QV_CODE'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-black flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                  >
                    <span>فتح وتحميل</span>
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredMaterials.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 flex flex-col items-center gap-2">
              <FolderLock className="w-8 h-8 opacity-40 text-slate-400" />
              <span>لا توجد مواد تطابق البحث</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-xs text-slate-400">
          <span>متوافق تماماً مع استضافة Vercel مع التخزين المزدوج التلقائي</span>
          <a
            href="https://t.me/QV_CODE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 hover:underline font-bold flex items-center gap-1"
          >
            <span>قناة التحديثات @QV_CODE</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </motion.div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-[#0c102a] border border-cyan-500/50 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">
                {editingItem ? 'تعديل المادة التخزينية' : 'إضافة مادة تخزينية جديدة إلى Vercel'}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">عنوان المادة / الاستراتيجية:</label>
                <input 
                  type="text" 
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="مثال: مؤشر تأكيد الفجوات السعرية MT4"
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-400 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">القسم والتصنيف:</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#090d22] border border-white/10 text-white outline-none focus:border-cyan-400 text-xs"
                  >
                    <option value="strategy">استراتيجية</option>
                    <option value="pdf">ملف PDF / دليل</option>
                    <option value="video">فيديو شرح</option>
                    <option value="link">رابط خارجي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">شارة المادة (Badge):</label>
                  <input 
                    type="text"
                    value={formBadge}
                    onChange={e => setFormBadge(e.target.value)}
                    placeholder="دليل VIP / جديد"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-400 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">رابط التحميل أو المشاهدة (URL):</label>
                <input 
                  type="text"
                  value={formUrl}
                  onChange={e => setFormUrl(e.target.value)}
                  placeholder="https://t.me/QV_CODE أو رابط الملف"
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الوصف التفصيلي:</label>
                <textarea 
                  rows={3}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="اشرح محتوى المادة وفائدتها للمشترك..."
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-400 text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 mt-1">
                <span className="text-slate-300 font-bold">مقتصرة على مشتركي VIP فقط:</span>
                <input 
                  type="checkbox"
                  checked={formVipOnly}
                  onChange={e => setFormVipOnly(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black cursor-pointer shadow-lg"
                >
                  حفظ المادة التخزينية
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

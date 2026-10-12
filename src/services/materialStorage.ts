// Vercel-Compatible Resilient Storage & API for Bot Materials and Educational/Strategy Content
// Works seamlessly in SQLite (when backend server runs) and syncs to browser localStorage (when deployed statically on Vercel)

export interface BotMaterial {
  id: string;
  title: string;
  category: 'strategy' | 'video' | 'pdf' | 'indicator' | 'announcement' | 'link';
  description: string;
  url?: string;
  fileData?: string; // Base64 data URL if uploaded directly
  fileSize?: string;
  badge?: string;
  isVipOnly: boolean;
  downloads: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_MATERIALS: BotMaterial[] = [
  {
    id: 'mat-1',
    title: 'دليل استراتيجية كسر الفجوات السعرية (Price Gap Strategy)',
    category: 'pdf',
    description: 'شرح تفصيلي بالصور والأمثلة العملية لكيفية قنص صفقات الفجوات الصباحية بنسبة نجاح تفوق 93% على أزواج الذهب والعملات الرئيسية.',
    url: 'https://t.me/QV_CODE',
    fileSize: '3.4 MB',
    badge: 'دليل VIP',
    isVipOnly: true,
    downloads: 142,
    views: 520,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mat-2',
    title: 'فيديو شرح مؤشرات السيولة وخوارزمية QV DEV الذكية',
    category: 'video',
    description: 'درس مرئي كامل مدته 18 دقيقة يوضح طريقة قراءة إشارات الروبوت وتحديد نقاط الدخول والخروج ووقف الخسارة المضمونة.',
    url: 'https://t.me/QV_CODE',
    fileSize: '48.2 MB',
    badge: 'شرح فيديو',
    isVipOnly: false,
    downloads: 388,
    views: 1240,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mat-3',
    title: 'جدول إدارة رأس المال الصارم وحساب اللوت التلقائي',
    category: 'strategy',
    description: 'ملف تفاعلي لحساب حجم العقود المناسبة لكل حساب من 100$ وحتى 50,000$ لضمان حماية الحساب من أي تقلبات عنيفة.',
    url: 'https://t.me/QV_CODE',
    fileSize: '1.1 MB',
    badge: 'إدارة مخاطر',
    isVipOnly: true,
    downloads: 295,
    views: 810,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mat-4',
    title: 'رابط قناة التحديثات والتوصيات الفورية الرسمية @QV_CODE',
    category: 'link',
    description: 'الانضمام الفوري للقناة التليجرام الرسمية لتلقي التنبيهات اللحظية والأخبار العاجلة ونتائج الصفقات المباشرة.',
    url: 'https://t.me/QV_CODE',
    badge: 'رابط مباشر',
    isVipOnly: false,
    downloads: 914,
    views: 3100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const STORAGE_KEY = 'qv_bot_materials_vault_v1';

export const getStoredMaterials = async (): Promise<BotMaterial[]> => {
  // Try server first
  try {
    const res = await fetch('/api/materials');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {}

  // Fallback to localStorage (guarantees operation on static Vercel host)
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {}

  // Initialize defaults
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MATERIALS));
  } catch (e) {}
  return DEFAULT_MATERIALS;
};

export const saveMaterial = async (item: Partial<BotMaterial>): Promise<BotMaterial> => {
  const materials = await getStoredMaterials();
  const now = new Date().toISOString();
  
  let updatedItem: BotMaterial;
  
  if (item.id) {
    // Edit existing
    const index = materials.findIndex(m => m.id === item.id);
    if (index >= 0) {
      updatedItem = {
        ...materials[index],
        ...item,
        updatedAt: now
      } as BotMaterial;
      materials[index] = updatedItem;
    } else {
      updatedItem = {
        id: item.id,
        title: item.title || 'مادة بدون عنوان',
        category: item.category || 'strategy',
        description: item.description || '',
        url: item.url || '',
        fileData: item.fileData,
        fileSize: item.fileSize || '1 MB',
        badge: item.badge || 'جديد',
        isVipOnly: !!item.isVipOnly,
        downloads: 0,
        views: 0,
        createdAt: now,
        updatedAt: now
      };
      materials.unshift(updatedItem);
    }
  } else {
    // Create new
    updatedItem = {
      id: 'mat-' + Date.now(),
      title: item.title || 'مادة جديدة',
      category: item.category || 'strategy',
      description: item.description || '',
      url: item.url || '',
      fileData: item.fileData,
      fileSize: item.fileSize || '1 MB',
      badge: item.badge || 'جديد',
      isVipOnly: !!item.isVipOnly,
      downloads: 0,
      views: 0,
      createdAt: now,
      updatedAt: now
    };
    materials.unshift(updatedItem);
  }

  // Persist locally for immediate Vercel client-side availability
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
  } catch (e) {}

  // Also send to backend API
  try {
    await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItem)
    });
  } catch (e) {}

  return updatedItem;
};

export const deleteMaterial = async (id: string): Promise<boolean> => {
  let materials = await getStoredMaterials();
  materials = materials.filter(m => m.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
  } catch (e) {}

  try {
    await fetch(`/api/materials/${id}`, { method: 'DELETE' });
  } catch (e) {}

  return true;
};

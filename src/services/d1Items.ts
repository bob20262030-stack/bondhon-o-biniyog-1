export interface BondhonItem {
  id: number | string;
  title: string;
  description: string;
  image: string;
  link: string;
  created_at?: string;
}

const LOCAL_STORAGE_KEY = 'bondhon_d1_items_cache';

// Default initial items for immediate display and fallback
export const initialBondhonItems: BondhonItem[] = [
  {
    id: 1,
    title: 'বন্ধন গ্রীন ভ্যালি আবাসন প্রকল্প',
    description: 'ঢাকা-মাওয়া এক্সপ্রেসওয়ে সংলগ্ন আধুনিক সুযোগ-সুবিধা সম্বলিত ১০০% নির্ভেজাল সাব-কবলা প্লট।',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com/project-1',
    created_at: '2026-03-15 10:00:00'
  },
  {
    id: 2,
    title: 'পদ্মা রিভারভিউ ইকো রিসোর্ট সমবায়',
    description: 'পদ্মা সেতুর অদূরে পরিবেশবান্ধব ইকো ট্যুরিজম ও সমবায় কৃষি খামার প্রকল্প। শেয়ার ক্রয়ে নিয়মিত লভ্যাংশ।',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com/project-2',
    created_at: '2026-03-20 12:30:00'
  },
  {
    id: 3,
    title: 'সঞ্চয় ও শেয়ার বিনিয়োগ ক্যাম্পেইন ২০২৬',
    description: 'বন্ধন ও বিনিয়োগ বহুমুখী সমবায় সমিতি লিঃ এর বিশেষ শেয়ার বৃদ্ধি ক্যাম্পেইন। নিশ্চিত সঞ্চয় ও অগ্রগতি।',
    image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=800&q=80',
    link: 'https://example.com/project-3',
    created_at: '2026-03-25 15:45:00'
  }
];

function getCachedItems(): BondhonItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialBondhonItems;
  } catch {
    return initialBondhonItems;
  }
}

function setCachedItems(items: BondhonItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('LocalStorage save error for D1 cache:', err);
  }
}

// Fetch all items from Cloudflare D1 table bondhon_items via /api/items
export async function fetchD1Items(): Promise<{ items: BondhonItem[]; source: 'd1' | 'cache' }> {
  try {
    const res = await fetch('/api/items', {
      headers: { Accept: 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.items)) {
        if (data.items.length > 0) {
          setCachedItems(data.items);
          return { items: data.items, source: 'd1' };
        }
      }
    }
  } catch (err) {
    console.warn('Failed to fetch from /api/items directly, falling back to cache:', err);
  }

  // Fallback to local cache if offline or in dev without D1 active
  return { items: getCachedItems(), source: 'cache' };
}

// Save new item to Cloudflare D1 table bondhon_items via /api/items
export async function saveD1Item(itemData: {
  title: string;
  description: string;
  image: string;
  link: string;
}): Promise<{ success: boolean; item?: BondhonItem; error?: string }> {
  const newItem: BondhonItem = {
    id: Date.now(),
    title: itemData.title,
    description: itemData.description,
    image: itemData.image,
    link: itemData.link,
    created_at: new Date().toISOString()
  };

  // Always update local cache immediately for responsive UI
  const current = getCachedItems();
  const updated = [newItem, ...current];
  setCachedItems(updated);

  // Attempt save to Cloudflare D1
  try {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.item) {
        return { success: true, item: data.item };
      }
    }
  } catch (err: any) {
    console.warn('D1 POST failed, kept in local cache:', err);
  }

  return { success: true, item: newItem };
}

// Delete item from Cloudflare D1
export async function deleteD1Item(id: number | string): Promise<boolean> {
  const current = getCachedItems();
  const filtered = current.filter((it) => it.id !== id);
  setCachedItems(filtered);

  try {
    const res = await fetch(`/api/items?id=${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch {
    return true;
  }
}

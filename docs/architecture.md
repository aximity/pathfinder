# Mimari Kararlar

Pathfinder'ın yapısal kararları. Bu kararlar **tüm paketler boyunca değişmez** — değişim gerektiren durumlar önce `docs/decisions.md`'ye yazılır.

---

## 1. Data Access Layer zorunluluğu

### Ne

Component'ler veriye **sadece store üzerinden** erişir. `menu.json`'ı doğrudan import etmek **yasaktır**.

### Neden

Faz 1 → Faz 2 geçişinde (JSON → API) 30+ component'i yeniden yazmamak için. Store imzası aynı kalır, içi değişir. Component kodu tek satır dokunulmaz.

### Yanlış

```typescript
// component içinde
import menu from '$lib/data/menu.json';
const dish = menu.dishes.find(d => d.id === 'palazzo-breakfast');
```

### Doğru

```typescript
// component içinde
import { menuStore } from '$lib/stores/menu';
const dish = await menuStore.getById('palazzo-breakfast');
```

### Store fonksiyon imzaları (Paket 1'de kurulur, sonra değişmez)

```typescript
interface MenuStore {
  getById(id: string): Promise<Dish | null>;
  getByCategory(categoryId: string): Promise<Dish[]>;
  getAllCategories(): Promise<Category[]>;
  getAllDishes(): Promise<Dish[]>;
  search(query: string): Promise<Dish[]>;
  filterByAllergens(excluded: Allergen[]): Promise<Dish[]>;
  filterByDietFlags(required: DietFlag[]): Promise<Dish[]>;
}
```

Hepsi `async` — Faz 1'de instant dönseler bile imza Faz 2'yle uyumlu.

---

## 2. Faz 2 geçişi — "Veri kaynağı değişir, kod değişmez" prensibi

### Faz 1 store içi (Paket 1)

```typescript
// src/lib/stores/menu.ts
import menuData from '$lib/data/menu.json';
import type { Menu, Dish, Category } from '$lib/types/menu';

const data = menuData as Menu;
const dishMap = new Map<string, Dish>();
// ... Map kurulumu

export const menuStore = {
  async getById(id: string): Promise<Dish | null> {
    return dishMap.get(id) ?? null;
  },
  // ... diğerleri
};
```

### Faz 2 store içi (ilerde)

```typescript
// src/lib/stores/menu.ts (Faz 2)
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const menuStore = {
  async getById(id: string): Promise<Dish | null> {
    const res = await fetch(`${API_BASE}/api/dishes/${id}`);
    return res.ok ? res.json() : null;
  },
  // ... diğerleri
};
```

### Daha iyi: environment-aware (opsiyonel, Paket 1'de konulabilir)

```typescript
const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE ?? 'local';

export const menuStore = {
  async getById(id: string): Promise<Dish | null> {
    if (DATA_SOURCE === 'api') {
      const res = await fetch(`${API_BASE}/api/dishes/${id}`);
      return res.ok ? res.json() : null;
    }
    return dishMap.get(id) ?? null;
  },
};
```

`.env` dosyası:

```
# Faz 1
VITE_DATA_SOURCE=local

# Faz 2
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=https://pathfinder-api.example.com
```

### Kritik prensip

**JSON şeması = API response formatı.** Faz 2 backend'i yazıldığında `/api/dishes/:id` endpoint'i `menu.json`'daki `Dish` objesinin **birebir aynı formatını** döner. Bu kural tutulursa geçiş 1 dosya değişikliğine indirir.

---

## 3. Component sorumluluk sınırları

### "Aptal component" kuralı

Component'ler iş mantığı içermez. Sadece prop alır, UI render eder, event emit eder.

### Yanlış — component içinde filtreleme

```typescript
// DishCard.svelte içinde
<script>
  import menu from '$lib/data/menu.json';
  const relatedDishes = menu.dishes
    .filter(d => d.category_id === dish.category_id)
    .slice(0, 3);
</script>
```

### Doğru — logic store'da

```typescript
// menuStore.ts'ye eklenir
async getRelated(dishId: string, limit = 3): Promise<Dish[]> {
  const dish = await this.getById(dishId);
  if (!dish) return [];
  const all = await this.getByCategory(dish.category_id);
  return all.filter(d => d.id !== dishId).slice(0, limit);
}

// DishCard.svelte içinde
<script>
  import { menuStore } from '$lib/stores/menu';
  let related = $state<Dish[]>([]);
  $effect(async () => {
    related = await menuStore.getRelated(dish.id);
  });
</script>
```

### Avantajı

1. Aynı mantığı 3 sayfada yeniden yazmıyorsun
2. Test yazmak kolay — store'u test edersin, UI'yı ayrı
3. Faz 2'de backend'de index ile aynı mantık çalıştırılır — sorgular optimize edilir

---

## 4. State yönetimi

### Kullanılacak araçlar

**Svelte 5 runes** (Redux, Zustand vb. yasak — overkill):
- `$state` — reactive değer
- `$derived` — hesaplanmış değer (computed)
- `$effect` — side effect (DOM, localStorage, fetch)

### localStorage kullanım alanları

| Anahtar | Değer | Store dosyası |
|---|---|---|
| `pf:theme` | `"light"` \| `"dark"` \| `"system"` | `$lib/stores/theme.ts` |
| `pf:recent-dishes` | Son 10 yemek ID | `$lib/stores/recent.ts` |
| `pf:search-history` | Son 5 arama | `$lib/stores/searchHistory.ts` |
| `pf:favorites` | Favori yemek ID listesi | `$lib/stores/favorites.ts` (Paket 3+4) |

Her store kendi localStorage anahtarını yönetir. Prefix `pf:` — namespace çakışması önlenir.

---

## 5. Routing yapısı

File-based routing, SvelteKit native:

```
src/routes/
├── +layout.svelte              # ortak header, footer
├── +page.svelte                # ana sayfa (kategori grid)
├── kategori/
│   └── [id]/
│       └── +page.svelte        # /kategori/meat-chicken
├── yemek/
│   └── [id]/
│       └── +page.svelte        # /yemek/lamb-chops
└── ara/
    └── +page.svelte            # /ara?q=... (query param)
```

Türkçe path'ler tercih edildi — kullanıcı URL'i görürse anlasın. (Slug'lar İngilizce kalır.)

---

## 6. Stil yaklaşımı — Tailwind CSS

### Kurallar

- **Hardcoded hex renk yasak** — `bg-red-500` değil, `bg-danger` gibi custom token
- Dark mode: `dark:` prefix her component'te
- Responsive: mobile-first (`md:`, `lg:` gerekli oldukça)
- `@apply` kullanılmaz (Svelte scoped CSS ile yeterli)

### Tailwind config'de tanımlı custom token'lar

Paket 2'de netleşir. Şimdilik niyet:

```javascript
// tailwind.config.js (şema)
theme: {
  extend: {
    colors: {
      // semantic
      'danger': { light: '#...', dark: '#...' },
      'success': { light: '#...', dark: '#...' },
      'warning': { light: '#...', dark: '#...' },
      // category accents (11 kategori rengi)
    }
  }
}
```

---

## 7. Hata yönetimi

### Graceful degradation

Uygulama çökmez, her zaman kullanıcıya bilgi verir.

### Hata türleri

| Durum | Davranış |
|---|---|
| Yemek bulunamadı | "Bu yemek bulunamadı" sayfası, ana sayfaya dönüş |
| Kategori bulunamadı | 404 sayfası |
| Fotoğraf yüklenemedi | Placeholder SVG |
| Arama sonucu boş | "Arama kriterlerine uyan yemek yok" mesajı |
| Store hatası (Faz 2) | "Bağlantı sorunu" mesajı, retry butonu |
| JSON şema hatası | Console warning, uygulama yine çalışır |

### ErrorBoundary pattern

SvelteKit'te `+error.svelte` dosyaları her route seviyesinde özel hata sayfası tanımlar.

---

## 8. Test stratejisi

**Faz 1'de otomatik test ZORUNLU değil** (MVP önceliği), ama:

- TypeScript strict mode **zorunlu** (compile-time güvenlik)
- Store fonksiyonları için console'dan elle test (Paket 1 kabul kriteri)
- Ahmet telefonda manuel test (her paket sonunda)

**Faz 2'ye geçerken** eklenecek:
- Vitest ile store unit testleri
- Playwright ile E2E (arama akışı, detay sayfası)

---

## 9. Güvenlik

### Faz 1 için geçerli

- Build output'unda API key sızdırma yok (statik JSON)
- `.env` ve `.gitignore` doğru yapılandırılmış
- Dependency audit: `npm audit` düzenli çalıştırılır

### Faz 2'ye geçişte eklenecek

- JWT tabanlı auth
- Role-based access control (admin, chef, waiter)
- Parameterized query (SQL injection koruması)
- `flutter_secure_storage` ekivalenti web için (httpOnly cookie)
- Firebase Security Rules ekivalenti (backend endpoint guard)

---

## 10. Performance beklentileri

### Faz 1 hedefleri

- İlk yükleme: < 3 saniye (yavaş 3G'de)
- Navigation: < 100 ms (cache'den)
- Arama: < 100 ms (59 yemek için linear search yeterli)
- Bundle boyutu: < 200 KB (JS + CSS, gzipped)
- Lighthouse Mobile Performance: 90+

### Optimizasyon teknikleri

- Code splitting (SvelteKit otomatik)
- Image lazy loading
- Font preload (Tailwind default)
- Service worker cache (Paket 5'te)

---

## 11. Accessibility (a11y)

### Zorunlu

- Semantic HTML (`<button>`, `<nav>`, `<main>`, `<article>`)
- Tüm tıklanabilir elementler keyboard navigable
- Alt text her `<img>`'ye
- ARIA label interactive elementlerde
- Color contrast: WCAG AA (4.5:1 normal text, 3:1 büyük text)
- Focus visible state her yerde
- Minimum 44×44 px tap target

### Test

Chrome DevTools Lighthouse Accessibility skoru 95+ olmalı.

---

## 12. Faz 2 hazırlığı — şu an yapılacaklar

Bu 5 şey Faz 1'de yapılırsa Faz 2'ye geçiş ağrısız olur:

1. **Data access layer** — her veriye store üzerinden erişim
2. **Async fonksiyon imzaları** — sync olsalar bile async
3. **JSON şeması = API response formatı** — aynı yapı
4. **Environment config** — `VITE_DATA_SOURCE` değişkeni ile mod switch
5. **Version + timestamp alanları** — cache invalidation hazır

Bu 5 şey ekstra iş yaratmıyor — sadece "nasıl organize ediyoruz" kararı.

---

## 13. Faz 2'de ne değişecek

**Değişmeyecek:**
- Component kodu
- Route yapısı
- Store fonksiyon imzaları
- JSON/API şeması

**Değişecek:**
- Store fonksiyon içleri (fetch'e geçer)
- `.env` (API_BASE_URL eklenir)
- Yeni `/admin` route'ları
- Auth middleware

**Eklenecek:**
- Backend (FastAPI + DB)
- Admin UI (aynı SvelteKit projesinde)
- Auth sistemi
- Push notification infra

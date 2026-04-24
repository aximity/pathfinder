# Pathfinder

Mutfak-öncelikli dijital menü referans uygulaması. A la carte restoran şefleri ve servis ekibi, sipariş anında menü yemeklerinin içeriğini, yan garnitürünü, sosunu, alerjenlerini ve seçeneklerini en fazla 3 dokunuşta bulabilsin diye tasarlandı.

**Geliştirici:** Ahmet Hakan Yıldız (Aximity)
**Tür:** SvelteKit 2 + TypeScript + Tailwind CSS · Statik PWA
**Faz:** 1 — MVP (offline, tek kullanıcılı)

---

## Başlangıç (Windows)

Projenin kök klasöründe PowerShell açın:

```powershell
cd C:\Users\stare\Desktop\pathfinder
npm install
npm run dev
```

Tarayıcıda [http://localhost:5173](http://localhost:5173) açılır.

Telefondan test için bilgisayarın IP'si ile aynı Wi-Fi üzerinden:

```
http://<bilgisayar-IP>:5173
```

(`vite.config.ts` içinde `server.host: true` ayarı bu erişimi açıyor.)

---

## NPM komutları

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu (hot reload) |
| `npm run build` | Production build (statik dosyalar `build/` altına) |
| `npm run preview` | Production build'i yerel önizleme |
| `npm run check` | TypeScript + Svelte tip kontrolü (strict) |
| `npm run check:watch` | Tip kontrolü izleme modunda |
| `npm run format` | Prettier ile formatla |
| `npm run lint` | Format uyumu kontrolü |

---

## Claude Code ile çalışmak

Projede Claude Code kullanıyorsanız bash/PowerShell komutlarında duraklamamak için CLI'yi şu flag ile başlatın:

```powershell
claude --dangerously-skip-permissions
```

Bu flag tüm tool çağrılarını otomatik onaylar. Kısıtlı onay tercih ederseniz `.claude/settings.local.json` dosyasına güvenli komut kalıpları eklenebilir.

Paket başlangıç prompt'ları `docs/prompts/` altındadır:

- Paket 1: [docs/prompts/paket-1.md](docs/prompts/paket-1.md)

---

## Klasör yapısı

```
pathfinder/
├── CLAUDE.md                    # Claude Code'un otomatik okuduğu proje kuralları
├── README.md                    # Bu dosya
├── LICENSE                      # MIT lisansı
├── package.json                 # Bağımlılıklar ve scriptler
├── svelte.config.js             # SvelteKit + adapter-static ayarı
├── vite.config.ts               # Vite + Tailwind plugin ayarı
├── tsconfig.json                # TypeScript strict mode
├── docs/                        # Proje dokümantasyonu
│   ├── architecture.md          # Mimari kararlar (DAL, faz geçişi vb.)
│   ├── data-schema.md           # menu.json şeması ve TypeScript tipleri
│   ├── decisions.md             # ADR — Architecture Decision Records
│   ├── packages.md              # 4 paketlik yol haritası
│   └── prompts/                 # Claude Code başlangıç prompt'ları
│       └── paket-1.md
├── src/
│   ├── app.html                 # Ana HTML şablonu
│   ├── app.css                  # Tailwind import
│   ├── app.d.ts                 # SvelteKit global tipleri
│   ├── lib/
│   │   ├── data/
│   │   │   └── menu.json        # Yemek verisi (59 yemek, 11 kategori)
│   │   ├── types/
│   │   │   └── menu.ts          # TypeScript tipleri (Menu, Dish, Category...)
│   │   └── stores/
│   │       └── menu.ts          # Data Access Layer — 7 async fonksiyon
│   └── routes/
│       ├── +layout.svelte       # Ortak layout (app.css import)
│       ├── +layout.ts           # prerender + ssr ayarları
│       └── +page.svelte         # Ana sayfa (Paket 1 doğrulama yüzeyi)
├── static/
│   └── favicon.svg
└── .claude/
    └── settings.local.json      # Claude Code izin ayarları
```

---

## Veri erişim kuralı

Component'ler `menu.json`'ı **doğrudan import edemez**. Her veri erişimi `src/lib/stores/menu.ts` içindeki `menuStore` üzerinden yapılır:

```typescript
// YANLIŞ
import menu from '$lib/data/menu.json';

// DOĞRU
import { menuStore } from '$lib/stores/menu';
const dish = await menuStore.getById('palazzo-breakfast');
```

Gerekçe: Faz 2'de JSON → FastAPI geçişinde store imzası değişmez, sadece içi değişir. Detay: [docs/architecture.md](docs/architecture.md) · [docs/decisions.md](docs/decisions.md) ADR-0003.

---

## Paket 1 doğrulama

Tarayıcı konsolunda:

```javascript
await menuStore.getById('palazzo-breakfast')
await menuStore.search('karides')
await menuStore.filterByAllergens(['dairy'])
await menuStore.filterByDietFlags(['vegetarian'])
```

Tip güvenliği: `npm run check` → 0 hata.
Production build: `npm run build` → `build/` klasörü üretilir.

---

## Faz haritası

- **Faz 1 (şu an):** Statik PWA, 59 yemek, offline, tek kullanıcılı
- **Faz 2:** FastAPI backend, kullanıcı hesapları, telefondan admin, role-based izinler
- **Faz 3:** Ekip işletim merkezi — bildirim, duyuru, VIP oda notu, push

Detaylı faz planı: [docs/packages.md](docs/packages.md)

---

## Lisans

MIT. Detay: [LICENSE](LICENSE).

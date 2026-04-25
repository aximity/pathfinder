# Pathfinder TODO

> **Aktif paket:** Paket 3+4 — Yemek Detayı, Fotoğraf, Arama ve Filtreleme (yeni session ile başlanacak)
> **Son güncelleme:** 2026-04-25

## Durum kodları

| Kod | Anlam | Geçiş kuralı |
|---|---|---|
| `[ ]` | Yapılacak | Henüz başlanmadı |
| `[~]` | Devam ediyor | Tek seferde en fazla 1 madde `[~]` olur |
| `[T]` | Telefon testi bekliyor (Ahmet'te) | Claude bu duruma sokabilir |
| `[x]` | Ahmet onayladı, kapandı | **Sadece Ahmet'in açık onayından sonra** Claude bunu çevirir |

> **Önemli:** `[T]` → `[x]` geçişi CLAUDE.md kural 2-5 ("Rapor ≠ gerçek", "Tamamlandı yasağı") gereği yalnızca Ahmet'in görünür onayından sonra yapılır. Claude tek başına `[T]` → `[x]` çeviremez.

---

## Paket 1 — Temel ve Data Access Layer ✅

> Ahmet 2026-04-25'te telefon testini onayladı. GitHub repo `aximity/pathfinder` oluşturuldu.

### Kod işleri

- [x] SvelteKit 2 + Svelte 5 runes + TypeScript strict + Tailwind CSS v4 kurulumu
- [x] `src/lib/data/menu.json` — şema-uyumlu placeholder (11 kategori, 59 yemek; 7'si gerçek veri, 52'si `placeholder-*`)
- [x] `src/lib/types/menu.ts` — tüm şema tipleri, Türkçe ne/neden yorumları
- [x] `src/lib/stores/menu.ts` — 7 async fonksiyon + 5 maddelik şema doğrulama
- [x] `src/routes/+page.svelte` — dinamik sayılar, kategori listesi, console testi rehberi
- [x] README (TR), LICENSE (MIT), `.gitignore`, `.editorconfig`, `.prettierrc`, `.prettierignore`
- [x] İlk commit: `a049ed5 feat: bootstrap Paket 1 - project foundation and data access layer`
- [x] İkinci commit: `63567fe docs: add TODO, PRD, and status tracking documents`

### Telefon testi

- [x] `npm run dev` çalışıyor → telefondan açılıyor
- [x] Anasayfada **"59 yemek · 11 kategori"** sayıları görünüyor (store'dan dinamik)
- [x] 11 kategori sıralı + accent renkleri görünüyor
- [x] Console: `await menuStore.getById('palazzo-breakfast')` → Palazzo Kahvaltı kaydı dönüyor
- [x] Console: `await menuStore.search('karides')` → Sezar Karidesli + Jumbo Karides
- [x] `npm run check` → 0 hata
- [x] `npm run build` → temiz build, uyarı yok

### Paket kapanışı

- [x] `docs/decisions.md`'ye Paket 1 ADR'leri eklendi (ADR-0010 Node 24 LTS, ADR-0011 Tailwind v4, ADR-0012 menu.json placeholder, ADR-0013 tracking dosyaları)
- [x] `CLAUDE.md`'deki "Aktif paket" bölümü → **Paket 2**
- [x] GitHub'da `aximity/pathfinder` repo'su oluşturuldu (Ahmet manuel)
- [x] `docs/prompts/paket-2.md` başlangıç prompt'u hazırlandı
- [T] `git remote add origin` + `git push -u origin main` — komutlar Ahmet'e teslim edildi, push Ahmet tarafından yapılacak

---

## Paket 2 — UI İskelet ve Navigation ✅

> Ahmet 2026-04-25'te telefon testini onayladı: 11 kategori grid, kategori sayfası, dark/light otomatik+manuel+kalıcı, alert'ler, Core Web Vitals hepsi yeşil.

### Kararlar (Ahmet onaylı, 2026-04-25)

- Tailwind tema token'ları Claude tarafından önerildi, Ahmet onayladı: semantic 4 renk (danger/warning/success/info, light=Tailwind 600 / dark=Tailwind 400) + 11 kategori accent (`menu.json` `accent_color`'larından) `@theme` direktifiyle CSS-first
- Dark mode iki durumlu (light/dark, system üçüncü değil — sadece varsayılan başlangıç)
- Mockup 1 metin spesifikasyonu Claude tarafından önerildi, Ahmet onayladı (sticky header, kategori kartı = renk şeridi + ad + sayım, kategori sayfası = foto placeholder + ad + açıklama + fiyat, yemek kartı tıklanınca alert)

### Kod işleri

- [x] `src/app.css` — `@import 'tailwindcss'` + `@custom-variant dark` (class-based) + `@theme` ile 4 semantic + 11 kategori accent token
- [x] `src/app.html` — FOUC önleyici inline script (localStorage `pf:theme` veya `prefers-color-scheme` ile ilk render'da `dark` class'ı set)
- [x] `src/lib/stores/theme.svelte.ts` — Svelte 5 runes ile reactive `themeStore.current` + `toggle()` + `set()`, localStorage senkronu
- [x] `src/lib/utils/category-colors.ts` — kategori ID → `bg-cat-*` utility class map (Tailwind JIT görsün diye literal switch)
- [x] `src/lib/components/ThemeToggle.svelte` — güneş/ay ikonu, 44×44, klavye erişilebilir
- [x] `src/lib/components/SearchBar.svelte` — disabled input placeholder ("Yemek ara… (yakında)")
- [x] `src/lib/components/Header.svelte` — sticky, logo + arama ikonu (alert: "yakında") + ThemeToggle
- [x] `src/lib/components/CategoryCard.svelte` — accent şeridi + ad + yemek sayısı, `<a>` link, ≥88 px
- [x] `src/lib/components/DishCard.svelte` — 96×96 SVG placeholder + ad/açıklama (truncate) + fiyat, button (alert: "yemek detayı yakında")
- [x] `src/routes/+layout.svelte` — Header + main slot + footer wrapper, dark/light Tailwind utility
- [x] `src/routes/+page.svelte` — SearchBar + 11 kategori grid (mobil 2 / tablet 3 sütun) + boş "Son baktıkların" bandı; menuStore.window aç davranışı korundu
- [x] `src/routes/kategori/[id]/+page.svelte` — geri butonu + kategori başlığı + yemek listesi (1 / 2 sütun) + 404 graceful
- [x] `src/routes/kategori/[id]/+page.ts` — static prerender için `entries()` fonksiyonu (11 kategori ID)

### Build/typecheck

- [x] `npm run check` → 0 hata, 0 uyarı
- [x] `npm run build` → 11 kategori sayfası + ana sayfa prerender'lı, CSS 18.67 kB / gzip 4.42 kB

### Telefon testi (Ahmet onayı 2026-04-25)

- [x] `npm run dev` çalışıyor → telefondan `http://<bilgisayar-IP>:5173`
- [x] Ana sayfada 11 kategori grid (mobilde 2 sütun) görünüyor + her kart accent renk şeridi + "X yemek" sayısı
- [x] Bir kategori karta dokun → `/kategori/[id]` açılıyor
- [x] Kategori sayfasında o kategorinin yemekleri kart formatında
- [x] Tarayıcı geri tuşu → ana sayfa, scroll pozisyonu makul
- [x] Telefon sistem teması light/dark değiştir → uygulama otomatik geçiş yapıyor (ilk açılış)
- [x] Header'daki tema toggle → manuel light↔dark, tarayıcı kapatıp açınca seçim hatırlanıyor
- [x] Arama büyüteç ikonuna dokun → "Arama özelliği yakında aktif olacak" alert
- [x] Yemek kartına dokun → "Yemek detayı yakında aktif olacak" alert
- [x] Hiçbir tıklanabilir element 44×44 px'den küçük değil
- [x] Local Core Web Vitals: LCP 0.13s · CLS 0.02 · INP 0ms (hepsi yeşil) — Performance 90+ kriteri karşılandı
- [x] Boş "Son baktıkların" bandı gri kesik kenarlı kutu içinde "Yemek detayına baktıkça burada görünecek"

---

## Paket 3 + 4 — Yemek Detayı, Fotoğraf, Arama ve Filtreleme

(Paket 2 onaylanınca eklenecek.)

---

## Paket 5 — Offline ve Deployment

(Paket 4 onaylanınca eklenecek.)

---

## Ertelendi / İptal

- (boş)

---

## Bağımlılıklar (paket geçiş şartları)

- ~~Paket 2 başlayabilir için: Paket 1 onaylı~~ ✅
- **Paket 3+4 başlayabilir için:** Paket 2 onaylı + mockup 2 son hali + fotoğraf yükleme talimatı netleşmiş
- **Paket 5 başlayabilir için:** Paket 3+4 onaylı + GitHub Pages domain kararı (custom domain mı varsayılan mı)

## Açık dış bağımlılıklar (Ahmet'e ait)

- [x] Kaya Palazzo PDF menüsünden gerçek menüyü `menu.json`'a yapıştır — 2026-04-25 tamamlandı (60 placeholder → 64 gerçek yemek; ratatouille, mixed-sandwich, eggs-with-kavurma, chocolate-souffle PDF'te yok ama menüde, eklendi)
- [x] Tailwind tema token kararları — Claude önerdi, Ahmet onayladı 2026-04-25
- [x] Mockup 1 son hali — Claude metin spesifikasyon önerdi, Ahmet onayladı 2026-04-25
- [~] Eksik yemek fotoğrafları — 37/64 (%58) tamam, 27 yemek hâlâ fotosuz. Liste: [docs/missing-photos.md](docs/missing-photos.md). Ahmet sonraki foto turunda sağlayacak.

# Pathfinder TODO

> **Aktif paket:** Paket 2 — UI İskelet ve Navigation (yeni session ile başlanacak)
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

## Paket 2 — UI İskelet ve Navigation

> `docs/prompts/paket-2.md` ile yeni session açıldığında detaylı checkbox listesi buraya çıkarılacak.

Üst seviye kapsam (`docs/packages.md` Paket 2'den):

- [ ] Tailwind tema konfigürasyonu — `tailwind.config.js` + custom token'lar (renk, spacing, radius)
- [ ] Dark mode — `media` stratejisi (sistem) + manuel toggle (localStorage `pf:theme`)
- [ ] `src/routes/+layout.svelte` — header (logo, arama ikonu placeholder, tema toggle), footer
- [ ] Ana sayfa — arama çubuğu placeholder + kategori grid (11 kart, mobil 2 sütun, tablet 3 sütun) + "Son baktıkların" bandı (boş)
- [ ] `src/routes/kategori/[id]/+page.svelte` — o kategorinin yemek kartları (foto placeholder, ad, fiyat, kritik chip), back navigation
- [ ] Component'ler: `CategoryCard`, `DishCard`, `SearchBar` (placeholder), `ThemeToggle`, `Header`
- [ ] Telefon testi: kategori grid → kategori sayfası → geri navigation, dark/light otomatik + manuel toggle
- [ ] Lighthouse Mobile Performance 90+

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

- [ ] Kaya Palazzo PDF menüsünden gerçek 52 yemeği `menu.json`'a yapıştır (placeholder'ları değiştir) — Paket 2 öncesi şart değil, paralel ilerleyebilir
- [ ] Tailwind tema token kararları (semantic renkler: danger/success/warning + 11 kategori accent) — Paket 2 başlangıcında netleşmesi gerekir
- [ ] Mockup 1 son hali (ana sayfa + kategori sayfası) — Paket 2'nin görsel referansı

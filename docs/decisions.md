# Architecture Decision Records (ADR)

Bu dosya kritik mimari kararların tarihsel kaydını tutar. Her karar için: ne, ne zaman, neden, ve terk edilen alternatif.

Format: [ADR-NNNN] Başlık — Tarih (YYYY-MM-DD) — Durum

Durum: `kabul-edildi`, `değiştirildi`, `iptal`

---

## [ADR-0001] Framework seçimi — SvelteKit + TypeScript

**Tarih:** 2026-04-24
**Durum:** kabul-edildi

### Karar

Pathfinder'ın frontend'i SvelteKit 2 (Svelte 5 runes) + TypeScript + Tailwind CSS ile yazılacak. Build adapter: `@sveltejs/adapter-static`.

### Gerekçe

1. **Bundle küçük** — first paint hızlı, mutfakta Wi-Fi gecikmesi tolere edilebilir
2. **File-based routing** — `/kategori/[id]` gibi URL'ler otomatik
3. **TypeScript type safety** — alerjen flag yanlış yazılırsa compile-time hata
4. **`adapter-static` uyumu** — GitHub Pages deployment sorunsuz
5. **Svelte 5 runes** — state management sade, Redux/Zustand gerekmiyor
6. **Claude Code uyumluluğu** — yaygın framework, eğitim verisi geniş

### Değerlendirilen alternatifler

- **Alpine.js + Tailwind CDN:** çok basit ama 59 yemek + arama + filtre büyüdükçe dağılır
- **Flutter Web:** 2 MB bundle, Safari'de scroll sorunları, mobil web için uygun değil
- **Next.js / React:** SvelteKit kadar hafif değil, boilerplate fazla

---

## [ADR-0002] Dil politikası — Türkçe arayüz, İngilizce kod

**Tarih:** 2026-04-24
**Durum:** kabul-edildi

### Karar

- Arayüz metinleri (başlık, buton, hata mesajı, placeholder): **Türkçe**
- Kod (değişken, fonksiyon, class, yorum): **İngilizce**
- Git commit: **İngilizce** (Conventional Commits)
- Dokümantasyon (README, docs/): **Türkçe**
- menu.json içeriği: **Türkçe (name, description, tags)**
- menu.json anahtarları: **İngilizce (id, category_id, allergens)**

### Gerekçe

Bu Ahmet'in GDYON, Nağme, MeyDey projelerinde de uygulanan desen. Kodun uluslararası okunabilirliği + kullanıcı tarafının yerel doğallığı.

### Terk edilen

- Çift dilli (TR + EN) menu.json şeması → Ahmet "uygulama tamamıyla Türkçe" dedi
- Türkçe slug id'ler → kod kısmı İngilizce kaldığı için slug'lar da İngilizce

---

## [ADR-0003] Data Access Layer zorunluluğu

**Tarih:** 2026-04-24
**Durum:** kabul-edildi

### Karar

Component'ler veriye sadece `$lib/stores/menu.ts` üzerinden erişir. `menu.json`'ı doğrudan import etmek yasaktır. Store fonksiyonları async (Faz 2 hazırlığı).

### Gerekçe

Faz 2'de JSON → API geçişinde 30+ component'i yeniden yazmak zorunda kalmamak. Store imzası değişmez, sadece içi değişir.

### Terk edilen

- Her component'te `import menu from '$lib/data/menu.json'` → teknik borç yaratıyor
- `localStorage` veya Redux gibi ağır state management → overkill

---

## [ADR-0004] JSON şeması = API response formatı

**Tarih:** 2026-04-24
**Durum:** kabul-edildi

### Karar

Faz 1'de `menu.json`'ın yapısı, Faz 2'de backend API'nin döneceği response formatının birebir aynısıdır. Şema değişmez.

### Gerekçe

Faz 2 geçişinde frontend kodu değişmez. Backend doğrudan aynı formatı üretir. Veritabanı şeması bu JSON'dan otomatik çıkarılabilir.

---

## [ADR-0005] Repo yapısı — bağımsız proje

**Tarih:** 2026-04-24
**Durum:** kabul-edildi

### Karar

Pathfinder GDYON ekosisteminden bağımsız, kendi repo'sunda geliştirilir. `aximity/pathfinder`.

### Gerekçe

1. GDYON "insan gelişim aracı", Pathfinder "işletme aracı" — farklı ürün kategorileri
2. İleride SaaS olarak satılma potansiyeli varsa marka ayrı tutmak daha kolay
3. Co-founder veya yatırımcı dahil olursa pathfinder kendi ayakları üzerinde durur

---

## [ADR-0006] 4 session'lık paket stratejisi

**Tarih:** 2026-04-24
**Durum:** kabul-edildi

### Karar

MVP 4 Claude Code session'una bölünür:
- Session 1: Paket 1 (Temel + Data Layer)
- Session 2: Paket 2 (UI İskelet + Navigation)
- Session 3: Paket 3 + 4 birleştirilmiş (Yemek detayı + Fotoğraf + Arama + Filtreleme)
- Session 4: Paket 5 (Offline + Deployment)

### Gerekçe

1. Her session temiz context — kural ihlali riski düşer
2. Paket sonlarında gerçek checkpoint — "onay alınmadan devam yok"
3. Bir session yanlış giderse sadece o session atılır, diğerleri zarar görmez
4. `CLAUDE.md` + `docs/` kalıcı hafıza görevi görür
5. Paket 3 + 4 birleştirildi çünkü veri tüketim katmanında iç içe — aynı store fonksiyonlarını kullanırlar

### Terk edilen

- Tek session'da tüm paketler → context şişiyor, uzun session'da kural unutuluyor
- 5 ayrı session → 3+4 birleştirmek pratik avantaj sağlıyor

---

## [ADR-0007] Stil yaklaşımı — Tailwind CSS

**Tarih:** 2026-04-24
**Durum:** kabul-edildi

### Karar

Tailwind CSS utility-first yaklaşımla kullanılacak. Custom design token'lar `tailwind.config.js`'de tanımlanacak. `@apply` kullanılmayacak (Svelte scoped CSS ile yeterli).

### Gerekçe

1. Hızlı yazım, küçük bundle (purge sonrası)
2. Dark mode + responsive + focus/hover tek satırda
3. SvelteKit entegrasyonu hazır
4. Claude Code Tailwind'de güçlü

### Terk edilen

- CSS variables + scoped CSS → daha yavaş iterasyon
- CSS-in-JS → Svelte'de gereksiz
- MUI / shadcn-ui → framework bağımlılığı

---

## [ADR-0008] Deployment — GitHub Pages + GitHub Actions

**Tarih:** 2026-04-24
**Durum:** kabul-edildi

### Karar

Faz 1 deployment GitHub Pages üzerinden, GitHub Actions ile otomatik. Custom domain opsiyonel.

### Gerekçe

1. Ücretsiz
2. Ahmet'in `aximity` GitHub hesabı hazır
3. `main` push → 2-3 dakikada canlı
4. Statik dosya servisi yeterli (Faz 1'de backend yok)

### Terk edilen

- **Cloudflare Pages** → GitHub Pages da yeterli, ek hesap gereksiz
- **Hetzner CX22** → backend yok, fazla gelir. Faz 2'de kullanılacak

---

## [ADR-0009] Fotoğraf hosting — repo içi

**Tarih:** 2026-04-24
**Durum:** kabul-edildi

### Karar

Faz 1'de fotoğraflar `static/photos/` klasöründe repo içinde tutulur. İsimlendirme: `{dish_id}-01.webp`. Optimize beklentisi: her foto < 500 KB, WebP formatı.

### Gerekçe

- 59 × 500 KB = ~30 MB repo boyutu → GitHub limitine uygun
- GitHub Pages otomatik serve ediyor
- Faz 2'ye geçişte Cloudflare R2 veya Hetzner Object Storage'a taşınır

### Terk edilen

- CDN (Cloudflare, Bunny) → Faz 1 için overkill
- Base64 JSON'a gömme → bundle şişer

---

## Güncelleme talimatı

Yeni bir ADR eklemek için:

1. En üste en yeni tarih olacak şekilde ters kronolojik sıralama
2. ADR numarası sıradan bir sonraki (0010, 0011, ...)
3. Başlık, durum, gerekçe, terk edilen alternatif zorunlu
4. Eski bir kararı değiştirmek isterseniz önceki ADR'nin durumunu `değiştirildi` yapın, yenisini ekleyin

Bu dosya her kritik kararda Claude Code tarafından okunur ve güncellenir.

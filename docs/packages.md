# Paket Tanımları

Pathfinder 4 session'a bölünerek geliştirilir. Her session bağımsız bir Claude Code session'udur. Sıralı ilerler — bir önceki paket onaylanmadan sonrakine geçilmez.

---

## Paket 1 — Temel ve Data Access Layer

### Scope (yapılacaklar)

**Repo kurulumu:**
- SvelteKit 2 + TypeScript + Tailwind CSS kurulumu
- `adapter-static` konfigürasyonu (GitHub Pages uyumu)
- `.gitignore`, `.editorconfig`, `.prettierrc`
- TypeScript `strict: true`, `noImplicitAny`, `strictNullChecks`
- `tsconfig.json` path alias: `$lib` ve `$components`

**Dokümantasyon:**
- `README.md` (TR) — projeyi çalıştırma, build alma, deploy etme adımları
- `LICENSE` dosyası (seçim: MIT veya proprietary — Ahmet'e sor)

**Veri katmanı:**
- `src/lib/data/menu.json` — mevcut menu.json kopyalanır
- `src/lib/types/menu.ts` — TypeScript tipleri:
  - `Menu`, `Category`, `Dish`, `Components`, `Variant`, `VariantOption`, `Extra`
  - `Allergen` union type: `"gluten" | "dairy" | "eggs" | "nuts" | "shellfish" | "fish" | "soy"`
  - `DietFlag` union type: 8 flag'in tamamı
- `src/lib/stores/menu.ts` — data access layer:
  - `getById(id: string): Promise<Dish | null>`
  - `getByCategory(categoryId: string): Promise<Dish[]>`
  - `getAllCategories(): Promise<Category[]>`
  - `getAllDishes(): Promise<Dish[]>`
  - `search(query: string): Promise<Dish[]>`
  - `filterByAllergens(excluded: Allergen[]): Promise<Dish[]>`
  - `filterByDietFlags(required: DietFlag[]): Promise<Dish[]>`

**Test/doğrulama:**
- Placeholder `src/routes/+page.svelte` — "Pathfinder · 59 yemek · 11 kategori" başlığı ve store testlerinin sonuçları
- Browser console'dan tüm store fonksiyonlarının çağrılabilir olması

### Çıktı (deliverable)

- Çalışan `npm run dev` → `localhost:5173` → ana sayfada sayılar görünüyor
- Çalışan `npm run build` → `build/` klasörü üretiliyor, hata yok
- Çalışan `npm run preview` → production build preview
- Tüm type'lar VSCode intellisense'de doğru öneri veriyor

### Kabul kriterleri (yazılı olarak kontrol edilir)

1. Repo GitHub'da (`aximity/pathfinder`) — commit history temiz
2. `menu.json` doğrudan import **edilmemiş** hiçbir route'tan — sadece store üzerinden erişim
3. Store fonksiyonlarının hepsi `async` (Faz 2 hazırlığı)
4. Ana sayfada "59 yemek · 11 kategori" sayıları store'dan dinamik olarak geliyor
5. TypeScript strict mode hata vermiyor (`npm run check`)
6. Bir yemek ID'si (örn. `palazzo-breakfast`) browser console'da `menuStore.getById('palazzo-breakfast')` çağırınca doğru kayıt dönüyor
7. README'de Windows için çalıştırma talimatı (`npm install`, `npm run dev`)

### Scope dışı (Paket 1'de yapılmayacaklar)

- Kategori sayfası, yemek detay sayfası
- Arama UI
- Fotoğraf entegrasyonu
- Dark mode (Paket 2'de)
- Service worker (Paket 4'te)
- Deploy (Paket 4'te)

### Checkpoint

Ahmet onayı için:
- `npm run dev` çalıştırılır, `localhost:5173` telefonda veya tarayıcıda açılır
- "59 yemek · 11 kategori" görünüyor mu?
- Console'da store fonksiyonu test edilir
- Tip güvenliği kontrol edilir (örneğin `Dish` tipinde olmayan bir alana erişince hata veriyor mu?)

---

## Paket 2 — UI İskelet ve Navigation

### Scope

**Tailwind konfigürasyonu:**
- `tailwind.config.js` — tema (renk paleti, spacing, border radius)
- `src/app.css` — base layer, CSS variables
- Dark mode: `media` stratejisi (sistem ayarı) + manuel toggle (localStorage)

**Ortak layout:**
- `src/routes/+layout.svelte` — header, tema toggle, footer
- Header: logo/ad, arama ikonu (Paket 3+4'te aktif olur), menü
- Mobile-first responsive

**Ana sayfa:**
- `src/routes/+page.svelte`
- Arama çubuğu (placeholder, henüz işlevsiz)
- Kategori grid (11 kart, 2 sütun mobil, 3 sütun tablet)
- "Son baktıkların" bandı (localStorage'dan, başlangıçta boş)

**Kategori sayfası:**
- `src/routes/kategori/[id]/+page.svelte`
- O kategorinin yemek kartları (fotoğraf placeholder, ad, fiyat, kritik chip)
- Back navigation

**Component'ler:**
- `src/lib/components/CategoryCard.svelte`
- `src/lib/components/DishCard.svelte` — yeniden kullanılabilir (ana, kategori, arama'da)
- `src/lib/components/SearchBar.svelte` — henüz işlevsiz, UI placeholder
- `src/lib/components/ThemeToggle.svelte`
- `src/lib/components/Header.svelte`

### Kabul kriterleri

1. Kategori kartına tıklayınca `/kategori/[id]` açılıyor
2. Kategori sayfasında o kategorinin tüm yemekleri listeleniyor
3. Browser geri tuşu doğru çalışıyor
4. Sistem ayarına göre dark/light mode otomatik, manuel toggle da çalışıyor
5. Dark mode'da hiçbir beyaz yama veya okunamayan text yok
6. Tüm tıklanabilir elementler minimum 44×44 px
7. Mockup 1 ile görsel benzerlik en az %85
8. Lighthouse Mobile Performance skoru 90+
9. `npm run build` hatasız

### Scope dışı

- Yemek detay sayfası
- Gerçek fotoğraflar
- Arama fonksiyonalitesi
- Alerjen filtresi

### Checkpoint

- Telefonda açılır, kategoriler tıklanabilir, geçişler akıcı
- Dark mode telefon sistem ayarıyla senkron
- Ana sayfadaki arama kutusu disabled veya "yakında" gibi bir mesaj verir

---

## Paket 3 + 4 — Yemek Detayı, Fotoğraf, Arama ve Filtreleme (birleştirilmiş)

Bu paket veri tüketim katmanında yoğunlaştığı için birleştirildi. Detay sayfası ile arama aynı `menuStore.search()` altyapısını kullanır.

### Scope — Detay tarafı

**Yemek detay sayfası:**
- `src/routes/yemek/[id]/+page.svelte`
- Mockup 2'nin tam implementasyonu:
  - Üstte foto (4:3 oran, lazy loading)
  - Başlık, kategori, fiyat
  - Açıklama
  - Alerjen chip'leri (kırmızı, ikon + metin)
  - Diet flag chip'leri (yeşil)
  - İçerik bölümü (ana, yan, sos, garnitür)
  - Müşteri seçimleri bölümü (her varyant grubu ayrı satır)
  - Şef notu (amber kutu, koşullu render)
  - Pişirme yöntemi, kategori kodu (meta satırlar)

**Alt component'ler:**
- `src/lib/components/AllergenChip.svelte`
- `src/lib/components/DietFlagChip.svelte`
- `src/lib/components/VariantGroup.svelte`
- `src/lib/components/ComponentSection.svelte` — ana/yan/sos/garnitür
- `src/lib/components/ChefNote.svelte` — amber kutu
- `src/lib/components/DishPhoto.svelte` — fallback placeholder'lı

**Fotoğraf entegrasyonu:**
- `static/photos/` klasörü
- Slug-based isimlendirme: `{dish_id}-01.webp`
- Ahmet fotoğrafları manuel yükleyecek (talimat README'de)
- Optimize beklentisi: her foto < 500 KB, webp formatı tercihen
- `loading="lazy"` her foto tag'inde
- Fotoğraf yoksa SVG placeholder

**Son baktıkların:**
- `src/lib/stores/recent.ts` — localStorage'da son 10 yemek ID'si
- Ana sayfa "Son baktıkların" bandı artık dolu çalışıyor

### Scope — Arama tarafı

**Arama sayfası:**
- `src/routes/ara/+page.svelte`
- Real-time arama (her tuşta filter)
- Hedefler: yemek adı, açıklama, tags, `components.sides`, `components.sauces`, `components.garnishes`
- Türkçe karakter duyarsız: `toLocaleLowerCase('tr')`

**Alerjen filtresi:**
- "Bu alerjeni çıkar" şeklinde 7 checkbox (gluten, süt, yumurta, fındık, kabuklu, balık, soya)
- Checkboxlar Türkçe etiketli

**Diet flag filtresi:**
- "Bu özellik olsun" şeklinde checkbox'lar (vegetaryen, vegan, glutensiz, acılı, sağlıklı, yüksek protein, çocuk dostu)

**URL sync:**
- Filtreler URL'de tutulur: `/ara?q=köfte&excl=gluten,dairy&req=high_protein`
- Paylaşılabilir link

**Arama geçmişi:**
- Son 5 arama localStorage'da
- Boş arama sayfasında öneri olarak görünür

### Kabul kriterleri

**Detay tarafı:**
1. 59 yemeğin her biri hatasız açılıyor — rastgele örnekleme ile test
2. Palazzo Kahvaltı detay sayfası mockup 2 ile %90+ benzer
3. `chef_notes` boş olan yemeklerde amber kutu gizli
4. Fotoğraf yoksa placeholder görünüyor, fotoğraf varsa lazy load çalışıyor
5. Türkçe karakterler (ş, ç, ğ, ı, ö, ü) her yerde doğru render
6. Son baktıkların ana sayfada doğru sırayla görünüyor (en son görüntülenen en başta)

**Arama tarafı:**
7. "karides" → Sezar Karidesli + Jumbo Karides sonuçları görünüyor
8. "Şiş" = "sis" = "SIS" — aynı sonuç (case insensitive)
9. Süt alerjeni çıkarılınca 59 yemekten süt içerenler listeden kaybolur
10. Filtreler kombinlenebiliyor (alerjen + diet flag + metin)
11. Arama sonucu 100ms altında görünüyor
12. URL paylaş testi: `/ara?q=pizza` URL'i açıldığında arama kutusunda "pizza" görünüyor

### Scope dışı

- Service worker / offline
- Deployment
- Admin arayüz (Faz 2)

### Checkpoint

- Telefon testi: 3 farklı kategoriden rastgele yemek aç, detayları doğrula
- Arama testi: yaygın arama kelimeleri (köfte, tavuk, salata, vegan, acılı)
- Filtre testi: alerjen + diet kombinasyonu
- Son baktıkların davranışı test edilir

---

## Paket 5 — Offline ve Deployment

### Scope

**Service worker:**
- `src/service-worker.ts`
- App shell cache: HTML, CSS, JS
- JSON cache: `menu.json` için stale-while-revalidate, 1 saat TTL
- Fotoğraflar: görülen fotoğraflar cache'e eklenir (cache-first)
- Cache invalidation: version bump'ta eski cache silinir

**PWA manifest:**
- `static/manifest.webmanifest`
- Ad: "Pathfinder"
- Short name: "Pathfinder"
- Theme color, background color (dark/light uyumlu)
- İkon: 192×192, 512×512 (Ahmet sağlar veya placeholder)
- Display: standalone
- Orientation: portrait-primary
- Start URL: `/`

**GitHub Actions:**
- `.github/workflows/deploy.yml`
- Trigger: `main` branch'e push
- Steps: checkout, node setup, install, build, deploy to `gh-pages`
- Base path config (GitHub Pages sub-path için)

**Dokümantasyon güncellemesi:**
- README'ye deployment talimatı
- "Ana ekrana ekle" talimatı (iOS Safari + Android Chrome)
- Custom domain eklemek için DNS talimatı (opsiyonel)

### Kabul kriterleri

1. Chrome DevTools → Network → Offline → uygulama açılıyor ve gezinilebilir
2. Daha önce bakılan yemekler offline'da fotolu gösteriliyor
3. Android Chrome "Ana ekrana ekle" prompt'u çıkıyor, install ediliyor
4. iOS Safari "Ana ekrana ekle" ile kaydediliyor, standalone modda açılıyor
5. Lighthouse PWA kategorisi 100
6. `main` branch'e push → 2-3 dakikada canlı URL'de değişiklik
7. Canlı URL'de `menu.json` güncellenmiş, kategoriler görünüyor

### Scope dışı

- Push notification (Faz 3)
- Admin arayüz (Faz 2)
- Kullanıcı hesapları (Faz 2)

### Checkpoint

- Telefonda "Ana ekrana ekle" test edilir
- Telefonu uçak moduna al, uygulamayı aç — çalışıyor mu?
- Live URL'de menu.json değişikliği deploy ediliyor mu?
- PWA icon ana ekranda doğru görünüyor mu?

---

## Paket arası kural: tamamlanmadan sonrakine geçme

Her paketin kabul kriterleri tamamen sağlanmadan sonraki paket başlamaz. "Neredeyse tamam" veya "küçük bir şey kaldı" yeterli değil. Tam yeşil ışık olmadan sonrakine geçilirse teknik borç biriker.

Ahmet onayı = paket bitti. Claude Code raporu = paket bitti değil.

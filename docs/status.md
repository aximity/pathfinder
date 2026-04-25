# Durum

> Bu dosya her session sonunda **Ahmet onayı sonrası** güncellenir. Yeni bir Claude Code session'u (veya başka LLM) projeye girdiğinde 5 saniyede "şu an nerdeyiz" okuyabilsin diye var.

---

**Son güncelleme:** 2026-04-25
**Aktif paket:** Paket 3+4 — Yemek Detayı, Fotoğraf, Arama ve Filtreleme (yeni session ile başlanacak)
**Önceki paket:** Paket 2 — **kapandı**, Ahmet 2026-04-25'te telefon testini onayladı (Core Web Vitals: LCP 0.13s · CLS 0.02 · INP 0ms, hepsi yeşil)
**Son commit:** Paket 2 kapanış commit'i (bu session'da atılacak — Ahmet onayı bekleniyor)
**Branch:** `main`
**Remote:** `https://github.com/aximity/pathfinder.git`

**Bekleyen Ahmet işleri:**
- Paket 2 kapanış commit'inin atılması (Claude öneri sunacak)
- (Bu session'da paralel) `reference/1203.pdf` okunup `menu.json` placeholder'ları gerçek 52 yemekle değiştirilecek
- (Bu session'da paralel) `static/photos/` altındaki 43 WhatsApp jpeg'in yemek slug'larıyla eşleştirilmesi — Ahmet hangi fotoğrafın hangi yemeğe ait olduğunu söyleyecek (kural 7: tahminle iş yok)

**Bir sonraki adım:**
1. Bu session içinde: PDF içeriği `menu.json`'a yapıştırılır (kategori bazlı batch)
2. Bu session içinde: Fotoğraflar slug'la eşleştirilip `{dish_id}-01.webp` formatında yeniden adlandırılır, `menu.json`'da `photos` array'ine yol yazılır
3. Yeni session: `docs/prompts/paket-3-4.md` ile Paket 3+4 başlatılır (yemek detay sayfası, gerçek arama, alerjen + diet filtresi, son baktıkların aktif)

**Paket 2'de alınan kritik kararlar (`docs/decisions.md` ADR-0014 → ADR-0015):**
- Tailwind v4 `@theme` direktifiyle 4 semantic + 11 kategori accent token (CSS-first, JS config yok)
- `@custom-variant dark` ile class-based dark mode (manuel override için)
- Dark mode iki durumlu (`light`/`dark`); `system` üçüncü seçenek değil — sadece varsayılan başlangıç
- FOUC önlemek için `app.html`'de bloklayıcı inline script (sayfa boyanmadan önce `dark` class set)
- Kategori accent class'ları için `category-colors.ts` literal switch-case (Tailwind JIT için)
- Theme store `theme.svelte.ts` ekstension'ında — Svelte 5 runes runtime gereği `.svelte.ts` kullanılmalı

**Paket 2 ürünleri (yazılan dosyalar):**
- `src/lib/stores/theme.svelte.ts`, `src/lib/utils/category-colors.ts`
- `src/lib/components/`: Header, ThemeToggle, SearchBar (placeholder), CategoryCard, DishCard
- `src/routes/+layout.svelte` (güncellendi), `src/routes/+page.svelte` (yenilendi)
- `src/routes/kategori/[id]/+page.svelte` + `+page.ts` (entries() ile prerender)
- `src/app.css` (güncellendi), `src/app.html` (güncellendi — FOUC inline script)

**Açık sorular:** Yok.

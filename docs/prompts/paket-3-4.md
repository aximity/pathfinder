# Paket 3+4 — Başlangıç Prompt'u

Bu dosyadaki prompt'u yeni Claude Code session'ında **kopyala-yapıştır** ile gönder.

---

## Prompt (Claude Code için)

```
Selam. Pathfinder projesinin Paket 3+4 üzerinde çalışacağız. Bu paket
yemek detay sayfası, fotoğraf entegrasyonu, real-time arama, alerjen +
diet flag filtreleri ve "Son baktıkların" özelliğini birlikte kapsar.

Önce şu dosyaları sırayla oku:

1. CLAUDE.md (proje kuralları ve aktif paket — Paket 3+4 olmalı)
2. docs/status.md (anlık durum, son commit, paralel iş özeti)
3. TODO.md (Paket 3+4 üst seviye scope, açık dış bağımlılıklar)
4. docs/packages.md (sadece Paket 3+4 bölümü — Paket 2 ve 5'e bakma)
5. docs/architecture.md (özellikle component sorumluluk + state yönetimi
   bölümleri — yeni component'ler aptal kalmalı, store'lar üzerinden veri)
6. docs/decisions.md (özellikle ADR-0003 DAL, ADR-0004 JSON şeması =
   API formatı, ADR-0011 Tailwind v4, ADR-0014/0015 tema ve dark mode)
7. docs/data-schema.md (Dish/Variant/Extra/Components yapısı —
   detay sayfasında bu alanların hepsi kullanılacak)
8. docs/missing-photos.md (27 yemeğin fotosu yok; placeholder davranışı
   şart, ADR-0009 fallback SVG)
9. PRD.md (başarı kriterleri: < 100ms arama, alerjen en görünür konumda,
   3 dokunuş kuralı)

Mevcut Paket 2 component'lerini ve store'larını da incele:
- src/lib/components/ (Header, ThemeToggle, SearchBar, CategoryCard, DishCard)
- src/lib/stores/menu.ts (7 fonksiyon imzası — KORUNUR, değişmez)
- src/lib/stores/theme.svelte.ts (tema toggle akışı)
- src/lib/data/menu.json (64 yemek, 11 kategori, 37 fotolu)

Dosyaları okuduktan sonra bana Türkçe olarak şunları söyle:

- Paket 3+4'te yapılacak ana işler (madde madde, detay + arama
  birlikte)
- Kabul kriterlerinin kısa özeti (12 madde — detay 6, arama 6)
- Scope dışı olan ve Paket 5'e bırakılan şeyler (service worker,
  offline, deploy)
- Senin gördüğün 3-4 potansiyel risk veya belirsizlik
- Açık dış bağımlılıklar (TODO.md'deki "Açık dış bağımlılıklar"
  bölümünden):
  * Mockup 2 son hali (yemek detay sayfası — TR metin tarifle iste)
  * Eksik 27 yemek fotosu — Paket 3+4 boyunca placeholder ile
    çalışılır, sonra Ahmet ekler
  * Detay sayfası tıklanabilir mi? (Şu an DishCard alert veriyor;
    Paket 3+4'te <a href="/yemek/{id}"> olarak değişecek — Paket 2
    yapısı bozulmaz)

Benim onayımı bekle. "Başla" dediğimde kodlamaya geç.

Hatırlatmalar (kurallar):

- Kod tahminle yazılmaz. Emin olmadığın bir şey varsa bana sor.
- Görselden kod üretme — design token'larını metin olarak iste (kural 7).
  Mockup 2 için sade text tarif önerirsen ben onaylarım, yapılmaması
  gereken şey varsa söylerim.
- Windows üzerindeyim. PowerShell komutları öner, bash değil.
- TypeScript strict mode zorunlu. UTF-8 BOM'suz tüm dosyalar.
- "Tamamlandı" deme. Telefon testimle onaylanır.
- Component'ler aptal — business logic yok. Veri sadece $lib/stores
  üzerinden (ADR-0003).
- menu.json'ı doğrudan import etme. Yasak.
- Dark mode için hardcoded hex renk yasak — Tailwind token'ları kullan.
- Tüm tıklanabilir elementler ≥ 44×44 px.
- Paket 1'deki menuStore imzası KORUNUR. Yeni fonksiyon eklenebilir
  (örn. getRelated), var olan değiştirilemez.
- Paket 2'nin component'leri (CategoryCard, DishCard, Header) korunur.
  DishCard'da alert davranışı kaldırılır, <a href="/yemek/{id}"> olur.
- Türkçe karakter güvenli arama: toLocaleLowerCase('tr') zorunlu —
  menuStore.search zaten bu kuralı uyguluyor.
- URL parametreleri (q, excl, req) decode/encode dikkatli yapılır.
- 27 yemek fotosuz — placeholder SVG fallback ZORUNLU, kırık ikon
  görünmemeli.
- Commit mesajları İngilizce (conventional commits).
- TODO.md durum kodlarını sen güncelle: [ ] → [~] → [T]. [T] → [x]
  geçişini yapma; benim onayımı bekle.

Mockup 2 spesifikasyonu Ahmet onaylı (2026-04-25):

1. **Foto:** üstte full-width, 4:3 oran. Foto yoksa SVG placeholder
   (ADR-0009 fallback). lazy loading her img'de.
2. **Chip sırası:** Alerjen chip'leri (kırmızı `bg-danger`) **diet flag
   chip'lerinden önce gelir** — Ahmet "en görünür konumda" istedi
   (PRD başarı kriteri 2). Diet flag chip'leri (yeşil `bg-success`)
   alttaki satırda.
3. **İçerik bölümü:** Tek liste — ana/yan/sos/garnitür **ayrı kart
   değil**, tek bir component içinde alt başlıklarla (ana → yan
   → sos → garnitür sırasıyla). Boş array'ler render edilmez.
4. **Variant rendering otomatik:** `multi_select === true` →
   checkbox, `multi_select === false` → radio. Etiketler `group`
   alanından (örn. "Yumurta pişirme"). VariantOption obje formundaysa
   (`{ label, price_override }`) fiyat farkı satır sonunda mini badge
   olarak gösterilir.
5. **Şef notu:** `chef_notes` boş değilse amber kutu (`bg-warning/10`,
   `border-warning`) — içerik bölümünün altında, geri kalan metnin
   üstünde durur. Boşsa kutu render edilmez (koşullu).
6. **Geri butonu:** Paket 2'deki kategori sayfası deseninde — sayfa
   üstünde, `<-Geri` ikonu + metin, `window.history.back()` (geçmiş
   yoksa `/`'e fallback). Sticky DEĞİL — sayfayla birlikte kayar
   (kategori sayfasında nasılsa öyle).
7. **Son baktıkların güncellemesi:** Kullanıcı `/yemek/[id]` her
   ziyaret ettiğinde recentStore.markVisited(id) çağrılır. Store son
   10 ID tutar (LRU). Aynı ID tekrar açılırsa eski kayıt silinir,
   yenisi en başa eklenir (duplicate olmaz). Ana sayfa "Son
   baktıkların" bandı bu ID listesini menuStore.getById ile
   detaylandırıp yatay scroll listesi olarak gösterir; en son ziyaret
   edilen en solda.

Bu spec yeterli — ek mockup veya görsele gerek yok. Hâlâ belirsiz
gördüğün noktalar varsa (örn. fiyat görünümü, breadcrumb, related
dishes vs.) bana sor, tahminle uydurma.
```

---

## Prompt öncesi hazırlık (Ahmet için)

Bu prompt'u Claude Code'a göndermeden önce şunlardan en az **biri** hazır olmalı:

### 1. Mockup 2 metin spesifikasyonu — ✅ Ahmet onayladı (2026-04-25)

Spec prompt'un içine embed edildi (yukarıda 7 madde). Yeni session bunu okuduğunda mockup hakkında ek soru sormaz, doğrudan kodlamaya geçer.

Onaylanan kararlar özet:
- Foto üstte, full-width 4:3
- Alerjen chip'leri diet flag'lerden önce (en görünür)
- İçerik tek liste (ana/yan/sos/garnitür alt başlıklarla)
- Variant: multi_select boolean'ına göre checkbox/radio otomatik
- Şef notu amber kutu, koşullu render
- Geri butonu Paket 2 deseninde, sticky değil
- Son baktıkların: LRU son 10, en son ziyaret en solda

### 2. Eksik 27 yemek fotoğrafı (paralel ilerleyebilir)

`docs/missing-photos.md` listesinden öncelikli yemekler için foto sağla:

- **Çocuk Menüsü:** 6/6 komple eksik — en yüksek öncelik
- **Pizza:** 3/4 eksik (sadece Margarita var)
- **Tatlılar:** 4 eksik (Sorbe, Kaymak, Dondurma, Sütlaç)
- **Diğer:** Quesadilla, Köfte Dürüm, Yoğurtlu Köfte, Tavuk Şiş, Penne Arabiata, Mantı

Foto'lar gelirse, batch protokolü aynen Paket 2 sonrası gibi: Claude görsel olarak okur, Ahmet onaylar, slug ile rename, menu.json güncellenir.

### 3. URL paylaşma test örnekleri

`/ara?q=karides` gibi URL'lerin paylaşılabilir olması Paket 3+4 kabul kriteri. WhatsApp'tan açtığında URL parametreleri doğru parse mi olacak? Test: bilgisayarda URL oluştur, telefondan aç.

---

## Paket 3+4 bittiğinde checkpoint

Claude Code "bitti" dediğinde (sen onaylayınca kesinleşir):

### Telefon testi (12 madde)

**Detay tarafı:**

1. Ana sayfada herhangi bir kategoriye tıkla → kategori sayfası
2. Bir yemek kartına tıkla → `/yemek/[id]` açılıyor (artık alert değil)
3. Detay sayfasında foto görünüyor (foto varsa) veya SVG placeholder (yoksa)
4. Alerjen chip'leri kırmızı, en görünür konumda
5. Diet flag chip'leri yeşil
6. Variant grupları doğru render (radio vs checkbox)
7. Şef notu olan yemekte (örn. Ratatouille) amber kutu görünüyor
8. Şef notu boş olan yemekte (örn. Palazzo Kahvaltı) kutu görünmüyor
9. Geri butonu çalışıyor (kategori sayfasına dönüyor)
10. Birkaç farklı yemek aç, ana sayfada "Son baktıkların" bandı doluyor

**Arama tarafı:**

11. Arama kutusuna "karides" yaz → Sezar Karidesli + Jumbo Karides
12. "Şiş" = "sis" = "SIS" testi — aynı sonuç
13. Süt alerjenini çıkar → süt içeren yemekler kayboluyor
14. URL'de `/ara?q=pizza` aç → arama kutusunda "pizza" görünüyor
15. Vegan + glutensiz birlikte filtrele → sadece her ikisini de karşılayan yemekler

**Performans:**

16. Lighthouse Mobile: Performance 90+, Accessibility 95+
17. Arama yanıtı 100ms altında

### Kontrol listesi

`docs/packages.md`'deki Paket 3+4 kabul kriterlerini madde madde doğrula. Hepsi yeşilse:

1. TODO.md'de Paket 3+4 maddeleri `[T]` → `[x]`
2. `docs/decisions.md`'ye Paket 3+4'te alınan kritik kararlar (örn: variant render stratejisi, recent.ts API tasarımı, URL sync mekanizması) ADR olarak girer
3. `docs/status.md` güncellenir
4. `CLAUDE.md`'deki "Aktif paket" → Paket 5
5. `docs/prompts/paket-5.md` hazırlanır
6. Claude Code session'u kapatılır
7. Yeni session ile Paket 5 başlar (Service Worker + PWA + Deploy)

---

## Beklenen session davranışı

### Yapmalı

- Mockup 2 metin tarifini almadan detay sayfası kart layout'una karar vermemeli
- 27 yemek fotosuz — `DishPhoto` component'ı placeholder fallback ZORUNLU, kırık ikon görüntüsü asla
- AllergenChip / DietFlagChip için Tailwind `danger` ve `success` token'larını kullanmalı (ADR-0014)
- Arama URL sync için `goto()` (SvelteKit) ile soft navigation, sayfa reload olmamalı
- recent.ts store yazarken theme.svelte.ts pattern'ini takip etmeli (Svelte 5 runes, .svelte.ts ekstension'ı)
- Variant rendering: multi_select=true → checkbox, false → radio
- Her commit öncesi `git status` + `git diff` göstermeli
- Lighthouse skoru 90'ın altındaysa nedenini söylemeli

### Yapmamalı

- "Tamamlandı" demek
- Paket 5'e ait iş yapmak (service worker, manifest, deploy, GitHub Actions)
- Paket 1'in store imzasını değiştirmek
- Paket 2'nin component'lerini bozmak (Header, CategoryCard düzeni)
- menu.json'ı düzenlemek (Paket 3+4 scope dışı; eksik fotolar ayrı süreç)
- Hardcoded hex renk yazmak
- 44 px'den küçük tıklanabilir element üretmek
- Tahminle paket sürümü ya da SvelteKit/Svelte API'si yazmak — emin değilse web search yapmalı
- Foto içeriği için tahmin (foto yoksa placeholder, varsa olduğu gibi göster)
- Mockup 2'yi görselden okumak (kural 7)

---

## Beklenmedik durumda

- SvelteKit 2'de `goto()` parametre değişimi belirsizse: web search ile doğrula
- Filter kombinasyonları boş sonuç dönüyorsa: "Sonuç yok" empty state göster (graceful)
- 27 yemeğin fotosu yokken `<img>` tag'i 404 verirse: `onerror` handler ile placeholder'a fall-back
- Detay sayfasında geçersiz `id` parametresi gelirse: `error(404, 'Yemek bulunamadı')` (Paket 2 kategori sayfasındaki desen)
- Arama yavaşlarsa: input debouncing düşün ama 64 yemek için linear scan zaten <10ms olmalı; debounce gerekirse 50ms yeter

Kural hatırlatmaları Claude Code'u tekrar yola sokar.

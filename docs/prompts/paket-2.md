# Paket 2 — Başlangıç Prompt'u

Bu dosyadaki prompt'u Claude Code'a **kopyala-yapıştır** ile gönder.

---

## Prompt (Claude Code için)

```
Selam. Pathfinder projesinin Paket 2 üzerinde çalışacağız.

Önce şu dosyaları sırayla oku:

1. CLAUDE.md (proje kuralları ve aktif paket — Paket 2 olmalı)
2. docs/status.md (anlık durum, hangi engel, son commit)
3. TODO.md (Paket 2 üst seviye scope, açık dış bağımlılıklar)
4. docs/packages.md (sadece Paket 2 bölümü — diğer paketlere bakma)
5. docs/architecture.md (mimari kararlar, dark mode stratejisi, state)
6. docs/decisions.md (özellikle ADR-0007 Tailwind, ADR-0011 Tailwind v4)
7. PRD.md (başarı kriterleri ve kullanıcı personalarını hatırla)

Dosyaları okuduktan sonra bana Türkçe olarak şunları söyle:

- Paket 2'de yapılacak ana işler (madde madde)
- Kabul kriterlerinin kısa özeti
- Scope dışı olan ve Paket 3+4'e bırakılan şeyler
- Senin gördüğün 2-3 potansiyel risk veya belirsizlik
- Açık dış bağımlılıkları (TODO.md'deki "Açık dış bağımlılıklar" bölümünden)
  hatırlat — Tailwind tema token'ları, mockup 1, gerçek menu verisi

Benim onayımı bekle. "Başla" dediğimde kodlamaya geç.

Hatırlatmalar (kurallar):

- Kod tahminle yazılmaz. Emin olmadığın bir şey varsa bana sor.
- Görselden kod üretme — design token'larını metin olarak iste (kural 7).
- Windows üzerindeyim. PowerShell komutları öner, bash değil.
- TypeScript strict mode zorunlu. UTF-8 BOM'suz tüm dosyalar.
- "Tamamlandı" deme. Telefon testimle onaylanır.
- Component'ler aptal — business logic yok. Veri sadece $lib/stores
  üzerinden (ADR-0003).
- menu.json'ı doğrudan import etme. Yasak.
- Dark mode için hardcoded hex renk yasak — Tailwind token'ları kullan.
- Tüm tıklanabilir elementler ≥ 44×44 px.
- Paket 1'de yazılan store imzaları KORUNUR. Yeni fonksiyon eklenebilir,
  var olan değiştirilemez.
- Commit mesajları İngilizce (conventional commits).
- TODO.md durum kodlarını sen güncelle: [ ] → [~] → [T]. [T] → [x]
  geçişini yapma; benim onayımı bekle.

Eğer Tailwind tema token'ları, mockup 1 son hali veya gerçek menü verisi
hazır değilse: kodlamaya geçmeden önce bana neyin eksik olduğunu sor.
Eksik bilgiyle Paket 2 başlatma.
```

---

## Prompt öncesi hazırlık (Ahmet için)

Bu prompt'u Claude Code'a göndermeden önce şunlardan en az **biri** hazır olmalı:

### 1. Tailwind tema token kararları

Paket 2'de `tailwind.config.js` (veya Tailwind v4 CSS-first yaklaşımıyla `app.css` içinde `@theme` direktifi) yazılacak. Aşağıdaki token'lar netleşmeli:

**Semantic renkler (light/dark çiftli):**
- `danger` — alerjen chip'leri için (kırmızı tonu)
- `warning` — şef notu / dikkat için (amber tonu)
- `success` — diet flag chip'leri için (yeşil tonu)
- `info` — bilgilendirme için (mavi tonu)
- `neutral` skalası — arka plan, metin, kenar (zaten Tailwind'de var, custom isteniyor mu?)

**Kategori accent renkleri:**
`menu.json`'da her kategorinin `accent_color` hex'i var. Bunları Tailwind token'larına çevirelim mi (`bg-category-pizza` gibi) yoksa inline `style="background-color: {category.accent_color}"` mi kullanalım? İkincisi şu anda `+page.svelte`'te yapılıyor — basit ama Tailwind'in dark mode varyasyonunu kaybeder.

**Spacing ve radius:**
- Tailwind default'ları yeterli mi, yoksa kategori kartı için özel `rounded-card` token'ı mı?

### 2. Mockup 1 son hali

Ana sayfa + kategori sayfası mockup'ı. Görselden kod üretmek **yasak** (kural 7). Bunun yerine:

- Hangi başlık nerede?
- Kategori grid'inde kart boyutu, foto/icon var mı, sadece renk şeridi mi?
- "Son baktıkların" bandı dikey mi yatay mı? Mobilde nasıl görünüyor?
- Header'da arama ikonu mu yoksa açık arama input'u mu?

Bu sorulara metin yanıtlarını bana ver, Claude Code'a o yanıtlarla özet çıkar.

### 3. Gerçek menu.json (opsiyonel)

Paket 2 görsel iskelet için **gerçek veriye ihtiyaç duymaz** — placeholder yemekler de aynı UI'yı gösterir. Yine de gerçek isimler/açıklamalar varsa kategori grid'inde "Set Kahvaltı 3 yemek" yerine "Set Kahvaltı 3 gerçek yemek" görünür, Ahmet test ederken kafası daha rahat olur.

Yapacaksan: `src/lib/data/menu.json` içinde her `placeholder-*` kaydını gerçek yemekle değiştir. ID'leri kebab-case İngilizce slug yap. Kategori dağılımını koru (toplam 59).

---

## Paket 2 bittiğinde checkpoint

Claude Code "bitti" dediğinde (sen onaylayınca kesinleşir):

### Telefon testi

1. Bilgisayarda: `npm run dev`
2. Telefondan: `http://<bilgisayar-IP>:5173`
3. Ana sayfada 11 kategori grid görünüyor mu?
4. Bir kategoriye dokun → `/kategori/[id]` açılıyor mu?
5. Kategori sayfasında o kategorinin yemekleri (kart formatında) görünüyor mu?
6. Browser geri tuşu → ana sayfaya dönüyor mu, scroll pozisyonu korunuyor mu?
7. Telefon ayarından sistem temasını değiştir → uygulama otomatik dark/light arası geçiş yapıyor mu?
8. Header'daki manuel toggle → tema değişiyor mu, tarayıcı yeniden açıldığında hatırlıyor mu?
9. Hiçbir element 44×44 px'den küçük mü? (büyük ekrana yakınlaş)
10. Lighthouse Mobile (Chrome DevTools → Lighthouse → Mobile, Performance) → 90+?

### Kontrol listesi

`docs/packages.md`'deki Paket 2 kabul kriterlerini madde madde doğrula. Hepsi yeşilse:

1. TODO.md'de Paket 2 maddeleri `[T]` → `[x]`
2. `docs/decisions.md`'ye Paket 2'de alınan kritik kararlar (örn: Tailwind v4 CSS-first vs. JS config) ADR olarak girer
3. `docs/status.md` güncellenir
4. `CLAUDE.md`'deki "Aktif paket" → Paket 3+4
5. `docs/prompts/paket-3-4.md` hazırlanır
6. Claude Code session'u kapatılır
7. Yeni session ile Paket 3+4 başlar

---

## Beklenen session davranışı

### Yapmalı

- Tailwind tema token'larını dosyaya yazmadan önce sana sormalı
- Mockup 1'in metin tarifini almadan önce kart layout'una karar vermemeli
- Component'leri minimal tutmalı (business logic yok, sadece props + UI + emit)
- Dark mode'da her component'i ekran görüntüsü ile değil, kod ile (`dark:` prefix) test edilir hale getirmeli
- Her commit öncesi `git status` + `git diff` göstermeli
- Lighthouse skoru 90'ın altındaysa nedenini söylemeli

### Yapmamalı

- "Tamamlandı" demek
- Paket 3+4'e ait iş yapmak (yemek detay sayfası, arama UI, filtre, fotoğraf)
- Paket 1'in store imzasını değiştirmek
- Hardcoded hex renk yazmak (kural ihlali)
- 44 px'den küçük tıklanabilir element üretmek (kural ihlali)
- Tahminle paket sürümü ya da Tailwind v3/v4 farkı yazmak — emin değilse web search yapmalı
- `menu.json`'ı düzenlemek (Paket 2 scope dışı)

---

## Beklenmedik durumda

- Tailwind v4 ile JS config kullanımı netliği yoksa: web search yap, kaynağını göster
- Mockup 1'de detay belirsizse: ne dokunduğuna ek olarak ne göründüğünü sor
- Dark mode'da renk kontrastı belirsizse: WCAG AA uyumlu mu hesapla, gerekirse token'ı değiştir
- Bir component aynı işi 3 yerde yapıyor görüyorsan: tekrarı ortak component'e çıkar (reuse)

Kural hatırlatmaları Claude Code'u tekrar yola sokar.

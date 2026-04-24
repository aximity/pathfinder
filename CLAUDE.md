# Pathfinder — Proje Rehberi

Bu dosya Claude Code tarafından her session başında otomatik okunur. Proje genelinde geçerli kurallar, mimari kararlar ve referans dosyalara yönlendirme burada yer alır.

---

## Proje kimliği

**Ad:** Pathfinder
**Tür:** Mutfak-öncelikli dijital menü referans uygulaması (PWA)
**Hedef kullanıcı:** A la carte restoran şefleri ve servis ekibi
**Geliştirici:** Ahmet (Aximity markası, solo developer)
**Repo:** `aximity/pathfinder`
**Yerel yol:** `C:\Users\stare\Desktop\pathfinder`

### Problem tanımı

Mutfakta sipariş anında menü yemeklerinin içeriği, yan garnitürü, sosu veya seçenekleri hatırlanmıyor. PDF menüsü açıp sayfa çevirmek yavaş. WhatsApp veya galeri karıştırmak bilgi eksikliğiyle sonuçlanıyor. Pathfinder bu bilgiyi yapılandırılmış, aranabilir, fotoğraflı ve offline çalışan bir arayüze taşır.

### Başarı kriterleri

1. Herhangi bir yemeğin tam bilgisine en fazla 3 dokunuşta ulaşılabilir
2. Alerjen bilgisi her detayda en görünür konumda
3. Offline çalışır (otel Wi-Fi kesintisinden etkilenmez)
4. Türkçe arayüz, mobil öncelikli, mutfak ortamına uygun (büyük dokunma hedefleri)

---

## Teknik yığın

| Katman | Seçim |
|---|---|
| Framework | SvelteKit 2 (Svelte 5 runes) |
| Dil | TypeScript (strict mode) |
| Stil | Tailwind CSS |
| Build adapter | `@sveltejs/adapter-static` |
| Veri kaynağı (Faz 1) | `src/lib/data/menu.json` |
| Veri kaynağı (Faz 2) | FastAPI backend (sonra) |
| Offline | Service worker (SvelteKit native) |
| Deployment | GitHub Pages + GitHub Actions |
| Fotoğraflar | `static/photos/` repo içi (Faz 1), obje depolama (Faz 2) |

### Windows geliştirme ortamı

- PowerShell 5.x (UTF-8 profilli: `C:\Users\stare\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`)
- Python için `py`, `python` değil
- VSCode (Cursor değil)
- Node.js — uyumlu sürüm Paket 1'de netleştirilecek
- Claude Code `--dangerously-skip-permissions` ile çalıştırılır
- İlk komut daima `cd` — Claude Code varsayılanı `C:\WINDOWS\system32`

---

## Kritik kurallar — her session'da uygulanır

Bu kurallar ihlal edilemez. Her paket üretiminde, her kod incelemesinde, her commit öncesinde uygulanır.

### 1. KALİTE > HIZ (en yüksek öncelik)

Hızlı teslim etmek için kalite düşürülmez. "Bu sonra düzeltilir" veya "ayrı sprint olsun" refleksi bir kaçıştır — gerçek teknik gerekçe olmadan ertelenmez.

### 2. RAPOR ≠ GERÇEK

Test geçmesi, curl 200 dönmesi, build başarılı olması iş bitti anlamına gelmez. "Tamamlandı" sadece Ahmet telefonda gerçek cihazda doğruladıktan sonra söylenir. Başka bir Claude (Claude Code gibi) "yaptım" dese bile bağımsız doğrulama gerekir.

### 3. EKSİKSİZLİK > ÇOKLUK

Az ama tam çalışan iş, çok ama yarım iş'ten iyidir. Yarım kalmış işler "tamamlandı" olarak gösterilemez.

### 4. BAĞLAMSAL VARSAYIM YASAĞI

Saat, gün, mevsim, konum, kullanıcı durumu hakkında çıkarım yapılmaz. Dosya varlığı, paket sürümü, API cevabı gibi teknik bilgiler araçla doğrulanır. Emin olunmayan noktalarda soru sorulur.

### 5. TAMAMLANDI YASAĞI

"Tamamlandı", "hazır", "çalışıyor", "her şey iyi görünüyor" gibi ifadeler Ahmet onayı öncesinde kullanılmaz. Özellikle telefonda doğrulanması gereken UI işlerinde, telefon testi yapılmadan iş bitmiş sayılmaz.

### 6. KOD KONTROL KURALI

Her kod incelemesinde 5 katman geçer:
1. Imports / dependencies eksikleri
2. Null-safety ve edge case
3. UTF-8 / Türkçe karakter sorunları
4. Tip uyumsuzluğu (TypeScript strict mode)
5. Bulunan sorunlar severity ile listelenir (kritik / orta / düşük)

Emin olunmayan bölümler "burayı doğrulayamıyorum, test gerekli" olarak işaretlenir.

### 7. KODLAMA KURALI

- Tahminle işlem yapılmaz — bilinmiyorsa sorulur
- Dosya değişiklikleri öncesinde dosya görüntülenir
- Görselden kod üretilmez — design token'ları metin olarak istenir
- İşlem sonrası kabul kriterleri madde madde kontrol edilir
- İş bitince çalıştırılacak build/test komutu önerilir

### 8. GÜVENLİK KURALI

- API key, secret, credential asla repo içine girmez (`.env` + `.gitignore`)
- Kullanıcı girdisi hem client hem server seviyede doğrulanır
- Hata mesajlarında hassas bilgi sızdırılmaz
- Dependency audit düzenli olarak önerilir

### 9. HESAPLAMA KURALI

Para birimi, fiyat, sayısal veri için bellekten tahmin yapılmaz. Web search ile güncel rate alınır, kaynak gösterilir, adım adım hesaplanır.

### 10. SÜRE VERME YASAĞI

"30 dakika", "sabah", "yarın", "erken", "hızlı" gibi süre veya zaman tahminleri verilmez. Sadece işin kendisinden bahsedilir.

### 11. VARSAYIM YASAĞI (kullanıcı durumu)

"Yorgun olabilirsin", "saat geç", "dinlen", "bunu yarına bırak" gibi öneriler verilmez. Ahmet kendi durumunu kendisi bildirir.

### 12. KÜLTÜR/DİN/DİL BAĞIMSIZLIĞI

Her kaynaktan en iyiyi al, hiçbir gruba ait olma.

### 13. UZUN SESSION KORUMASI

Bu kurallar uzun session'larda unutulma eğilimindedir. Her 10 mesajda bir kurallara uyulup uyulmadığı kontrol edilir. İhlal varsa kendi başına düzeltilir, özür dilemek yerine bir sonraki mesajda kurala dönülür.

---

## Proje özel kurallar

### Dil

- **Arayüz metinleri:** tamamen Türkçe (başlık, buton, hata mesajı, placeholder)
- **Kod:** İngilizce (değişken, fonksiyon, class, dosya adı, yorum)
- **Git commit mesajları:** İngilizce (conventional commits: `feat:`, `fix:`, `refactor:` vb.)
- **Dokümantasyon (`docs/`, `README`):** Türkçe
- **Sınıf isimleri Tailwind'de İngilizce kalır**

### Türkçe karakter hijyeni

- Tüm dosyalar UTF-8 BOM'suz kaydedilir
- String karşılaştırmalarında `toLocaleLowerCase('tr')` kullanılır (`i/I/ı/İ` sorunları)
- JSON dosyalarında Türkçe karakter hataları için düzenli kontrol

### Component sorumlulukları

- Component'ler **aptal** olur — business logic içermez
- Veri erişimi sadece `$lib/stores/*` üzerinden yapılır
- Direct JSON import **yasaktır** (Faz 2'ye geçişi kırar)
- Side effect'ler `$effect` içinde, hesaplamalar `$derived` içinde

### Dark mode

Tüm component'ler hem açık hem koyu modda test edilir. Tailwind `dark:` prefix'i veya CSS variables kullanılır. Hardcoded hex renk yasak.

### Accessibility

- Tüm tıklanabilir elementler minimum 44×44 px
- Semantic HTML (`<button>`, `<nav>`, `<main>`)
- Alt text her görsele
- Keyboard navigation çalışır

---

## Aktif paket

**Şu anki paket:** Paket 1 — Temel + Data Layer

**Referans dosya:** `docs/packages.md`

Her paket başında bu bölüm güncellenir. Claude Code paket başlamadan önce ilgili paket tanımını okur ve Ahmet'e Türkçe özet çıkarır, onay bekler.

---

## Referans dosyalar

| Dosya | İçerik |
|---|---|
| `PRD.md` | Ürün tanımı (problem, kullanıcılar, başarı kriterleri, faz haritası) |
| `TODO.md` | Paket bazlı canlı checkbox tracker — `[ ]` `[~]` `[T]` `[x]` durum kodları |
| `docs/status.md` | Anlık durum notu — yeni session "şu an nerdeyiz" 5 saniyede okur |
| `docs/packages.md` | 5 paketin tam tanımı, kabul kriterleri, ertelenmeler |
| `docs/data-schema.md` | `menu.json` şeması, TypeScript tipleri, örnek kayıtlar |
| `docs/architecture.md` | Data access layer, Faz 2 geçiş mimarisi, state yönetimi |
| `docs/decisions.md` | Mimari karar günlüğü (ADR) |
| `docs/prompts/` | Her paket için Claude Code başlangıç prompt'ları |

---

## Session akışı

### Session başı

1. Claude Code `CLAUDE.md`'yi otomatik okur
2. `docs/status.md`'yi okur — şu an nerdeyiz, hangi engel var, son commit ne?
3. `TODO.md`'yi okur — `[T]` ve `[~]` durumda olan maddeler ön planda
4. Aktif paket için `docs/packages.md`'yi okur
5. İlgili mimari dosyalarını okur (`data-schema.md`, `architecture.md`)
6. Ahmet'e Türkçe özet çıkarır: "Paket [N]'de şunları yapacağız. Kabul kriterleri şunlar. Scope dışı olanlar şunlar. Başlayayım mı?"
7. Onay bekler

### Session içi

- Her önemli kararda Ahmet'e danışılır
- Her dosya değişikliği öncesi dosya görüntülenir
- Bilinmeyen bir konu varsa tahmin edilmez, sorulur
- Scope dışına çıkan ihtiyaç görülürse Ahmet'e bildirilir, kendi başına yapılmaz

### Session sonu

1. Yapılan işin özeti çıkarılır (ne tamamlandı, ne eksik)
2. Ahmet'in telefonda test etmesi için komut veya URL verilir
3. Ahmet onaylayana kadar "tamamlandı" denmez
4. **TODO.md güncellenir:** kod tarafı işleri Claude `[T]`'ye çekebilir; `[T]` → `[x]` geçişi sadece Ahmet'in görünür onayından sonra
5. Onaydan sonra `docs/decisions.md` güncellenir (kritik kararlar varsa)
6. **`docs/status.md` güncellenir** — son güncelleme tarihi, aktif paket, son commit, engel, bir sonraki adım
7. `CLAUDE.md`'deki "Aktif paket" bölümü bir sonraki pakete geçirilir

### TODO.md güncelleme protokolü

`TODO.md` durum kodu geçişlerinde uyulan kural:

- `[ ]` → `[~]` — Claude tek başına yapabilir (devam ediyor)
- `[~]` → `[T]` — Claude tek başına yapabilir (Ahmet'in test etmesi için bıraktı)
- `[T]` → `[x]` — **SADECE Ahmet'in onay mesajından sonra** Claude değiştirir

Bu protokol kural 2 (Rapor ≠ Gerçek) ve kural 5 (Tamamlandı yasağı) ile uyumludur. Claude tek başına `[x]` koyamaz.

---

## Faz haritası

**Faz 1 — MVP (şu an):** Statik PWA, 59 yemek, offline, tek kullanıcılı

**Faz 2 — Çok kullanıcılı:** FastAPI backend, kullanıcı hesapları, telefondan admin, role-based izinler

**Faz 3 — Ekip işletim merkezi:** Bildirim, duyuru, hatırlatma, VIP oda notu, yaklaşan etkinlik takibi, push notification

Her faz bir önceki fazın mimarisine **kırılma olmadan** eklenir. Faz 1'de verilen mimari kararlar Faz 2'yi hazır tutar (detay: `docs/architecture.md`).

---

## İletişim

Claude Code ile iletişim Türkçe yürür. Ahmet kural ihlali gördüğünde düzeltme ister — Claude Code özür yerine bir sonraki mesajda kurala döner.

Shortcut referansları:
- "P1" = Paket 1
- "DAL" = Data Access Layer
- "ADR" = Architecture Decision Record (`docs/decisions.md`)

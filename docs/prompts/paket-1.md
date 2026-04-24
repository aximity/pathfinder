# Paket 1 — Başlangıç Prompt'u

Bu dosyadaki prompt'u Claude Code'a **kopyala-yapıştır** ile gönder.

---

## Prompt (Claude Code için)

```
Selam. Pathfinder projesinin Paket 1 üzerinde çalışacağız.

Önce şu dosyaları sırayla oku:

1. CLAUDE.md (proje kuralları ve kimliği)
2. docs/packages.md (Paket 1 tanımı - diğer paketlere bakma, sadece
   Paket 1'e odaklan)
3. docs/data-schema.md (veri şeması)
4. docs/architecture.md (data access layer ve mimari kararlar)
5. docs/decisions.md (ADR'ler - yapılmış kararlar)

Dosyaları okuduktan sonra bana Türkçe olarak şunları söyle:

- Paket 1'de yapılacak 3 ana iş (madde madde)
- Kabul kriterlerinin kısa özeti
- Scope dışı olan ve Paket 2'ye bırakılan şeyler
- Senin gördüğün 2-3 potansiyel risk veya belirsizlik

Benim onayımı bekle. "Başla" dediğimde kodlamaya geç.

Önemli kurallar:

- Kod tahminle yazılmaz. Emin olmadığın bir şey varsa bana sor.
- Windows üzerindeyim. PowerShell komutları öner, bash değil.
- İlk komut her zaman `cd C:\Users\stare\Desktop\pathfinder`.
- "Tamam" veya "bitti" deme. Benim telefon testimle onaylanır.
- Scope dışına çıkma. Paket 2'ye ait bir şey fark edersen bana söyle.
- Her dosya değişikliğinden önce dosyayı görüntüle.
- TypeScript strict mode zorunlu.
- UTF-8 BOM'suz tüm dosyalar.
- Commit mesajları İngilizce (conventional commits).

Başlangıçta bir şey netleştirmek istersen hemen sor.
```

---

## Prompt öncesi hazırlık (Ahmet için)

Bu prompt'u Claude Code'a göndermeden önce yapılacaklar:

### 1. Repo'yu oluştur

GitHub'da `aximity/pathfinder` repo'sunu oluştur (public veya private, sen karar ver).

### 2. Yerel klasörü hazırla

```powershell
cd C:\Users\stare\Desktop\pathfinder
git init
git remote add origin https://github.com/aximity/pathfinder.git
```

### 3. Dokümantasyon dosyalarını yerleştir

Bu 4 dosya repo kökünde hazır olmalı (aşağıdaki zip'ten çıkarılanlar):

```
pathfinder/
├── CLAUDE.md
├── docs/
│   ├── packages.md
│   ├── data-schema.md
│   ├── architecture.md
│   ├── decisions.md
│   └── prompts/
│       └── paket-1.md
└── src/
    └── lib/
        └── data/
            └── menu.json       # daha önce ürettiğimiz JSON
```

### 4. İlk commit

```powershell
git add CLAUDE.md docs/ src/lib/data/menu.json
git commit -m "docs: add project foundation (CLAUDE.md, docs/, menu.json)"
git push -u origin main
```

### 5. Claude Code'u başlat

```powershell
cd C:\Users\stare\Desktop\pathfinder
claude --dangerously-skip-permissions
```

### 6. Yukarıdaki prompt'u gönder

Claude Code dosyaları okuyacak, sana özet çıkaracak. Özet seni tatmin ediyorsa "Başla" de. Tatmin etmiyorsa ne eksik gördüğünü söyle, düzeltsin.

---

## Paket 1 bittiğinde checkpoint

Claude Code "bitti" dediğinde (bu senin onayınla kesinleşir, onun raporuyla değil):

### Telefon testi

1. Bilgisayarda: `npm run dev`
2. Telefon aynı Wi-Fi'deyken: `http://[bilgisayar-IP]:5173`
3. Ana sayfada "59 yemek · 11 kategori" görünüyor mu?
4. DevTools Console: `menuStore.getById('palazzo-breakfast')` döndürüyor mu?
5. TypeScript kontrol: `npm run check` — 0 hata

### Kontrol listesi

`docs/packages.md`'deki Paket 1 kabul kriterlerini madde madde doğrula:

- [ ] Repo GitHub'da, commit history temiz
- [ ] `menu.json` doğrudan import edilmemiş hiçbir route'tan
- [ ] Store fonksiyonlarının hepsi async
- [ ] Ana sayfada sayılar store'dan dinamik geliyor
- [ ] `npm run check` sıfır hata
- [ ] Console'da `getById` test sonuç veriyor
- [ ] README'de Windows talimatı var

### Hepsi yeşilse

1. Bu dosyayı yorum olarak `[Paket 1 - TAMAMLANDI: YYYY-MM-DD]` ile işaretle
2. `docs/decisions.md`'ye Paket 1'de alınan kritik teknik kararları yaz (örn: Node sürümü, LICENSE seçimi)
3. `CLAUDE.md`'nin "Aktif paket" bölümünü **Paket 2** olarak güncelle
4. Claude Code session'unu kapat
5. Paket 2 prompt'u için ayrı dosya hazırlarız (`docs/prompts/paket-2.md`)

---

## Beklenen session davranışı

Claude Code'un bu session'da göstermesi gereken davranışlar:

### Yapmalı

- Her dosya okuma / değiştirme öncesi dosyayı görüntülemeli
- Kararları adım adım söylemeli, bir şeyi belirsiz bırakmamalı
- Node sürümü, package versiyonları gibi konularda "en güncel LTS ne?" diye web search yapmalı
- Bilmediği bir konuda (örn. LICENSE seçimi, repo görünürlüğü) sana sormalı
- Her commit öncesi `git status` ve `git diff` göstermeli

### Yapmamalı

- "Tamamlandı" demek
- Paket 2'ye ait herhangi bir şey yapmak (kategori sayfası, yemek kartı vb.)
- Dark mode, routing, fotoğraf gibi sonraki paket işlerine girmek
- `menu.json`'ı değiştirmek (veri kilitli)
- Tahmin ile paket sürümü yazmak
- Gereksiz dependency eklemek (sadece: Svelte, SvelteKit, TypeScript, Tailwind, gerekli tip paketleri)

---

## Beklenmedik durumda

Session içinde beklenmedik bir şey olursa:

- Claude Code kural ihlali yaparsa: "Kural X'i hatırla, düzelt" de
- Scope dışı bir şey yapmaya başlarsa: "Scope Paket 1, bu Paket 2'ye ait. Geri dön" de
- Emin olmadığı bir şeyi tahminle yaparsa: "Tahminle yaptın, neye dayandın? Doğrulatalım" de
- "Tamamlandı" derse: "Rapor ≠ gerçek, ben telefonda test edeceğim" de

Kural hatırlatmaları Claude Code'u tekrar yola sokar.

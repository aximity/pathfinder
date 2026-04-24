# Pathfinder TODO

> **Aktif paket:** Paket 1 — telefon testi bekleniyor
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

## Paket 1 — Temel ve Data Access Layer

### Kod işleri

- [T] SvelteKit 2 + Svelte 5 runes + TypeScript strict + Tailwind CSS v4 kurulumu
- [T] `src/lib/data/menu.json` — şema-uyumlu placeholder (11 kategori, 59 yemek; 7'si gerçek veri, 52'si `placeholder-*`)
- [T] `src/lib/types/menu.ts` — tüm şema tipleri, Türkçe ne/neden yorumları
- [T] `src/lib/stores/menu.ts` — 7 async fonksiyon + 5 maddelik şema doğrulama
- [T] `src/routes/+page.svelte` — dinamik sayılar, kategori listesi, console testi rehberi
- [T] README (TR), LICENSE (MIT), `.gitignore`, `.editorconfig`, `.prettierrc`, `.prettierignore`
- [T] İlk commit: `a049ed5 feat: bootstrap Paket 1 - project foundation and data access layer`

### Telefon testi

- [T] `npm run dev` çalışıyor → telefondan `http://<bilgisayar-IP>:5173` açılıyor
- [T] Anasayfada **"59 yemek · 11 kategori"** sayıları görünüyor (store'dan dinamik)
- [T] Anasayfada 11 kategori sıralı + accent renkleri görünüyor
- [T] Console: `await menuStore.getById('palazzo-breakfast')` → Palazzo Kahvaltı kaydı dönüyor
- [T] Console: `await menuStore.search('karides')` → Sezar Karidesli + Jumbo Karides
- [T] `npm run check` → 0 hata
- [T] `npm run build` → temiz build, uyarı yok

### Paket kapanışı (Ahmet onayından sonra)

- [ ] `docs/decisions.md`'ye Paket 1 ADR'leri ekle (ADR-0010 Node 24 LTS, ADR-0011 Tailwind v4, ADR-0012 menu.json placeholder yaklaşımı)
- [ ] `CLAUDE.md`'deki "Aktif paket" bölümü → **Paket 2**
- [ ] GitHub'da `aximity/pathfinder` repo'sunu oluştur (Ahmet manuel)
- [ ] `git remote add origin` + `git push -u origin main` (Ahmet onayı ile)
- [ ] `docs/prompts/paket-2.md` başlangıç prompt'u hazırla

---

## Paket 2 — UI İskelet ve Navigation

(Paket 1 onaylanınca checkbox listesi `docs/packages.md`'den türetilerek eklenecek.)

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

- **Paket 2 başlayabilir için:** Paket 1 onaylı + Tailwind tema token kararı + mockup 1 son hali (Ahmet'ten)
- **Paket 3+4 başlayabilir için:** Paket 2 onaylı + mockup 2 son hali + fotoğraf yükleme talimatı netleşmiş
- **Paket 5 başlayabilir için:** Paket 3+4 onaylı + GitHub Pages domain kararı (custom domain mı varsayılan mı)

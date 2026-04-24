# Pathfinder — Ürün Tanımı (PRD)

Mutfak-öncelikli dijital menü referans uygulaması. A la carte restoran şefleri ve servis ekibi için, sipariş anında menü bilgisine en fazla 3 dokunuşta erişim sağlar.

---

## Problem

A la carte restoranlarda mutfak ekibi, sipariş anında menü yemeklerinin içeriğini, yan garnitürünü, sosunu, alerjenlerini veya müşteri seçeneklerini çoğu zaman hatırlayamaz. PDF menü açıp sayfa çevirmek yavaş, WhatsApp veya galeri karıştırmak bilgi eksikliğine neden olur. Bu bilgi boşluğu yanlış sipariş, alerjen kazası ve servis gecikmesine yol açar.

Pathfinder bu bilgiyi yapılandırılmış, aranabilir, fotoğraflı ve **offline** çalışan bir arayüze taşır. Mutfakta otel Wi-Fi'sinin kesilmesi uygulamayı durdurmaz.

---

## Hedef kullanıcılar

**Şef / aşçıbaşı**
Sipariş geldiğinde "bu yemeğin yanına ne gidiyor", "soslar nedir", "müşteri seçimi var mı" sorularına 5 saniyede cevap arar. Birincil kullanıcı.

**Servis elemanı / garson**
Müşteri masada "bu yemekte süt var mı, glutensiz olarak yapılır mı" diye sorduğunda telefonu çıkarıp anında bakabilmeli. Mutfağa koşmadan cevap vermeli.

**Otel mutfak yöneticisi (sezonluk)**
Yeni başlayan personele menüyü öğretirken referans olarak kullanır. Eğitim süresini kısaltır, fotoğraflarla görsel bellek kurar.

---

## Başarı kriterleri

**Kalitatif**

1. Herhangi bir yemeğin tam bilgisine en fazla **3 dokunuşta** ulaşılabilir
2. **Alerjen bilgisi** her detay sayfasında en görünür konumda (kırmızı chip + ikon)
3. **Offline** çalışır — Wi-Fi kesilse bile uygulama açık ve aranabilir kalır
4. Türkçe arayüz, **mobil-öncelikli**, mutfak ortamına uygun (büyük dokunma hedefleri ≥ 44×44 px, dark mode)

**Sayısal**

5. İlk yükleme süresi (yavaş 3G dahil) **< 3 saniye**
6. Arama sonucu görünme süresi **< 100 ms** (59 yemek için)
7. Lighthouse Mobile Performance skoru **90+**, Accessibility skoru **95+**

---

## Çözüm yaklaşımı

Statik PWA — SvelteKit 2 + TypeScript + Tailwind CSS, GitHub Pages üzerinde servis. Service worker ile offline cache (app shell + son görüntülenen fotoğraflar). Veri Faz 1'de `menu.json` statik dosyada, Faz 2'de FastAPI backend'de — ama **JSON şeması = API response formatı** (ADR-0004) prensibi gereği kod değişmez, sadece veri kaynağı değişir.

Component'ler `menu.json`'ı doğrudan import edemez (ADR-0003); her veri erişimi `menuStore` üzerinden yapılır. Bu sayede Faz 2 geçişi 30+ component'i yeniden yazmadan, tek dosya değişikliğiyle tamamlanır.

---

## Faz haritası

**Faz 1 — MVP (şu an):** Statik PWA, 59 yemek, offline, tek kullanıcılı (paylaşılan link). 5 paket halinde paketlenmiş — detay: [docs/packages.md](docs/packages.md).

**Faz 2 — Çok kullanıcılı:** FastAPI backend + PostgreSQL, kullanıcı hesapları (chef / waiter / admin rolleri), telefondan menü düzenleme, role-based izinler. JSON şeması korunur — frontend değişmez.

**Faz 3 — Ekip işletim merkezi:** Push notification, duyuru, hatırlatma, VIP oda notu, yaklaşan etkinlik takibi. Pathfinder bir "menü uygulaması"ndan "mutfak ekibi işletim sistemi"ne dönüşür.

---

## Faz 1 kapsamı (girecek)

1. SvelteKit + TypeScript strict + Tailwind v4 + adapter-static
2. 11 kategoriye yayılmış 59 yemek için kategori grid + kategori sayfası + detay sayfası
3. Real-time arama (yemek adı + açıklama + tag + bileşenler), Türkçe karakter güvenli
4. Alerjen filtresi (7 alerjen) + diet flag filtresi (8 etiket), URL'de paylaşılabilir
5. Yemek fotoğrafları, lazy loading, fallback placeholder
6. Dark mode (sistem tercihi + manuel toggle, localStorage'da kalıcı)
7. Service worker — app shell + JSON cache + görülen fotoğraf cache
8. PWA manifest + "Ana ekrana ekle" desteği (iOS Safari + Android Chrome)
9. GitHub Actions ile otomatik deploy (`main` push → 2-3 dakikada canlı)

---

## Kapsam dışı (Faz 1 — sonraki fazlara)

- **Kullanıcı hesapları, login** (Faz 2)
- **Telefondan menü düzenleme / admin arayüzü** (Faz 2)
- **Push notification** (Faz 3)
- **VIP oda notu, duyuru, etkinlik takibi** (Faz 3)
- **Çok dilli arayüz** (şu an sadece Türkçe; ileride EN/RU eklenebilir)
- **Müşteri-yüzlü self-servis** (Pathfinder mutfak/servis için, müşteri için değil)
- **Stok / fiyat senkronizasyonu** (POS sistemi entegrasyonu Faz 3+)

---

## Çekirdek ilke

> **Bilgi güçtür, veri bilgidir.** Mutfakta her saniye değerli; uygulamanın görevi bilgiyi en kısa yoldan, en az hata payıyla ulaştırmaktır.

Pathfinder Aximity markası altında geliştirilen GDYON, MeyDey, Meetink ekosisteminin parçasıdır. Solo developer (Ahmet Hakan Yıldız) tarafından, mutfak-öncelikli bir "işletme aracı" olarak konumlandırılmıştır — GDYON gibi insan gelişim aracı değil.

---

## Referanslar

| Dosya | İçerik |
|---|---|
| [README.md](README.md) | Kurulum, çalıştırma, klasör yapısı |
| [TODO.md](TODO.md) | Canlı checkbox tracker (paket bazlı) |
| [docs/status.md](docs/status.md) | Anlık durum (yeni session açan LLM için) |
| [docs/packages.md](docs/packages.md) | 5 paketin tam tanımı + kabul kriterleri |
| [docs/architecture.md](docs/architecture.md) | DAL, Faz 2 geçiş prensibi, state yönetimi |
| [docs/data-schema.md](docs/data-schema.md) | menu.json şeması + TypeScript karşılıkları |
| [docs/decisions.md](docs/decisions.md) | Architecture Decision Records (ADR) |
| [CLAUDE.md](CLAUDE.md) | Proje kuralları (Claude Code otomatik okur) |

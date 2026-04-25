# Eksik Fotoğraflar

> Bu dosya `menu.json`'da `photos: []` olan yemekleri listeler. Ahmet sonraki foto turunda bu yemekler için fotoğraf sağladığında, Claude slug'la eşleştirip `static/photos/{dish_id}-01.jpeg` olarak yerleştirir ve ilgili `photos` array'ini günceller.
>
> **Son güncelleme:** 2026-04-25
> **Mevcut durum:** 37/64 yemek fotolu (%58)

---

## Eksik 27 yemek (kategoriye göre)

### Set Kahvaltılar (2/3 eksik)

- [ ] `kontinental-breakfast` — Kontinental Kahvaltı
- [ ] `palazzo-breakfast` — Palazzo Kahvaltı

### A La Carte Kahvaltı (5/11 eksik)

- [ ] `cereals` — Tahıl Çeşitleri (Mısır gevreği / Çikolata topları / Nesti / Granola)
- [ ] `yogurt-selection` — Yoğurt Çeşitleri (Sade / Çilek / Orman meyveli / Kayısı)
- [ ] `bakery-basket` — Ekmek Sepeti (Kruvasan / Danimarka çörekleri / tost ekmekleri)
- [ ] `two-eggs` — İki Yumurta + Et Seçimi (sahanda + bacon/sosis/sucuk)
- [ ] `pancake` — Pankek (akçaağaç şurubu + meyve salatası ile)

### Salatalar ve Başlangıçlar (1/8 eksik)

- [ ] `caesar-shrimp` — Sezar Salatası Karidesli

### Sandviç ve Burger (2/6 eksik)

- [ ] `chicken-quesadilla` — Tavuklu Quesadilla
- [ ] `meatball-wrap` — Köfte Dürüm

### Pizza (3/4 eksik)

- [ ] `pizza-mexicana` — Pizza Meksika (jalapeno + sucuk + chili con carne)
- [ ] `pizza-funghi` — Mantarlı Pizza (mantar + roka)
- [ ] `pizza-pepperoni` — Pepperoni Pizza (popüler)

### Makarnalar (2/4 eksik)

- [ ] `penne-arabiata` — Penne Arabiata (acılı domates sos)
- [ ] `kayseri-manti` — Kayseri Mantı (yoğurt sos + acılı tereyağı)

### Et ve Tavuk (2/6 eksik)

- [ ] `meatballs-yogurt` — Yoğurtlu Köfte (tırnaklı pide + yoğurt sos + kekikli tereyağı)
- [ ] `chicken-skewer` — Tavuk Şiş (acılı / acısız)

### Tatlılar (4/10 eksik)

- [ ] `lemon-mint-sorbet` — Limon ve Naneli Sorbe
- [ ] `cream-dessert` — Kaymak
- [ ] `assorted-ice-cream` — Dondurma Çeşitleri (1 Top)
- [ ] `baked-rice-pudding` — Fırın Sütlaç (damla sakızlı)

### Çocuk Menüsü (6/6 eksik — komple)

- [ ] `kids-lentil-soup` — Mercimek Çorbası (Çocuk)
- [ ] `kids-spaghetti` — Spaghetti (Çocuk) — Bolonez veya Tereyağı sos
- [ ] `kids-mini-cheeseburger` — Mini Cheeseburger
- [ ] `kids-pizza-margarita` — Pizza Margarita (Çocuk)
- [ ] `kids-chicken-nuggets` — Tavuk Nuggets
- [ ] `kids-mini-meatballs` — Mini Köfte (Kuzu + Dana)

---

## Fotoğraf eşleştirme protokolü

Ahmet bu yemeklerin fotolarını `static/photos/` klasörüne attığında:

1. Foto isimleri herhangi bir şey olabilir (WhatsApp default, kamera ismi vb.)
2. Claude foto'yu görsel olarak okur, hangi yemek olduğunu tahmin eder, Ahmet'e doğrulatır
3. Onaylanan eşleşmeler `{dish_id}-01.jpeg` formatında yeniden adlandırılır
4. `menu.json`'da ilgili yemeğin `photos` array'i `["photos/{dish_id}-01.jpeg"]` ile güncellenir
5. Aynı yemeğin birden fazla fotosu varsa `-02`, `-03` olarak eklenir

## Kalite ölçütleri (ADR-0009)

- Boyut: < 500 KB / foto (mevcut WhatsApp jpeg'leri zaten 100-330 KB aralığında)
- Format: JPEG kabul, WebP tercih (zorunlu değil)
- Çözünürlük: ~1000×1000+ (Paket 3+4'te lazy load + responsive sizing yapılacak)
- Aydınlatma: tabağın net görünmesi yeterli (mutfak masası standart)
- Tek-yemek: çoklu sergi/BTS fotoları kullanılmaz, gerekirse PIL ile crop edilir

## İleride

- 27 eksik yemeğin fotosu tamamlandığında bu dosya silinir veya boşaltılır
- Paket 3+4'te `DishPhoto` component'i bu fotoğrafları lazy-load + fallback placeholder ile render eder
- Foto yoksa Paket 3+4'te SVG placeholder gösterilir (ADR-0009 fallback davranışı)

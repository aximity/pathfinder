# Veri Şeması

`menu.json` dosyasının yapısı, TypeScript karşılıkları ve örnek kayıtlar. Bu şema **hem Faz 1 statik JSON'ın hem de Faz 2 API response'unun formatıdır** — aynen kalacak, sadece veri kaynağı değişecek.

---

## Üst seviye yapı

```json
{
  "version": "1.0",
  "last_updated": "2026-04-24",
  "source": "Kaya Palazzo menü PDF",
  "language": "tr",
  "categories": [ ... ],
  "dishes": [ ... ],
  "metadata": { ... }
}
```

### TypeScript karşılığı

```typescript
export interface Menu {
  version: string;
  last_updated: string;  // ISO date: "YYYY-MM-DD"
  source: string;
  language: "tr";
  categories: Category[];
  dishes: Dish[];
  metadata: Metadata;
}
```

---

## Category

```typescript
export interface Category {
  id: string;            // slug, kebab-case, İngilizce
  name: string;          // UI'da görünen Türkçe ad
  order: number;         // 1'den başlar, gösterim sırası
  accent_color: string;  // hex, kategori kart şeridi için
}
```

Örnek:

```json
{
  "id": "meat-chicken",
  "name": "Et ve Tavuk",
  "order": 9,
  "accent_color": "#993C1D"
}
```

### 11 kategori

| order | id | name | accent_color |
|---|---|---|---|
| 1 | `set-breakfast` | Set Kahvaltılar | #F0997B |
| 2 | `a-la-carte-breakfast` | A La Carte Kahvaltı | #EF9F27 |
| 3 | `salads-appetizers` | Salatalar ve Başlangıçlar | #97C459 |
| 4 | `soups` | Çorbalar | #BA7517 |
| 5 | `sandwich-burger` | Sandviç ve Burger | #7F77DD |
| 6 | `pizza` | Taş Fırından | #E24B4A |
| 7 | `pasta` | Makarnalar | #D85A30 |
| 8 | `seafood` | Denizden | #378ADD |
| 9 | `meat-chicken` | Et ve Tavuk | #993C1D |
| 10 | `dessert` | Tatlılar | #D4537E |
| 11 | `kids-menu` | Çocuk Menüsü | #5DCAA5 |

---

## Dish

```typescript
export interface Dish {
  id: string;                 // slug, kebab-case, unique
  category_id: string;        // Category.id'ye referans
  name: string;               // Türkçe ad
  price: number;              // tam sayı, TL cinsinden
  currency: "TL";
  description: string;        // 1-3 cümle Türkçe açıklama
  cooking_method: string | null;
  components: Components;
  variants: Variant[];        // müşteri seçimleri (sıfır veya daha fazla)
  extras: Extra[];            // opsiyonel ek ürünler
  allergens: Allergen[];
  diet_flags: DietFlag[];
  photos: string[];           // dosya yolu: "photos/xxx-01.webp"
  tags: string[];             // arama için ek anahtarlar
  chef_notes: string;         // boş string olabilir
  active: boolean;            // false ise menüde görünmez
}
```

---

## Components

Yemeğin içeriğini 4 alt kategoriye böler. Bu bölümleme UI'da chip'lerin gruplanmasını sağlar.

```typescript
export interface Components {
  main: string;              // ana ürün tek cümle
  sides: string[];           // yan garnitürler
  sauces: string[];          // soslar
  garnishes: string[];       // süsleme, tamamlayıcı
}
```

Örnek (Palazzo Kahvaltı):

```json
{
  "main": "İki yumurta (tercihinize göre) + meyve salatası",
  "sides": ["Kruvasan", "Danimarka çörekleri", "Mantar", "Patates"],
  "sauces": ["Reçel", "Marmelat", "Bal", "Tereyağı"],
  "garnishes": []
}
```

---

## Variant

Müşterinin seçmek zorunda olduğu opsiyon grupları. `multi_select` flag'i tek mi çoklu mu seçim olduğunu belirtir.

```typescript
export interface Variant {
  group: string;             // başlık: "Meyve suyu", "Yumurta pişirme"
  multi_select: boolean;     // true = checkbox, false = radio
  options: (string | VariantOption)[];
}

export interface VariantOption {
  label: string;             // gösterim adı
  price_override?: number;   // bu seçim yapıldığında fiyat değişirse
}
```

Örnek (Üç Yumurtalı Omlet):

```json
{
  "variants": [
    {
      "group": "Sebzeler",
      "multi_select": true,
      "options": ["Domates", "Biber", "Mantar", "Soğan", "Ispanak"]
    },
    {
      "group": "Peynirler",
      "multi_select": true,
      "options": ["Kaşar peyniri", "Beyaz peynir"]
    },
    {
      "group": "Etler",
      "multi_select": true,
      "options": ["Dana bacon", "Dana sosis", "Tavuk sosis"]
    }
  ]
}
```

Price override örneği (Beef or Chicken Wrap):

```json
{
  "group": "Et tercihi",
  "multi_select": false,
  "options": [
    { "label": "Dana (1750 TL)", "price_override": 1750 },
    { "label": "Tavuk (990 TL)", "price_override": 990 }
  ]
}
```

---

## Extra

Müşterinin isteğe bağlı ekleyebileceği ürünler. `variants`'tan farklı — variant seçim zorunluluğu, extra opsiyonel.

```typescript
export interface Extra {
  name: string;
  price_delta: number | null;   // null = fiyat bilinmiyor, chef'e sor
}
```

Örnek (Palazzo Burger):

```json
{
  "extras": [
    { "name": "Çedar peyniri", "price_delta": null },
    { "name": "Dana bacon", "price_delta": null },
    { "name": "Mantar", "price_delta": null }
  ]
}
```

---

## Allergen

7 standart alerjen union type.

```typescript
export type Allergen =
  | "gluten"
  | "dairy"
  | "eggs"
  | "nuts"
  | "shellfish"
  | "fish"
  | "soy";
```

UI'da Türkçe karşılıkları:

| key | label |
|---|---|
| gluten | Gluten |
| dairy | Süt |
| eggs | Yumurta |
| nuts | Fındık / Sert Kabuklu |
| shellfish | Kabuklu Deniz Ürünü |
| fish | Balık |
| soy | Soya |

---

## DietFlag

Yemeğin özellik etiketleri. Alerjen değil, pozitif bilgi.

```typescript
export type DietFlag =
  | "vegetarian"
  | "vegan"
  | "gluten_free"
  | "spicy"
  | "healthy"
  | "high_protein"
  | "vegetarian_possible"
  | "child_friendly";
```

UI'da Türkçe karşılıkları:

| key | label |
|---|---|
| vegetarian | Vegetaryen |
| vegan | Vegan |
| gluten_free | Glutensiz |
| spicy | Acılı |
| healthy | Sağlıklı |
| high_protein | Yüksek protein |
| vegetarian_possible | Vegetaryen yapılabilir |
| child_friendly | Çocuk dostu |

---

## Metadata

```typescript
export interface Metadata {
  total_categories: number;
  total_dishes: number;
  allergen_keys: Allergen[];
  diet_flag_keys: DietFlag[];
  reserved_fields_for_future: string[];
}
```

`reserved_fields_for_future` Faz 2/3'e hazırlık için not:
- `preparation_time` — hazırlanma süresi (dakika)
- `popularity_score` — analytics verisi
- `wine_pairing` — somelye eşleştirmesi
- `nutritional_info` — kalori, makro
- `seasonal` — sezona bağlı mı
- `chef_tips` — sunum ipucu
- `display_order` — kategori içi gösterim sırası
- `last_modified_by` — Faz 2'de hangi user değiştirdi
- `version` — yemek başına versiyon

Faz 2'de bu alanlar Dish interface'ine optional olarak eklenir. Faz 1'de olmamaları sorun değil.

---

## Türkçe karakter hijyeni

JSON dosyası UTF-8 BOM'suz kaydedilir. Tüm Türkçe karakter işlemlerinde `toLocaleLowerCase('tr')` kullanılır:

```typescript
// YANLIŞ
dish.name.toLowerCase().includes(query.toLowerCase());
// "Şiş" → "şi̇ş" (dotted I sorunu)

// DOĞRU
dish.name.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'));
// "Şiş" → "şiş" (doğru)
```

---

## Veri doğrulama (Paket 1'de)

Store yüklendiğinde şu kontroller yapılır:

1. Tüm `dish.category_id` değerleri `categories` içinde var mı?
2. Tüm `dish.id` değerleri unique mi?
3. Tüm `dish.allergens` değerleri `metadata.allergen_keys` içinde mi?
4. Tüm `dish.diet_flags` değerleri `metadata.diet_flag_keys` içinde mi?
5. Fiyatlar pozitif tam sayı mı?

Hata bulunursa console'a warning yazılır, uygulama yine çalışır (graceful degradation).

---

## Güncelleme akışı

**Faz 1'de:** `menu.json` dosyasını elle düzenle, commit at, push et → GitHub Actions build → canlı.

**Faz 2'de:** Admin UI'dan yemek ekle/düzenle → backend kaydeder → frontend cache invalidate eder.

Her iki durumda da `version` ve `last_updated` alanları güncellenmelidir.

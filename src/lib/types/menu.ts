/**
 * Menü veri şemasının TypeScript karşılığı.
 *
 * NEDEN: Faz 1'de menu.json, Faz 2'de FastAPI backend — aynı şema kullanılacak.
 * Bu dosya "JSON şeması = API response formatı" prensibinin (ADR-0004)
 * tek doğruluk kaynağıdır. Alerjen veya diet flag yanlış yazılırsa derleme
 * aşamasında hata verir, runtime'a sızmaz.
 *
 * NEREDE KULLANILIR: src/lib/stores/menu.ts veri erişim katmanı, tüm Svelte
 * component'leri prop tipleri, arama/filtre fonksiyonları.
 *
 * DEĞİŞTİRİLİRSE: docs/data-schema.md da güncellenmeli; Faz 2 backend'i bu
 * tipleri response formatı olarak korumak zorundadır.
 */

// 7 standart alerjen. Menüdeki her yemek bu listeden 0 veya daha fazla
// alerjen içerebilir. Union type olması, yanlış string yazımının
// derleme zamanında yakalanmasını sağlar.
export type Allergen =
  | 'gluten'
  | 'dairy'
  | 'eggs'
  | 'nuts'
  | 'shellfish'
  | 'fish'
  | 'soy';

// Yemeğin pozitif özellik etiketleri (vegan, acılı, çocuk dostu vb.).
// Alerjen'in "uzak dur" listesidir; diet flag ise "var mı?" listesidir.
export type DietFlag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'spicy'
  | 'healthy'
  | 'high_protein'
  | 'vegetarian_possible'
  | 'child_friendly';

// Menüdeki üst kategoriler (Set Kahvaltı, Pizza, Tatlı vs.). accent_color
// UI'da kategori kartının renk şeridinde kullanılır, data-schema.md'de
// her kategori için tanımlanmıştır.
export interface Category {
  id: string; // slug, İngilizce kebab-case, route parametresi olarak kullanılır
  name: string; // UI'da görünen Türkçe ad
  order: number; // gösterim sırası (1'den başlar)
  accent_color: string; // hex renk
}

// Yemeğin içeriğini 4 alt gruba böler. UI'da "ana", "yan", "sos",
// "garnitür" başlıkları altında chip'ler halinde gösterilir.
export interface Components {
  main: string;
  sides: string[];
  sauces: string[];
  garnishes: string[];
}

// Müşteri varyant seçeneği. String (basit etiket) veya obje
// (etiket + price_override) olabilir — etkil etiketli seçim fiyatı
// değiştirirse object form kullanılır (örn: "Dana (1750 TL)").
export interface VariantOption {
  label: string;
  price_override?: number;
}

// Müşterinin seçim yapması gereken grup (örn: "Yumurta pişirme").
// multi_select: true → checkbox, false → radio button UI'da.
export interface Variant {
  group: string;
  multi_select: boolean;
  options: (string | VariantOption)[];
}

// İsteğe bağlı ek ürünler. price_delta null ise "fiyat bilinmiyor,
// şefe sor" anlamına gelir — mutfakta bu durum sık olduğu için null
// destekleniyor (data-schema.md kuralı).
export interface Extra {
  name: string;
  price_delta: number | null;
}

// Tek bir yemeğin tüm bilgileri. UI'nın tüm bilgi ihtiyacı buradan
// karşılanır — mutfakta sipariş anında ne içeriyor, ne seçilecek,
// alerjeni var mı, hepsi tek kayıtta.
export interface Dish {
  id: string; // slug, unique — route parametresi (/yemek/[id])
  category_id: string; // Category.id'ye referans
  name: string; // Türkçe ad (mutfak ekibi bu adı kullanır)
  price: number; // TL cinsinden pozitif tam sayı
  currency: 'TL';
  description: string; // 1-3 cümle Türkçe açıklama
  cooking_method: string | null; // "Izgara", "Tavada sote" vb. (bilinmiyorsa null)
  components: Components;
  variants: Variant[]; // müşteri zorunlu seçimleri
  extras: Extra[]; // isteğe bağlı ek ürünler
  allergens: Allergen[];
  diet_flags: DietFlag[];
  photos: string[]; // "photos/xxx-01.webp" dosya yolu
  tags: string[]; // arama için ek anahtar kelimeler (Türkçe + İngilizce)
  chef_notes: string; // şef notu; boş string olabilir
  active: boolean; // false → menüde görünmez (ama store'dan erişilebilir)
}

// Menü üst bilgileri. reserved_fields_for_future Faz 2/3'te eklenecek
// alanların listesidir (kalori, sezon, somelye eşleştirmesi vb.) —
// şimdi belirtilmesi ileride tipleri genişletirken bize hatırlatma olur.
export interface Metadata {
  total_categories: number;
  total_dishes: number;
  allergen_keys: Allergen[];
  diet_flag_keys: DietFlag[];
  reserved_fields_for_future: string[];
}

// En üst seviye yapı. menu.json doğrudan bu tipe cast edilir.
export interface Menu {
  version: string;
  last_updated: string; // ISO tarih: "YYYY-MM-DD"
  source: string;
  language: 'tr';
  categories: Category[];
  dishes: Dish[];
  metadata: Metadata;
}

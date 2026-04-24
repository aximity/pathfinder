/**
 * Veri Erişim Katmanı (Data Access Layer, DAL).
 *
 * NEDEN BU DOSYA: Component'ler menu.json'ı doğrudan import edemez
 * (ADR-0003). Faz 1'de veri JSON'dan geliyor, Faz 2'de aynı imza FastAPI
 * endpoint'ine döndürülecek. Component kodu değişmez, sadece bu dosyanın
 * içi değişir. Tek sabit arayüz = tek geçiş noktası.
 *
 * NE İÇİN KULLANILIR: Yemek listesi, detay, kategori, arama, alerjen ve
 * diet filtreleme — tüm UI veri ihtiyaçları bu 7 async fonksiyondan
 * karşılanır.
 *
 * ASYNC NEDEN: Faz 1'de veri senkron gelse de fonksiyon imzaları
 * Promise döner. Faz 2'de fetch eklenince imza değişmez, çağıran
 * kod aynı kalır.
 *
 * ŞEMA DOĞRULAMA: Yüklenme anında 5 maddelik kontrol (kategori referansı,
 * unique ID, tanımlı alerjen/flag, pozitif fiyat) — uyarılar console'a
 * yazılır, uygulama çökmez (graceful degradation).
 */

import menuData from '$lib/data/menu.json';
import type { Allergen, Category, DietFlag, Dish, Menu } from '$lib/types/menu';

// JSON modülü import edildiğinde TypeScript tipini otomatik çıkarır
// ama bizim şemamıza tam uymayabilir (literal 'TL' vs string gibi).
// Cast ile Menu tipine sabitleriz, şema doğrulaması sonra çalışır.
const data = menuData as unknown as Menu;

// --- Performans indeksleri ---------------------------------------------
// Map tabanlı O(1) erişim. 59 yemek için linear scan da hızlı olurdu,
// ama Faz 2'de yemek sayısı artınca (sezonluk, özel menü) indexleme
// yatırımı karşılığını verir.

const dishById = new Map<string, Dish>();
const dishesByCategory = new Map<string, Dish[]>();
const categoryById = new Map<string, Category>();

for (const category of data.categories) {
  categoryById.set(category.id, category);
  dishesByCategory.set(category.id, []);
}

for (const dish of data.dishes) {
  dishById.set(dish.id, dish);
  const bucket = dishesByCategory.get(dish.category_id);
  if (bucket) {
    bucket.push(dish);
  }
}

// --- Şema doğrulama ----------------------------------------------------
// docs/data-schema.md'de listelenen 5 madde. Hata bulursa console.warn —
// UI'yı çökertmiyoruz, çünkü menü hiç açılmamaktansa bozuk kayıtla
// açılması daha iyi (mutfakta acele).
function validateSchema(menu: Menu): void {
  const warnings: string[] = [];
  const categoryIds = new Set(menu.categories.map((c) => c.id));
  const allergenKeys = new Set<string>(menu.metadata.allergen_keys);
  const dietFlagKeys = new Set<string>(menu.metadata.diet_flag_keys);
  const seenDishIds = new Set<string>();

  for (const dish of menu.dishes) {
    // 1. Unique dish ID
    if (seenDishIds.has(dish.id)) {
      warnings.push(`Yinelenmiş yemek id: ${dish.id}`);
    }
    seenDishIds.add(dish.id);

    // 2. category_id geçerli mi?
    if (!categoryIds.has(dish.category_id)) {
      warnings.push(`Yemek ${dish.id} bilinmeyen kategori kullanıyor: ${dish.category_id}`);
    }

    // 3. Alerjenler metadata listesinde mi?
    for (const allergen of dish.allergens) {
      if (!allergenKeys.has(allergen)) {
        warnings.push(`Yemek ${dish.id} bilinmeyen alerjen içeriyor: ${allergen}`);
      }
    }

    // 4. Diet flag'ler metadata listesinde mi?
    for (const flag of dish.diet_flags) {
      if (!dietFlagKeys.has(flag)) {
        warnings.push(`Yemek ${dish.id} bilinmeyen diet flag içeriyor: ${flag}`);
      }
    }

    // 5. Fiyat pozitif tam sayı mı?
    if (!Number.isInteger(dish.price) || dish.price <= 0) {
      warnings.push(`Yemek ${dish.id} geçersiz fiyat: ${dish.price}`);
    }
  }

  if (warnings.length > 0) {
    console.warn('[menuStore] Şema doğrulama uyarıları:', warnings);
  }
}

validateSchema(data);

// --- Türkçe karakter güvenli arama yardımcısı --------------------------
// toLowerCase() "Şiş" → "şi̇ş" (bozuk nokta) üretir. toLocaleLowerCase('tr')
// doğru sonuç verir: "Şiş" → "şiş". Bu projenin her metin karşılaştırması
// bu fonksiyondan geçmeli (docs/data-schema.md kuralı).
function trLower(value: string): string {
  return value.toLocaleLowerCase('tr');
}

// Arama hedefleri: yemek adı, açıklama, tag'ler, bileşenler (yan/sos/
// garnitür/ana). Tek tek string'leri düzleştirip needle aranır.
function matches(dish: Dish, needle: string): boolean {
  const haystacks: string[] = [
    dish.name,
    dish.description,
    ...dish.tags,
    ...dish.components.sides,
    ...dish.components.sauces,
    ...dish.components.garnishes,
    dish.components.main
  ];
  return haystacks.some((value) => trLower(value).includes(needle));
}

// --- Dışa açılan store ------------------------------------------------
// 7 fonksiyon. İmzalar docs/architecture.md'de kilitlenmiştir, değiştirmek
// Faz 2 uyumluluğunu bozar. Yeni fonksiyon eklenebilir, var olanın imzası
// değişmez.
export const menuStore = {
  // ID ile tek yemek. Bulunmazsa null (UI'da "yemek bulunamadı" sayfası).
  async getById(id: string): Promise<Dish | null> {
    return dishById.get(id) ?? null;
  },

  // Bir kategorinin tüm yemekleri. Dış kod ikinci indeksimizi mutasyona
  // uğratmasın diye kopya döneriz.
  async getByCategory(categoryId: string): Promise<Dish[]> {
    return [...(dishesByCategory.get(categoryId) ?? [])];
  },

  // Kategoriler, order alanına göre sıralı. Ana sayfa grid'i bu sıraya
  // güvenir (Set Kahvaltı → ... → Çocuk Menüsü).
  async getAllCategories(): Promise<Category[]> {
    return [...data.categories].sort((a, b) => a.order - b.order);
  },

  // Tüm yemekler (active:false olanlar dahil). UI katmanı aktif filtresi
  // uygulayabilir; store filtrelemeye karar vermez — karar UI'ya ait.
  async getAllDishes(): Promise<Dish[]> {
    return [...data.dishes];
  },

  // Metin araması. Boş sorguda boş liste (yanlışlıkla tüm menüyü
  // dönmemesi için). Case-insensitive + Türkçe karakter güvenli.
  async search(query: string): Promise<Dish[]> {
    const needle = trLower(query.trim());
    if (needle.length === 0) return [];
    return data.dishes.filter((dish) => matches(dish, needle));
  },

  // "Şu alerjenleri ÇIKAR" mantığı. Verilen liste boşsa tüm yemekler
  // dönər — kullanıcı filtre uygulamamış demektir.
  async filterByAllergens(excluded: Allergen[]): Promise<Dish[]> {
    if (excluded.length === 0) return [...data.dishes];
    const blocked = new Set(excluded);
    return data.dishes.filter((dish) => !dish.allergens.some((a) => blocked.has(a)));
  },

  // "Şu özellikler HEPSİ OLSUN" mantığı (AND). required boşsa tüm
  // yemekler döner. "Vegetaryen VE glutensiz" gibi kombinasyonu destekler.
  async filterByDietFlags(required: DietFlag[]): Promise<Dish[]> {
    if (required.length === 0) return [...data.dishes];
    return data.dishes.filter((dish) =>
      required.every((flag) => dish.diet_flags.includes(flag))
    );
  }
};

// Dışa açılan tip — başka dosyalar store'u prop olarak geçerken
// kullanabilir (test yardımcıları vb.).
export type MenuStore = typeof menuStore;

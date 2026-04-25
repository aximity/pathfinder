/**
 * Kategori → Tailwind utility class eşleşmesi.
 *
 * NEDEN: Tailwind v4 JIT compiler kaynak dosyaları tarayıp kullanılan
 * utility class'larını üretir. Dinamik string concat (`bg-cat-${id}`)
 * tarayıcıdan kaçar — class tree-shake sırasında atılır. Bu yüzden her
 * kategori için literal class adı yazıyoruz; compiler hepsini görür.
 *
 * KULLANIM: CategoryCard ve DishCard component'leri kategori accent
 * şeridini bu map'ten alır. Yeni kategori eklenirse hem `app.css`'teki
 * token hem buradaki map güncellenir (iki yerde de eksik kalmasın diye
 * deliberately yan yana yaşıyorlar).
 */

/**
 * Kategori ID → `bg-cat-*` utility class.
 * Bilinmeyen ID'de gri fallback dön (renk şeridi tamamen kaybolmasın).
 */
export function categoryAccentBg(categoryId: string): string {
  switch (categoryId) {
    case 'set-breakfast':
      return 'bg-cat-set-breakfast';
    case 'a-la-carte-breakfast':
      return 'bg-cat-a-la-carte-breakfast';
    case 'salads-appetizers':
      return 'bg-cat-salads-appetizers';
    case 'soups':
      return 'bg-cat-soups';
    case 'sandwich-burger':
      return 'bg-cat-sandwich-burger';
    case 'pizza':
      return 'bg-cat-pizza';
    case 'pasta':
      return 'bg-cat-pasta';
    case 'seafood':
      return 'bg-cat-seafood';
    case 'meat-chicken':
      return 'bg-cat-meat-chicken';
    case 'dessert':
      return 'bg-cat-dessert';
    case 'kids-menu':
      return 'bg-cat-kids-menu';
    default:
      return 'bg-slate-300 dark:bg-slate-700';
  }
}

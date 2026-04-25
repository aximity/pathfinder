<script lang="ts">
  // Kategori kartı — ana sayfa grid'inde 11 adet görünür.
  //
  // GÖRSEL: Solda kategori accent rengi şerit (4 px), yanında kategori
  // adı (kalın) + altında "X yemek" sayısı. Kart tamamı tıklanır
  // (link), `/kategori/[id]` açar.
  //
  // ERİŞİLEBİLİRLİK: minimum yükseklik 88 px (44'ün iki katı, mutfak
  // eldiveniyle bile rahat dokunma). Anchor element kullanıldığı için
  // klavye navigasyonu ücretsiz.
  //
  // VERİ: Component aptal — Category prop'u alır, hiçbir hesaplama
  // yapmaz (ADR-0003).
  import type { Category } from '$lib/types/menu';
  import { categoryAccentBg } from '$lib/utils/category-colors';

  interface Props {
    category: Category;
    dishCount: number;
  }

  let { category, dishCount }: Props = $props();

  // Sınıf hesaplaması: $derived ile reactive — category değişirse class
  // da değişir.
  const accentClass = $derived(categoryAccentBg(category.id));
</script>

<a
  href="/kategori/{category.id}"
  class="group flex min-h-[88px] items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-info focus-visible:outline-none dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
  aria-label="{category.name} kategorisi — {dishCount} yemek"
>
  <span class="w-1.5 shrink-0 {accentClass}" aria-hidden="true"></span>
  <span class="flex flex-1 flex-col justify-center px-4 py-3">
    <span class="text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">
      {category.name}
    </span>
    <span class="mt-1 text-sm text-slate-500 dark:text-slate-400">
      {dishCount} yemek
    </span>
  </span>
</a>

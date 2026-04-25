<script lang="ts">
  // Ana sayfa — Paket 2.
  //
  // İÇERİK: arama çubuğu placeholder, 11 kategori grid (mobil 2 sütun /
  // tablet 3 sütun), boş "Son baktıkların" bandı.
  //
  // VERİ AKIŞI: ADR-0003 — kategoriler ve yemek sayıları sadece
  // menuStore üzerinden okunur. Her kategori için yemek sayısı bir kez
  // hesaplanıp Map'te tutulur (re-render maliyeti yok).
  //
  // PAKET 1 KORUMASI: menuStore window'a açma davranışı korundu — Ahmet
  // konsoldan store fonksiyonlarını test etmeye devam edebilir.
  import { menuStore } from '$lib/stores/menu';
  import type { Category } from '$lib/types/menu';
  import SearchBar from '$lib/components/SearchBar.svelte';
  import CategoryCard from '$lib/components/CategoryCard.svelte';

  let categories = $state<Category[]>([]);
  let dishCountByCategory = $state<Record<string, number>>({});
  let loaded = $state(false);

  // İlk render sonrası kategorileri ve her kategori için yemek sayısını
  // paralel çek. getByCategory async olduğu için tüm kategorileri tek
  // Promise.all'da topluyoruz.
  $effect(() => {
    (async () => {
      const cats = await menuStore.getAllCategories();
      const counts = await Promise.all(
        cats.map(async (cat) => {
          const dishes = await menuStore.getByCategory(cat.id);
          return [cat.id, dishes.length] as const;
        })
      );
      categories = cats;
      dishCountByCategory = Object.fromEntries(counts);
      loaded = true;
    })();
  });

  // Paket 1'den korunan davranış: konsoldan store testi.
  $effect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { menuStore: typeof menuStore }).menuStore = menuStore;
    }
  });
</script>

<svelte:head>
  <title>Pathfinder</title>
</svelte:head>

<div class="mx-auto max-w-3xl space-y-8 px-4 py-6">
  <!-- Arama placeholder — Paket 3+4'te aktif olur -->
  <section aria-label="Yemek arama">
    <SearchBar />
  </section>

  <!-- Kategori grid -->
  <section aria-labelledby="categories-heading">
    <h2 id="categories-heading" class="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
      Kategoriler
    </h2>
    {#if loaded}
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {#each categories as category (category.id)}
          <CategoryCard {category} dishCount={dishCountByCategory[category.id] ?? 0} />
        {/each}
      </div>
    {:else}
      <p class="text-sm text-slate-400 dark:text-slate-500">Yükleniyor…</p>
    {/if}
  </section>

  <!-- Son baktıkların — Paket 3+4'te dolacak -->
  <section aria-labelledby="recent-heading">
    <h2 id="recent-heading" class="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
      Son baktıkların
    </h2>
    <div
      class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400"
    >
      Yemek detayına baktıkça burada görünecek.
    </div>
  </section>
</div>

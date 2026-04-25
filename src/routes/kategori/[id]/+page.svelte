<script lang="ts">
  // Kategori sayfası — bir kategorideki tüm yemekleri listeler.
  //
  // ROUTE: /kategori/[id]   (örn: /kategori/pizza)
  //
  // VERİ AKIŞI: ADR-0003 — kategori bilgisi ve yemekler menuStore
  // üzerinden alınır. params.id'yi reactive olarak okuyup ID değişirse
  // (client-side navigation) içerik yenilenir.
  //
  // HATA DURUMU: Geçersiz kategori ID'sinde error() ile 404 atılır
  // (graceful 404 — `+error.svelte` veya SvelteKit varsayılanı).
  // Yemek listesi boşsa kullanıcıya bilgi mesajı gösterilir.
  import { page } from '$app/state';
  import { error } from '@sveltejs/kit';
  import { menuStore } from '$lib/stores/menu';
  import type { Category, Dish } from '$lib/types/menu';
  import DishCard from '$lib/components/DishCard.svelte';
  import { categoryAccentBg } from '$lib/utils/category-colors';

  // params.id reactive — Svelte 5'te `page.params` zaten reactive.
  // SvelteKit tipi `string | undefined` döner (tüm dinamik segmentler için);
  // boş string'e düşersek menuStore.getByCategory boş dizi döner ve aşağıda
  // find başarısız olup 404 atılır — tip uyumu + doğru davranış.
  const categoryId = $derived(page.params.id ?? '');
  const accentClass = $derived(categoryAccentBg(categoryId));

  let category = $state<Category | null>(null);
  let dishes = $state<Dish[]>([]);
  let loaded = $state(false);

  $effect(() => {
    // categoryId değişiminde state'i sıfırlayıp yeniden yükle.
    loaded = false;
    const id = categoryId;
    (async () => {
      const cats = await menuStore.getAllCategories();
      const cat = cats.find((c) => c.id === id);
      if (!cat) {
        // Geçersiz kategori → 404. SvelteKit varsayılan error sayfası
        // gösterilir; ileride özel +error.svelte eklenebilir.
        throw error(404, 'Kategori bulunamadı');
      }
      const list = await menuStore.getByCategory(id);
      category = cat;
      dishes = list;
      loaded = true;
    })();
  });

  function goBack(): void {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      // Geçmiş yoksa ana sayfaya dön (deep link senaryosu).
      window.location.href = '/';
    }
  }
</script>

<svelte:head>
  <title>{category ? `${category.name} · Pathfinder` : 'Pathfinder'}</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-6">
  <!-- Geri butonu -->
  <button
    type="button"
    onclick={goBack}
    class="mb-4 inline-flex h-11 items-center gap-2 rounded-lg px-3 text-sm text-slate-600 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-info focus-visible:outline-none dark:text-slate-300 dark:hover:bg-slate-800"
    aria-label="Önceki sayfaya dön"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-5 w-5"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
    Geri
  </button>

  {#if loaded && category}
    <!-- Başlık + yemek sayısı + accent şeridi -->
    <header class="mb-6 flex items-center gap-3">
      <span class="h-10 w-1.5 shrink-0 rounded-full {accentClass}" aria-hidden="true"></span>
      <div>
        <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
          {category.name}
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {dishes.length} yemek
        </p>
      </div>
    </header>

    <!-- Yemek listesi -->
    {#if dishes.length > 0}
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {#each dishes as dish (dish.id)}
          <DishCard {dish} />
        {/each}
      </div>
    {:else}
      <p
        class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400"
      >
        Bu kategoride yemek yok.
      </p>
    {/if}
  {:else}
    <p class="text-sm text-slate-400 dark:text-slate-500">Yükleniyor…</p>
  {/if}
</div>

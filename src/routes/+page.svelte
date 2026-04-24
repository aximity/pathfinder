<script lang="ts">
  // Ana sayfa — Paket 1 doğrulama yüzeyi.
  //
  // NEDEN BU SAYFA: Kabul kriterleri "59 yemek · 11 kategori" sayısının
  // store'dan dinamik gelmesini ve browser console'dan menuStore'un
  // çağrılabilmesini gerektirir. Görsel iskelet Paket 2'de (kategori grid,
  // tema toggle vb.) yazılacak — burada sadece store bağlantısı doğrulanıyor.
  //
  // NEREDE: /  (root)
  import { menuStore } from '$lib/stores/menu';
  import type { Category, Dish } from '$lib/types/menu';

  // Reactive state — $state rune'u Svelte 5'te reaktif değişken yaratır.
  let categoryCount = $state(0);
  let dishCount = $state(0);
  let categories = $state<Category[]>([]);
  let sampleDish = $state<Dish | null>(null);
  let loaded = $state(false);

  // Store çağrısı ilk render sonrası. $effect → side effect bölgesi
  // (DOM, fetch, async). Promise.all ile paralel çağrı yapıyoruz —
  // üç veri üçü birden bekler, seri çağırmaktan hızlı.
  $effect(() => {
    (async () => {
      const [cats, dishes, palazzo] = await Promise.all([
        menuStore.getAllCategories(),
        menuStore.getAllDishes(),
        menuStore.getById('palazzo-breakfast')
      ]);
      categories = cats;
      categoryCount = cats.length;
      dishCount = dishes.length;
      sampleDish = palazzo;
      loaded = true;
    })();
  });

  // Browser console testi için menuStore'u global olarak aç. Prod'da
  // da açık kalıyor; güvenlik riski yok çünkü store sadece okuma yapıyor.
  // Kabul kriteri #6: console'da menuStore.getById('palazzo-breakfast')
  // çağrılabilir olmalı.
  $effect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { menuStore: typeof menuStore }).menuStore = menuStore;
    }
  });
</script>

<svelte:head>
  <title>Pathfinder</title>
</svelte:head>

<main class="min-h-screen bg-neutral-50 p-6 text-neutral-900">
  <div class="mx-auto max-w-2xl space-y-6">
    <header class="space-y-2">
      <h1 class="text-4xl font-bold">Pathfinder</h1>
      <p class="text-lg text-neutral-600">Mutfak-öncelikli dijital menü referansı</p>
    </header>

    <!-- Sayılar store'dan dinamik geliyor (kabul kriteri #4). -->
    <section class="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      {#if loaded}
        <p class="text-2xl font-semibold" data-testid="summary">
          {dishCount} yemek · {categoryCount} kategori
        </p>
      {:else}
        <p class="text-2xl font-semibold text-neutral-400">Yükleniyor…</p>
      {/if}
    </section>

    <!-- Kategori listesi — order'a göre sıralı, accent_color ile görsel ipucu. -->
    <section class="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 class="mb-3 text-lg font-semibold">Kategoriler</h2>
      {#if categories.length > 0}
        <ul class="space-y-1 text-sm text-neutral-700">
          {#each categories as category (category.id)}
            <li class="flex items-center gap-2">
              <span
                class="inline-block h-3 w-3 rounded-full"
                style="background-color: {category.accent_color}"
                aria-hidden="true"
              ></span>
              <span>{category.order}. {category.name}</span>
              <span class="text-neutral-400">({category.id})</span>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-neutral-400">Yükleniyor…</p>
      {/if}
    </section>

    <!-- Store console testi için rehber + palazzo-breakfast doğrulaması. -->
    <section class="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 class="mb-3 text-lg font-semibold">Store doğrulaması</h2>
      <p class="text-sm text-neutral-600">
        Tarayıcı konsolunda <code class="rounded bg-neutral-100 px-1">menuStore</code> global olarak
        erişilebilir. Örnek:
      </p>
      <pre
        class="mt-2 overflow-x-auto rounded bg-neutral-900 p-3 text-xs text-neutral-100"><code
          >await menuStore.getById('palazzo-breakfast')
await menuStore.search('karides')
await menuStore.filterByAllergens(['dairy'])</code
        ></pre>
      {#if sampleDish}
        <p class="mt-3 text-sm">
          <span class="font-semibold">getById('palazzo-breakfast'):</span>
          {sampleDish.name} — {sampleDish.price} {sampleDish.currency}
        </p>
      {:else if loaded}
        <p class="mt-3 text-sm text-red-600">Hata: palazzo-breakfast kaydı bulunamadı.</p>
      {/if}
    </section>

    <footer class="pt-4 text-center text-xs text-neutral-400">
      Paket 1 — Temel ve Data Access Layer
    </footer>
  </div>
</main>

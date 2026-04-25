<script lang="ts">
  // Ortak layout — tüm sayfaların etrafına sarılır.
  //
  // İÇERİK: app.css (Tailwind + tema token'ları), Header (sticky), main
  // slot, basit footer. Body styling'i burada wrapper div'e Tailwind
  // utility olarak veriyoruz (ADR-0007 @apply yasağı).
  //
  // TEMA: app.html'deki inline script ilk render'da <html>'e `dark`
  // class'ı ekler — bu wrapper'daki `dark:` utility'leri o class'a
  // bağlanır, FOUC olmaz.
  import '../app.css';
  import Header from '$lib/components/Header.svelte';

  // Svelte 5 runes: çocuk sayfalar children prop ile render edilir.
  let { children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
  <Header />
  <main class="flex-1">
    {@render children()}
  </main>
  <footer
    class="border-t border-slate-200 px-4 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500"
  >
    Aximity · Pathfinder
  </footer>
</div>

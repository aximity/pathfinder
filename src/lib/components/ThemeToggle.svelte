<script lang="ts">
  // Tema toggle — light/dark arası geçiş.
  //
  // NEDEN: Header'da yer alır, tek tuşa basınca tema değişir. İkon
  // mevcut temayı değil, "tıklarsan ne olacak"ı gösterir — yani şu an
  // dark ise güneş, light ise ay görünür (bu standart UX deseni).
  //
  // ERİŞİLEBİLİRLİK: Buton 44×44 px, aria-label tema durumuna göre
  // dinamik. Klavye ile odaklanılabilir, Enter/Space ile çalışır.
  //
  // VERİ AKIŞI: ADR-0003 — themeStore üzerinden okur/yazar, doğrudan
  // localStorage veya documentElement'e dokunmaz.
  import { themeStore } from '$lib/stores/theme.svelte';

  // $derived ile reactive: theme değişince ikon ve label kendiliğinden
  // güncellenir.
  const isDark = $derived(themeStore.current === 'dark');
  const label = $derived(isDark ? 'Açık temaya geç' : 'Koyu temaya geç');
</script>

<button
  type="button"
  onclick={() => themeStore.toggle()}
  aria-label={label}
  title={label}
  class="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-info focus-visible:outline-none dark:text-slate-200 dark:hover:bg-slate-800"
>
  {#if isDark}
    <!-- Güneş ikonu — şu an dark, tıklayınca light olur -->
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  {:else}
    <!-- Ay ikonu — şu an light, tıklayınca dark olur -->
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
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  {/if}
</button>

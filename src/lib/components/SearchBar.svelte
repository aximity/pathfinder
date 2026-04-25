<script lang="ts">
  // Arama çubuğu — Paket 2'de UI placeholder.
  //
  // NEDEN: Görsel iskelet kullanıcıya "burada arama olacak" sinyalini
  // verir. Gerçek arama mantığı Paket 3+4'te `menuStore.search()` ile
  // bağlanacak. Şimdilik input disabled — yanıltıcı bir his vermesin.
  //
  // ERİŞİLEBİLİRLİK: label görsel olarak gizli ama screen reader okur,
  // input gerçek <input type="search"> — keyboard kullanıcısına doğal.
</script>

<div class="relative w-full">
  <label for="search-input" class="sr-only">Yemek ara</label>
  <span
    class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-slate-500"
    aria-hidden="true"
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
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  </span>
  <input
    id="search-input"
    type="search"
    placeholder="Yemek ara… (yakında)"
    disabled
    aria-disabled="true"
    class="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-10 text-base text-slate-700 placeholder:text-slate-400 focus:border-info focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
  />
</div>

<script lang="ts">
  // Üst başlık — sticky, tüm sayfalarda görünür.
  //
  // NEDEN: Tutarlı navigation noktası — kullanıcı ana sayfaya
  // dönmek için "Pathfinder" logosuna tıklar, tema toggle her sayfadan
  // erişilebilir. Sticky tutuyoruz çünkü mutfakta tek elle telefonu
  // tutarken kaydırma sırasında üst kısma uzanmak yerine direkt
  // header'dan dokunmak hızlı.
  //
  // İÇERİK: solda "Pathfinder" logosu (h1, ana sayfa linki), sağda
  // arama ikonu (Paket 3+4'te aktif olur, şu an disabled görünüm) +
  // tema toggle.
  //
  // ERİŞİLEBİLİRLİK: <header> semantic, link ve butonlar 44×44 px.
  import ThemeToggle from './ThemeToggle.svelte';

  // Search ikonu disabled görünüm + click feedback olarak Türkçe alert
  // veriyoruz — Ahmet onayı: "yakında" mesajı.
  function notifySearchSoon(): void {
    if (typeof window !== 'undefined') {
      // Toast yerine alert — Paket 2 scope, basit. Paket 3+4'te kaldırılacak.
      window.alert('Arama özelliği yakında aktif olacak.');
    }
  }
</script>

<header
  class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90"
>
  <div class="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:h-16">
    <a
      href="/"
      class="inline-flex h-11 items-center gap-2 rounded-lg px-2 text-lg font-bold tracking-tight text-slate-900 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-info focus-visible:outline-none sm:text-xl dark:text-slate-100 dark:hover:bg-slate-800"
      aria-label="Ana sayfaya dön"
    >
      Pathfinder
    </a>

    <div class="flex items-center gap-1">
      <button
        type="button"
        onclick={notifySearchSoon}
        aria-label="Arama (yakında)"
        title="Arama yakında"
        class="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-info focus-visible:outline-none dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
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
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
      <ThemeToggle />
    </div>
  </div>
</header>

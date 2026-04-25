<script lang="ts">
  // Yemek kartı — kategori sayfasında dikey listede görünür.
  //
  // GÖRSEL: Solda 96×96 foto placeholder (gri SVG ikon — fotoğraflar
  // Paket 3+4'te), yanında yemek adı (1 satır truncate), açıklama
  // (2 satır truncate), altında fiyat. Tüm kart tıklanır.
  //
  // PAKET 2 DAVRANIŞI: Yemek detay sayfası Paket 3+4'te yazılacak; şu an
  // tıklayınca Türkçe alert: "Yemek detayı yakında" (Ahmet onayı). Paket
  // 3+4'te bu component <a href="/yemek/{id}"> olarak değişir.
  //
  // ERİŞİLEBİLİRLİK: Tüm kart 44 px'den büyük (96 + padding ≈ 112 px),
  // button semantic, klavye navigation çalışır. truncate sınıfları
  // overflow gizler ama screen reader tam metni okur.
  //
  // VERİ: Component aptal — Dish prop'u alır, hiçbir filtre/hesap yok.
  import type { Dish } from '$lib/types/menu';

  interface Props {
    dish: Dish;
  }

  let { dish }: Props = $props();

  function notifyDetailSoon(): void {
    if (typeof window !== 'undefined') {
      window.alert('Yemek detayı yakında aktif olacak.');
    }
  }
</script>

<button
  type="button"
  onclick={notifyDetailSoon}
  aria-label="{dish.name} — {dish.price} {dish.currency}"
  class="flex w-full items-stretch gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all hover:border-slate-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-info focus-visible:outline-none dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
>
  <!-- Foto placeholder — Paket 3+4'te gerçek <img> gelecek -->
  <span
    class="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-300 dark:bg-slate-700 dark:text-slate-500"
    aria-hidden="true"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-10 w-10"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  </span>

  <span class="flex min-w-0 flex-1 flex-col justify-center">
    <span class="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
      {dish.name}
    </span>
    <span class="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
      {dish.description}
    </span>
    <span class="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
      {dish.price} {dish.currency}
    </span>
  </span>
</button>

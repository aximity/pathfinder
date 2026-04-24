<script lang="ts">
  // Ortak layout.
  //
  // NEDEN BU DOSYA: SvelteKit'te +layout.svelte tüm sayfaların etrafına
  // sarılır. Paket 1'de sadece app.css'i import ediyoruz ki Tailwind
  // utility'leri tüm sayfalarda geçerli olsun.
  //
  // GELECEK: Paket 2'de bu dosyaya Header, ThemeToggle, Footer
  // component'leri eklenecek. Şu anda minimum tutuyoruz (scope dışı iş yok).
  import '../app.css';

  // Svelte 5 runes: çocuk sayfalar bu prop ile render edilir.
  let { children } = $props();
</script>

{@render children()}

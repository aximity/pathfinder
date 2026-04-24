// Static site build ayarları.
//
// prerender = true → build anında HTML üretilir; GitHub Pages'te statik
// dosya olarak servis edilir. Faz 1'de backend yok, tüm sayfalar build
// anında sabittir.
//
// ssr = true → ilk HTML sunucuda (build aşamasında) render edilir, ilk
// yüklemede içerik hemen görünür. Sonraki navigation'lar client-side.
//
// trailingSlash = 'never' → /kategori/meat-chicken (sonda / yok). GitHub
// Pages ve tarayıcılar için tutarlı URL şekli.
export const prerender = true;
export const ssr = true;
export const trailingSlash = 'never';

// Static prerender giriş noktaları.
//
// NEDEN: adapter-static dinamik route'ları (`[id]`) bilemez; build
// anında hangi ID'ler için HTML üretileceğini açıkça söylemek gerekir.
// 11 kategorinin her biri için /kategori/<id>/index.html üretilir.
//
// VERİ KAYNAĞI: menuStore.getAllCategories() — ADR-0003. Kategori
// listesi nereden gelirse gelsin (Faz 2'de API), build job aynı sözleşmeyi
// kullanır. Tek istisna: build ortamında menuStore JSON'dan okur.
import { menuStore } from '$lib/stores/menu';

export const prerender = true;

export async function entries(): Promise<Array<{ id: string }>> {
  const categories = await menuStore.getAllCategories();
  return categories.map((category) => ({ id: category.id }));
}

/**
 * Tema state'i — light/dark toggle.
 *
 * NEDEN: Kullanıcı sistem temasından farklı bir tercih belirleyebilir.
 * İlk yüklemede sistem tercihi izlenir; kullanıcı toggle'a basınca seçim
 * `pf:theme` localStorage anahtarına yazılır ve sonraki ziyaretlerde
 * sistem değişse bile o seçim kalır (Ahmet onayı: iki durumlu, system
 * üçüncü seçenek değil — sadece varsayılan).
 *
 * HTML SINIFI: FOUC önlemek için ilk class atama `app.html` içindeki
 * inline script'te yapılır (sayfa boyanmadan önce). Bu store kullanıcı
 * etkileşiminden sonra class'ı senkron tutar.
 *
 * PRENSİP: ADR-0003 — component'ler bu store üzerinden tema okur,
 * doğrudan localStorage veya document.documentElement'e dokunmaz.
 */

import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'pf:theme';

/**
 * Sistem tercihini oku. SSR'da window yok — light fallback.
 */
function readSystemPreference(): Theme {
  if (!browser) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * localStorage'dan kayıtlı tercihi oku. Yoksa veya geçersizse null.
 */
function readStoredPreference(): Theme | null {
  if (!browser) return null;
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

/**
 * Şu anki efektif temayı dön. Kayıtlı varsa onu, yoksa sistemden.
 * SSR'da light (HTML inline script client'ta gerçek değeri set eder).
 */
function getInitialTheme(): Theme {
  return readStoredPreference() ?? readSystemPreference();
}

/**
 * Svelte 5 runes ile reactive tema. $state class içinde tanımlanıp
 * dışa export edilir — component'lerde `themeStore.current` ile okunur,
 * `themeStore.toggle()` ile değiştirilir.
 */
class ThemeStore {
  current = $state<Theme>(getInitialTheme());

  /**
   * Tema değiştir (light ↔ dark). HTML class'ını senkronla,
   * tercihi localStorage'a yaz.
   */
  toggle(): void {
    const next: Theme = this.current === 'dark' ? 'light' : 'dark';
    this.set(next);
  }

  /**
   * Belirli bir temaya geçir. Toggle'dan farklı olarak doğrudan değer alır.
   * Faz 2'de "system" üçüncü seçeneği eklenirse bu metod genişletilebilir.
   */
  set(theme: Theme): void {
    this.current = theme;
    if (!browser) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Private mode vb. — sessizce yok say, in-memory state korunur
    }
  }
}

export const themeStore = new ThemeStore();

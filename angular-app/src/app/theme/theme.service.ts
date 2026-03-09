import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal(true)

  constructor() {
    // Default to dark mode (trading platform convention)
    document.documentElement.classList.add('dark-mode')
    document.documentElement.dataset['agThemeMode'] = 'dark'
  }

  toggleTheme(): void {
    this.isDark.update(v => !v)
    document.documentElement.classList.toggle('dark-mode', this.isDark())
    document.documentElement.dataset['agThemeMode'] = this.isDark() ? 'dark' : 'light'
  }
}

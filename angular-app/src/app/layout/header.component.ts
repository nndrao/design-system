import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ThemeService } from '../theme/theme.service'
import { Button } from 'primeng/button'

export type AppTab = 'Dashboard' | 'Components'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, Button],
  template: `
    <header class="ds-header">
      <div class="ds-header-left">
        <div class="ds-logo">
          <!-- MarketsUI icon: blue rounded square with line chart -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="#1652f0"/>
            <polyline points="4,16 8,11 12,13 16,7 20,9" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
          <span>MarketsUI</span>
        </div>
        <nav class="ds-nav">
          @for (tab of tabLabels; track tab) {
            <button
              class="ds-nav-tab"
              [class.ds-nav-active]="activeTab === tab"
              (click)="tabChange.emit(tab)"
            >
              @if (tab === 'Components') {
                <i class="pi pi-palette" style="font-size:0.65rem;margin-right:3px"></i>
              }
              {{ tab }}
            </button>
          }
        </nav>
      </div>
      <div class="ds-header-right">
        <div class="ds-search-trigger">
          <i class="pi pi-search"></i>
          <span>Search...</span>
          <kbd>⌘K</kbd>
        </div>
        <p-button
          [icon]="themeService.isDark() ? 'pi pi-sun' : 'pi pi-moon'"
          [text]="true"
          [rounded]="true"
          size="small"
          (onClick)="themeService.toggleTheme()"
        />
      </div>
    </header>
  `,
  styles: [`
    .ds-header {
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid var(--ds-border);
      background: var(--ds-card);
      padding: 0 1rem; height: 2.75rem; flex-shrink: 0;
    }
    .ds-header-left { display: flex; align-items: center; gap: 1rem; }
    .ds-logo {
      display: flex; align-items: center; gap: 0.5rem;
      font-weight: 700; font-size: 0.875rem; color: var(--ds-foreground);
      letter-spacing: -0.02em;
    }
    .ds-nav { display: flex; align-items: center; }
    .ds-nav-tab {
      padding: 0.5rem 0.75rem; font-size: 0.75rem; font-weight: 500;
      background: none; border: none; border-bottom: 2px solid transparent;
      color: var(--ds-muted-foreground); cursor: pointer;
      transition: color 0.15s, border-color 0.15s;
      display: flex; align-items: center; gap: 0.25rem;
      height: 2.75rem;
    }
    .ds-nav-tab:hover { color: var(--ds-foreground); }
    .ds-nav-active { color: var(--ds-foreground); border-bottom-color: var(--ds-primary); }
    .ds-header-right { display: flex; align-items: center; gap: 0.5rem; }
    .ds-search-trigger {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.25rem 0.75rem; border-radius: 4px;
      background: var(--ds-secondary); color: var(--ds-muted-foreground);
      font-size: 0.75rem; cursor: pointer;
    }
    .ds-search-trigger:hover { color: var(--ds-foreground); }
    .ds-search-trigger kbd {
      font-size: 0.625rem; background: var(--ds-accent);
      padding: 0 0.25rem; border-radius: 2px;
    }
  `],
})
export class HeaderComponent {
  @Input() activeTab: AppTab = 'Dashboard'
  @Output() tabChange = new EventEmitter<AppTab>()
  tabLabels: AppTab[] = ['Dashboard', 'Components']
  constructor(public themeService: ThemeService) {}
}

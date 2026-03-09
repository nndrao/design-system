import { Component, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HeaderComponent, AppTab } from './layout/header.component'
import { FITradingAppComponent } from './trading/fi/fi-trading-app.component'
import { ComponentShowcaseComponent } from './showcase/component-showcase.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FITradingAppComponent, ComponentShowcaseComponent],
  template: `
    <div class="ds-app-shell">
      <app-header [activeTab]="activeTab()" (tabChange)="activeTab.set($event)" />
      @if (activeTab() === 'Dashboard') {
        <app-fi-trading-app class="ds-content" />
      } @else {
        <app-component-showcase class="ds-content" />
      }
    </div>
  `,
  styles: [`
    .ds-app-shell { height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    .ds-content { flex: 1; overflow: hidden; min-height: 0; display: flex; flex-direction: column; }
  `],
})
export class App {
  activeTab = signal<AppTab>('Dashboard')
}

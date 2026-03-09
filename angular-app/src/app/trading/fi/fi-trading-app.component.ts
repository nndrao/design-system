import {
  Component,
  ElementRef,
  ViewEncapsulation,
  AfterViewInit,
  OnDestroy,
  EnvironmentInjector,
  ApplicationRef,
  ComponentRef,
  createComponent as ngCreateComponent,
  effect,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { createDockview, type DockviewApi, themeLight, themeDark } from 'dockview-core'
import { ThemeService } from '../../theme/theme.service'
import { MarketStatusBarComponent } from './market-status-bar.component'
import { DashboardPanelComponent } from './panels/dashboard-panel.component'
import { RatesPanelComponent } from './panels/rates-panel.component'
import { CreditPanelComponent } from './panels/credit-panel.component'
import { FuturesPanelComponent } from './panels/futures-panel.component'
import { BlotterPanelComponent } from './panels/blotter-panel.component'
import { PositionsPanelComponent } from './panels/positions-panel.component'
import { RiskPanelComponent } from './panels/risk-panel.component'

const PANEL_COMPONENTS: Record<string, any> = {
  overview:   DashboardPanelComponent,
  rates:      RatesPanelComponent,
  credit:     CreditPanelComponent,
  futures:    FuturesPanelComponent,
  blotter:    BlotterPanelComponent,
  positions:  PositionsPanelComponent,
  risk:       RiskPanelComponent,
}

const PANELS = [
  { id: 'overview',  component: 'overview',  title: 'Overview'       },
  { id: 'rates',     component: 'rates',     title: 'Rates'          },
  { id: 'credit',    component: 'credit',    title: 'Credit'         },
  { id: 'futures',   component: 'futures',   title: 'Futures'        },
  { id: 'blotter',   component: 'blotter',   title: 'Order Blotter'  },
  { id: 'positions', component: 'positions', title: 'Positions & P&L'},
  { id: 'risk',      component: 'risk',      title: 'Risk'           },
]

@Component({
  selector: 'app-fi-trading-app',
  standalone: true,
  imports: [CommonModule, MarketStatusBarComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="fi-app">
      <app-market-status-bar />
      <div class="fi-dockview" #dockContainer></div>
    </div>
  `,
  styles: [`
    app-fi-trading-app { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
    .fi-app { display: flex; flex-direction: column; height: 100%; overflow: hidden; background: var(--ds-background); }
    .fi-dockview { flex: 1; overflow: hidden; min-height: 0; }
  `],
})
export class FITradingAppComponent implements AfterViewInit, OnDestroy {
  private api: DockviewApi | null = null
  private componentRefs: ComponentRef<any>[] = []
  private dockContainer: HTMLElement | null = null

  constructor(
    private el: ElementRef<HTMLElement>,
    private envInjector: EnvironmentInjector,
    private appRef: ApplicationRef,
    private themeService: ThemeService,
  ) {
    effect(() => {
      const isDark = this.themeService.isDark()
      // Update dockview theme
      if (this.api) {
        this.api.updateOptions({ theme: isDark ? themeDark : themeLight })
      }
      // Update AG Grid theme
      document.documentElement.dataset['agThemeMode'] = isDark ? 'dark' : 'light'
    })
  }

  ngAfterViewInit() {
    const container = this.el.nativeElement.querySelector('.fi-dockview') as HTMLElement
    if (!container) return
    this.dockContainer = container
    const self = this

    this.api = createDockview(container, {
      theme: this.themeService.isDark() ? themeDark : themeLight,
      createComponent(options) {
        const CompClass = PANEL_COMPONENTS[options.name]
        if (!CompClass) throw new Error(`Unknown panel: ${options.name}`)

        const hostEl = document.createElement('div')
        hostEl.style.height = '100%'
        hostEl.style.width = '100%'

        return {
          element: hostEl,
          init() {
            const compRef = ngCreateComponent(CompClass, {
              hostElement: hostEl,
              environmentInjector: self.envInjector,
            })
            self.appRef.attachView(compRef.hostView)
            self.componentRefs.push(compRef)
          },
        }
      },
    })

    // Add all panels to a single tabbed group
    const first = this.api.addPanel({
      id: PANELS[0].id,
      component: PANELS[0].component,
      title: PANELS[0].title,
    })

    for (let i = 1; i < PANELS.length; i++) {
      this.api.addPanel({
        id: PANELS[i].id,
        component: PANELS[i].component,
        title: PANELS[i].title,
        position: { referencePanel: PANELS[0].id, direction: 'within' },
      })
    }

    // Activate Overview tab
    first.api.setActive()

    // Set initial AG Grid theme mode
    document.documentElement.dataset['agThemeMode'] = this.themeService.isDark() ? 'dark' : 'light'
  }

  ngOnDestroy() {
    this.componentRefs.forEach(ref => ref.destroy())
    this.api?.dispose()
  }
}

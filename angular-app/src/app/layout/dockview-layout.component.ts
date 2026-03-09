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
} from '@angular/core';
import { createDockview, type DockviewApi, themeLight, themeDark } from 'dockview-core';
import { ThemeService } from '../theme/theme.service';
import { ChartPanelComponent } from '../trading/chart-panel.component';
import { WatchlistComponent } from '../trading/watchlist.component';
import { OrderEntryComponent } from '../trading/order-entry.component';
import { OrderBookComponent } from '../trading/order-book.component';
import { PositionsTableComponent } from '../trading/positions-table.component';

const PANEL_COMPONENTS: Record<string, any> = {
  chart: ChartPanelComponent,
  watchlist: WatchlistComponent,
  orderEntry: OrderEntryComponent,
  orderBook: OrderBookComponent,
  positions: PositionsTableComponent,
};

@Component({
  selector: 'app-dockview-layout',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: ``,
  styles: [`
    app-dockview-layout {
      display: block;
      width: 100%;
      height: 100%;
    }
  `],
})
export class DockviewLayoutComponent implements AfterViewInit, OnDestroy {
  private api: DockviewApi | null = null;
  private componentRefs: ComponentRef<any>[] = [];

  constructor(
    private el: ElementRef<HTMLElement>,
    private envInjector: EnvironmentInjector,
    private appRef: ApplicationRef,
    private themeService: ThemeService,
  ) {
    effect(() => {
      const isDark = this.themeService.isDark();
      if (this.api) {
        this.api.updateOptions({
          theme: isDark ? themeDark : themeLight,
        });
      }
    });
  }

  ngAfterViewInit() {
    const container = this.el.nativeElement;
    const self = this;

    this.api = createDockview(container, {
      theme: this.themeService.isDark() ? themeDark : themeLight,
      createComponent(options) {
        const CompClass = PANEL_COMPONENTS[options.name];
        if (!CompClass) {
          throw new Error(`Unknown panel component: ${options.name}`);
        }

        const hostEl = document.createElement('div');
        hostEl.style.height = '100%';
        hostEl.style.width = '100%';

        return {
          element: hostEl,
          init() {
            const compRef = ngCreateComponent(CompClass, {
              hostElement: hostEl,
              environmentInjector: self.envInjector,
            });
            self.appRef.attachView(compRef.hostView);
            self.componentRefs.push(compRef);
          },
        };
      },
    });

    // Build layout
    const chartPanel = this.api.addPanel({
      id: 'chart',
      component: 'chart',
      title: 'Chart',
    });

    this.api.addPanel({
      id: 'watchlist',
      component: 'watchlist',
      title: 'Watchlist',
      position: { referencePanel: chartPanel, direction: 'below' },
    });

    const orderEntryPanel = this.api.addPanel({
      id: 'orderEntry',
      component: 'orderEntry',
      title: 'Order Entry',
      position: { referencePanel: chartPanel, direction: 'right' },
    });

    this.api.addPanel({
      id: 'orderBook',
      component: 'orderBook',
      title: 'Order Book',
      position: { referencePanel: orderEntryPanel, direction: 'below' },
    });

    this.api.addPanel({
      id: 'positions',
      component: 'positions',
      title: 'Positions',
      position: { direction: 'below' },
    });

    // Set proportions
    chartPanel.api.setSize({ width: 700 });
    this.api.getPanel('positions')!.api.setSize({ height: 220 });
  }

  ngOnDestroy() {
    this.componentRefs.forEach(ref => ref.destroy());
    this.api?.dispose();
  }
}

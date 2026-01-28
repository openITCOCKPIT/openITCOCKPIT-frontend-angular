import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, InputSignal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CardComponent, NavComponent, NavItemComponent } from '@coreui/angular';
import { BrowserWindowsUpdatesComponent } from './browser-windows-updates/browser-windows-updates.component';
import { BrowserWindowsAppsComponent } from './browser-windows-apps/browser-windows-apps.component';


@Component({
    selector: 'oitc-browser-software-windows',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        BrowserWindowsUpdatesComponent,
        BrowserWindowsAppsComponent,
        BrowserWindowsAppsComponent,
        CardComponent
    ],
    templateUrl: './browser-software-windows.component.html',
    styleUrl: './browser-software-windows.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowserSoftwareWindowsComponent {
    public hostId: InputSignal<number> = input<number>(0);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    public activeTab: 'updates' | 'apps' = 'updates';

    public changeTab(tab: 'updates' | 'apps') {
        this.activeTab = tab;
        this.cdr.markForCheck();
    }

}

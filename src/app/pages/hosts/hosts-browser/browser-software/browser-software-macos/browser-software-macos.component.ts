import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, InputSignal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NavComponent, NavItemComponent } from '@coreui/angular';
import { BrowserMacosUpdatesComponent } from './browser-macos-updates/browser-macos-updates.component';
import { BrowserMacosAppsComponent } from './browser-macos-apps/browser-macos-apps.component';


@Component({
    selector: 'oitc-browser-software-macos',
    imports: [
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        TranslocoDirective,
        BrowserMacosUpdatesComponent,
        BrowserMacosAppsComponent
    ],
    templateUrl: './browser-software-macos.component.html',
    styleUrl: './browser-software-macos.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowserSoftwareMacosComponent {
    public hostId: InputSignal<number> = input<number>(0);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    public activeTab: 'updates' | 'apps' = 'updates';

    public changeTab(tab: 'updates' | 'apps') {
        this.activeTab = tab;
        this.cdr.markForCheck();
    }
}

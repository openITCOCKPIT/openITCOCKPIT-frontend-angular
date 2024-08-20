import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {
    BadgeComponent,
    ColComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    RowComponent,
    TooltipDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';
import { HostsService } from '../hosts.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { HostBrowserMenu } from '../hosts.interface';
import { NgClass, NgIf, TitleCasePipe } from '@angular/common';
import { CopyToClipboardComponent } from '../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';
import { SkeletonModule } from 'primeng/skeleton';
import { PermissionsService } from '../../../permissions/permissions.service';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { HoststatusIconComponent } from '../hoststatus-icon/hoststatus-icon.component';
import {
    BrowserMenuLoaderComponent
} from '../../../layouts/primeng/loading/browser-menu-loader/browser-menu-loader.component';


export interface HostBrowserMenuConfig {
    hostId: number,
    showReschedulingButton?: boolean,
    rescheduleCallback?: () => void,
    showBackButton?: boolean
}

@Component({
    selector: 'oitc-hosts-browser-menu',
    standalone: true,
    imports: [
        ColComponent,
        RowComponent,
        FaIconComponent,
        NgIf,
        NgClass,
        CopyToClipboardComponent,
        TranslocoDirective,
        SkeletonModule,
        XsButtonDirective,
        RouterLink,
        TooltipDirective,
        TranslocoPipe,
        BadgeComponent,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        PermissionDirective,
        TitleCasePipe,
        HoststatusIconComponent,
        BrowserMenuLoaderComponent
    ],
    templateUrl: './hosts-browser-menu.component.html',
    styleUrl: './hosts-browser-menu.component.css'
})
export class HostsBrowserMenuComponent implements OnInit, OnDestroy, OnChanges {

    @Input() config!: HostBrowserMenuConfig;
    @Input() lastUpdated?: Date; // Change the date to trigger an update from an external component

    public data?: HostBrowserMenu;
    public hostStatusTextClass: string = '';
    public isLoading = true;


    private subscriptions: Subscription = new Subscription();
    private readonly HostsService = inject(HostsService);
    public readonly PermissionsService: PermissionsService = inject(PermissionsService)
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)

    public ngOnInit() {
        if (!this.lastUpdated) {
            // If lastUpdate is undefined, load the current status data.
            // If lastUpdate is set to a date time, the OnChange Method will be triggered and do the loading instead.
            // This is to avoid duplicate loading of data.
            this.loadData();
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // When the lastUpdated date changes, reload the data
        // This is used to trigger a reload from an external component
        // such as hosts/browser or services/browser
        if (changes['lastUpdated'] && !changes['lastUpdated'].isFirstChange()) {
            this.loadData();
        }
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadData() {
        this.subscriptions.add(this.HostsService.getHostBrowserMenuConfig(this.config.hostId)
            .subscribe((result) => {
                this.isLoading = false;
                this.data = result;

                if (this.data.includeHoststatus) {
                    this.hostStatusTextClass = String(this.data.Hoststatus.textClass);
                }

            })
        );
    }

}

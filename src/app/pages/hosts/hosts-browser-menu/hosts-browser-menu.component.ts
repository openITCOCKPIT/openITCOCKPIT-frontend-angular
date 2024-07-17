import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
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
import { NgClass, NgIf } from '@angular/common';
import { CopyToClipboardComponent } from '../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';
import { SkeletonModule } from 'primeng/skeleton';
import { PermissionsService } from '../../../permissions/permissions.service';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { PermissionDirective } from '../../../permissions/permission.directive';


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
        PermissionDirective
    ],
    templateUrl: './hosts-browser-menu.component.html',
    styleUrl: './hosts-browser-menu.component.css'
})
export class HostsBrowserMenuComponent implements OnInit, OnDestroy {

    @Input() config!: HostBrowserMenuConfig;

    public data?: HostBrowserMenu;
    public hostStatusTextClass: string = '';
    public isLoading = true;


    private subscriptions: Subscription = new Subscription();
    private readonly HostsService = inject(HostsService);
    public readonly PermissionsService: PermissionsService = inject(PermissionsService)
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)

    public ngOnInit() {
        this.loadData();
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

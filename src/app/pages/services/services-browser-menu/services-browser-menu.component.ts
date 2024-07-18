import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HostsService } from '../../hosts/hosts.service';
import { ServicesService } from '../services.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ServiceBrowserMenu } from '../services.interface';
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
import {
    BrowserMenuLoaderComponent
} from '../../../layouts/primeng/loading/browser-menu-loader/browser-menu-loader.component';
import { CopyToClipboardComponent } from '../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HoststatusIconComponent } from '../../hosts/hoststatus-icon/hoststatus-icon.component';
import { NgClass, NgIf, TitleCasePipe } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    ServicestatusIconComponent
} from '../../../components/services/servicestatus-icon/servicestatus-icon.component';
import { RouterLink } from '@angular/router';
import { HoststatusSimpleIconComponent } from '../../hosts/hoststatus-simple-icon/hoststatus-simple-icon.component';


export interface ServiceBrowserMenuConfig {
    serviceId: number,
    showReschedulingButton?: boolean,
    rescheduleCallback?: () => void,
    showBackButton?: boolean
}


@Component({
    selector: 'oitc-services-browser-menu',
    standalone: true,
    imports: [
        BadgeComponent,
        BrowserMenuLoaderComponent,
        ColComponent,
        CopyToClipboardComponent,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        FaIconComponent,
        HoststatusIconComponent,
        NgIf,
        PermissionDirective,
        RowComponent,
        TitleCasePipe,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        ServicestatusIconComponent,
        NgClass,
        RouterLink,
        TooltipDirective,
        HoststatusSimpleIconComponent
    ],
    templateUrl: './services-browser-menu.component.html',
    styleUrl: './services-browser-menu.component.css'
})
export class ServicesBrowserMenuComponent implements OnInit, OnDestroy {

    @Input() config!: ServiceBrowserMenuConfig;

    public data?: ServiceBrowserMenu;
    public hostStatusTextClass: string = '';
    public serviceStatusTextClass: string = '';
    public isLoading = true;


    private subscriptions: Subscription = new Subscription();
    private readonly HostsService = inject(HostsService);
    private readonly ServicesService = inject(ServicesService);
    public readonly PermissionsService: PermissionsService = inject(PermissionsService)
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)

    public ngOnInit() {
        this.loadData();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadData() {
        this.subscriptions.add(this.ServicesService.getServiceBrowserMenuConfig(this.config.serviceId)
            .subscribe((result) => {
                this.isLoading = false;
                this.data = result;

                if (this.data.includeHoststatus) {
                    this.hostStatusTextClass = String(this.data.Hoststatus.textClass);
                }
                if (this.data.includeServicestatus) {
                    this.serviceStatusTextClass = String(this.data.Servicestatus.textClass);
                }
            })
        );
    }

}

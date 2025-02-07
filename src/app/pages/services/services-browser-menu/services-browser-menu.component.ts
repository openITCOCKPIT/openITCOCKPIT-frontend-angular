import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    output,
    SimpleChanges
} from '@angular/core';
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

import { AsyncPipe, NgClass, NgIf, TitleCasePipe } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    ServicestatusIconComponent
} from '../../../components/services/servicestatus-icon/servicestatus-icon.component';
import { RouterLink } from '@angular/router';


export interface ServiceBrowserMenuConfig {
    serviceId: number,
    showReschedulingButton?: boolean,
    rescheduleCallback?: () => void,
    showBackButton?: boolean
}


@Component({
    selector: 'oitc-services-browser-menu',
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
        AsyncPipe
    ],
    templateUrl: './services-browser-menu.component.html',
    styleUrl: './services-browser-menu.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesBrowserMenuComponent implements OnInit, OnChanges, OnDestroy {

    @Input() config!: ServiceBrowserMenuConfig;
    @Input() lastUpdated?: Date; // Change the date to trigger an update from an external component

    public toggleRescheduling = output<boolean>();

    public data?: ServiceBrowserMenu;
    public hostStatusTextClass: string = '';
    public serviceStatusTextClass: string = '';
    public isLoading = true;


    private subscriptions: Subscription = new Subscription();
    private readonly HostsService = inject(HostsService);
    private readonly ServicesService = inject(ServicesService);
    public readonly PermissionsService: PermissionsService = inject(PermissionsService)
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private cdr = inject(ChangeDetectorRef);


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
        this.subscriptions.add(this.ServicesService.getServiceBrowserMenuConfig(this.config.serviceId)
            .subscribe((result) => {
                this.cdr.markForCheck();

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

    public toggleReschedulingOutput() {
        this.toggleRescheduling.emit(true);
    }

}

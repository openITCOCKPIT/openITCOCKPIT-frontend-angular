import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    QueryHandlerCheckerComponent
} from '../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HistoryService } from '../../../history.service';
import { HostsService } from '../hosts.service';
import { UUID } from '../../../classes/UUID';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    RowComponent
} from '@coreui/angular';
import { HostBrowserMenuConfig, HostsBrowserMenuComponent } from '../hosts-browser-menu/hosts-browser-menu.component';
import { NgIf } from '@angular/common';
import { BrowserLoaderComponent } from '../../../layouts/primeng/loading/browser-loader/browser-loader.component';

@Component({
    selector: 'oitc-hosts-browser',
    standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective,
        QueryHandlerCheckerComponent,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        RowComponent,
        ColComponent,
        HostsBrowserMenuComponent,
        NgIf,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        CardFooterComponent,
        BrowserLoaderComponent
    ],
    templateUrl: './hosts-browser.component.html',
    styleUrl: './hosts-browser.component.css'
})
export class HostsBrowserComponent implements OnInit, OnDestroy {

    public id: number = 0;

    public hostBrowserConfig?: HostBrowserMenuConfig;

    private subscriptions: Subscription = new Subscription();
    private HostsService = inject(HostsService);
    private readonly notyService = inject(NotyService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    constructor() {
    }

    public ngOnInit(): void {
        const idOrUuid = String(this.route.snapshot.paramMap.get('idOrUuid'));

        const uuid = new UUID();
        if (uuid.isUuid(idOrUuid)) {
            // UUID was passed via URL
            this.subscriptions.add(this.HostsService.getHostByUuid(idOrUuid).subscribe((host) => {
                this.id = host.id;
                this.loadHost();
            }));
        } else {
            // ID was passed via URL
            this.id = Number(idOrUuid);
            this.loadHost();
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadHost() {
        // Define the configuration for the HostBrowserMenuComponent because we know the hostId now
        this.hostBrowserConfig = {
            hostId: this.id,
            showReschedulingButton: true,
            rescheduleCallback: () => {
                console.log('implement callback')
            },
            showBackButton: true
        };

        console.log(this.id);
    }

}

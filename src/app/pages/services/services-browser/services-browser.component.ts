import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BrowserLoaderComponent } from '../../../layouts/primeng/loading/browser-loader/browser-loader.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { HostsBrowserMenuComponent } from '../../hosts/hosts-browser-menu/hosts-browser-menu.component';
import { NgIf } from '@angular/common';
import {
    QueryHandlerCheckerComponent
} from '../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UUID } from '../../../classes/UUID';
import { HostsService } from '../../hosts/hosts.service';
import { ServicesService } from '../services.service';
import { HistoryService } from '../../../history.service';
import {
    ServiceBrowserMenuConfig,
    ServicesBrowserMenuComponent
} from '../services-browser-menu/services-browser-menu.component';

@Component({
    selector: 'oitc-services-browser',
    standalone: true,
    imports: [
        BrowserLoaderComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        HostsBrowserMenuComponent,
        NgIf,
        QueryHandlerCheckerComponent,
        TranslocoDirective,
        ServicesBrowserMenuComponent
    ],
    templateUrl: './services-browser.component.html',
    styleUrl: './services-browser.component.css'
})
export class ServicesBrowserComponent implements OnInit, OnDestroy {

    public id: number = 0;

    public serviceBrowserConfig?: ServiceBrowserMenuConfig;

    private subscriptions: Subscription = new Subscription();
    private readonly HostsService = inject(HostsService);
    private readonly ServicesService = inject(ServicesService);
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
            this.subscriptions.add(this.ServicesService.getServiceByUuid(idOrUuid).subscribe((service) => {
                this.id = Number(service.id);
                this.loadService();
            }));
        } else {
            // ID was passed via URL
            this.id = Number(idOrUuid);
            this.loadService();
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadService() {
        // Define the configuration for the ServiceBrowserMenuComponent because we know the serviceId now
        this.serviceBrowserConfig = {
            serviceId: this.id,
            showReschedulingButton: true,
            rescheduleCallback: () => {
                console.log('implement callback')
            },
            showBackButton: false
        };

        console.log(this.id);
    }

}

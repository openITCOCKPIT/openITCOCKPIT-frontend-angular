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
import { ServicesBrowserChartComponent } from './services-browser-chart/services-browser-chart.component';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../services/timezone.service';
import { ServiceBrowserResult } from '../services.interface';
import { SelectKeyValueString } from '../../../layouts/primeng/select.interface';

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
        ServicesBrowserMenuComponent,
        ServicesBrowserChartComponent
    ],
    templateUrl: './services-browser.component.html',
    styleUrl: './services-browser.component.css'
})
export class ServicesBrowserComponent implements OnInit, OnDestroy {

    public id: number = 0;

    public serviceBrowserConfig?: ServiceBrowserMenuConfig;
    public timezone!: TimezoneObject;

    public result?: ServiceBrowserResult;
    public lastUpdated: Date = new Date(); // Used to tell child components to reload data
    public availableDataSources: SelectKeyValueString[] = []; // The API result is not as good

    public priorityClasses: string[] = ['ok-soft', 'ok', 'warning', 'critical-soft', 'critical'];
    public priorities: string[] = [];
    public tags: string[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly HostsService = inject(HostsService);
    private readonly ServicesService = inject(ServicesService);
    private readonly notyService = inject(NotyService);
    private readonly TimezoneService = inject(TimezoneService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    constructor() {
    }

    public ngOnInit(): void {
        this.getUserTimezone();

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

    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.timezone = data;
        }));
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

        this.subscriptions.add(this.ServicesService.getServiceBrowser(this.id).subscribe((result) => {
            this.result = result;

            let priority = Number(result.mergedService.priority);
            // Sift priority into array index
            if (priority > 0) {
                priority = priority - 1;
            }
            this.priorities = ['text-muted', 'text-muted', 'text-muted', 'text-muted', 'text-muted']; // make all icons gray
            for (let i = 0; i <= priority; i++) {
                this.priorities[i] = this.priorityClasses[priority]; // set color depending on priority level
            }

            this.tags = String(result.mergedService.tags).split(',');

            for (let key in result.mergedService.Perfdata) {
                const gauge = result.mergedService.Perfdata[key];
                this.availableDataSources.push({
                    key: key, // load this datasource - this is important for Prometheus metrics which have no __name__ like rate() or sum(). We can than load metric 0, 1 or 2...
                    value: gauge.metric // Name of the metric to display in select
                });
            }

            this.loadCustomalerts();
            this.loadSlaInformation();

            this.lastUpdated = new Date();
        }));
    }

    public loadCustomalerts() {
        console.log("TODO: Implement loadCustomalerts")
    }

    public loadSlaInformation() {
        console.log("TODO: Implement loadSlaInformation")
    }

    protected readonly String = String;
}

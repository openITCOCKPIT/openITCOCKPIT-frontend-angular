import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServicesbrowserService } from './servicesbrowser.service';
import { ServicesBrowser } from './services-browser.interface';
import { TimezoneObject } from "./timezone.interface";
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ContainerComponent,
    NavComponent,
    NavItemComponent,
} from '@coreui/angular'
import { UplotGraphComponent } from '../../../components/uplot-graph/uplot-graph.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { UserMacrosModalComponent } from '../../commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-services-browser-page',
    standalone: true,
    imports: [
        NgIf,
        NgForOf,
        JsonPipe,
        ContainerComponent,
        UplotGraphComponent,
        CoreuiComponent,
        TranslocoDirective,
        TranslocoPipe,
        FaIconComponent,
        PermissionDirective,
        NavComponent,
        NavItemComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        CardTitleDirective,
        BackButtonDirective,
        UserMacrosModalComponent,
        XsButtonDirective,
    ],
    templateUrl: './services-browser-page.component.html',
    styleUrl: './services-browser-page.component.css'
})
export class ServicesBrowserPageComponent implements OnInit, OnDestroy {
    public service!: ServicesBrowser;
    public serviceName: string = '';
    public hostName: string = '';
    public timezone!: TimezoneObject;
    public dataSources: { key: string, displayName: string }[] = [];
    private subscriptions: Subscription = new Subscription();
    private ServicesBrowserService = inject(ServicesbrowserService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    constructor(private _liveAnnouncer: LiveAnnouncer) {

    }

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.load(id);
    }

    public load(id: number) {
        this.subscriptions.add(this.ServicesBrowserService.getServicesbrowser(id)
            .subscribe((service) => {
                this.service = service;
                this.serviceName = service.mergedService.name;
                this.hostName = service.host.Host.hostname;
                this.getDataSources();
                this.getUserTimezone();
            })
        );
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private getDataSources() {
        for (var dsKey in this.service.mergedService.Perfdata) {
            var dsDisplayName = this.service.mergedService.Perfdata[dsKey].metric
            this.dataSources.push({
                key: dsKey, // load this datasource - this is important for Prometheus metrics which have no __name__ like rate() or sum(). We can than load metric 0, 1 or 2...
                displayName: dsDisplayName // Name of the metric to display in select
            });
        }
    }

    private getUserTimezone() {
        this.subscriptions.add(this.ServicesBrowserService.getUserTimezone()
            .subscribe((timezone) => {
                this.timezone = timezone.timezone;
                // console.log(this.service.mergedService.Perfdata)
            })
        );
    }

}

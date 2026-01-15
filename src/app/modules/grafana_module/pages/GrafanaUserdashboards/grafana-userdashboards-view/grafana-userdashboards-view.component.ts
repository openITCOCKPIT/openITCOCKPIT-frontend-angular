import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GrafanaTimepickerChange } from '../../../components/grafana-timepicker/grafana-timepicker.interface';
import { GrafanaTimepickerComponent } from '../../../components/grafana-timepicker/grafana-timepicker.component';
import { GrafanaUserdashboardsService } from '../grafana-userdashboards.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { GrafanaUserdashboardViewResponse } from '../grafana-userdashboards.interface';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';

import { Error404Component } from '../../../../../layouts/coreui/errors/error404/error404.component';
import { IframeComponent } from '../../../../../components/iframe/iframe.component';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-grafana-userdashboards-view',
    imports: [
        GrafanaTimepickerComponent,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        CardFooterComponent,
        BlockLoaderComponent,
        Error404Component,
        IframeComponent,
        NavItemComponent,
        BackButtonDirective,
        XsButtonDirective
    ],
    templateUrl: './grafana-userdashboards-view.component.html',
    styleUrl: './grafana-userdashboards-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaUserdashboardsViewComponent implements OnInit, OnDestroy {

    private id: number = 0;

    public isLoading = true;
    public dashboard?: GrafanaUserdashboardViewResponse;
    public iframeUrl: string = '';
    public dashboardFoundInGrafana: boolean = false;

    public selectedGrafanaTimerange: string = 'now-3h';
    public selectedGrafanaAutorefresh: string = '1m';

    private router: Router = inject(Router);
    private subscriptions: Subscription = new Subscription();

    private readonly GrafanaUserdashboardsService = inject(GrafanaUserdashboardsService)
    private cdr = inject(ChangeDetectorRef);

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.load();

        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.subscriptions.add(this.GrafanaUserdashboardsService.getView(this.id).subscribe(response => {
            this.dashboard = response;
            this.dashboardFoundInGrafana = response.dashboardFoundInGrafana;

            this.selectedGrafanaTimerange = response.dashboard.range;
            this.selectedGrafanaAutorefresh = response.dashboard.refresh;

            this.loadGrafanaIframeUrl();

            this.cdr.markForCheck();
        }));
    }

    private loadGrafanaIframeUrl() {
        if (this.id === 0) {
            this.isLoading = false;
            this.cdr.markForCheck();
            return;
        }

        this.subscriptions.add(this.GrafanaUserdashboardsService.getViewIframeUrl(this.id, this.selectedGrafanaTimerange, this.selectedGrafanaAutorefresh).subscribe(response => {
            this.dashboardFoundInGrafana = response.dashboardFoundInGrafana;
            this.iframeUrl = response.iframeUrl;

            this.isLoading = false; // Avoid flickering of 404 icon

            this.cdr.markForCheck();
        }));
    }

    public onGrafanaTimeRangeChange(event: GrafanaTimepickerChange): void {
        this.selectedGrafanaTimerange = event.timerange;
        this.selectedGrafanaAutorefresh = event.autorefresh;
        this.loadGrafanaIframeUrl();
    }

}

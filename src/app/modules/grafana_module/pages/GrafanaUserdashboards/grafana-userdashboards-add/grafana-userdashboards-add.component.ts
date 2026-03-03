import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../../../history.service';
import { GrafanaUserdashboardsService } from '../grafana-userdashboards.service';
import { GrafanaUserdashboardPost } from '../grafana-userdashboards.interface';
import { GrafanaTimepickerComponent } from '../../../components/grafana-timepicker/grafana-timepicker.component';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { GrafanaTimepickerChange } from '../../../components/grafana-timepicker/grafana-timepicker.interface';

@Component({
    selector: 'oitc-grafana-userdashboards-add',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormCheckInputDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        RequiredIconComponent,
        XsButtonDirective,
        SelectComponent,
        TranslocoPipe,
        GrafanaTimepickerComponent,
        OitcAlertComponent
    ],
    templateUrl: './grafana-userdashboards-add.component.html',
    styleUrl: './grafana-userdashboards-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaUserdashboardsAddComponent implements OnInit, OnDestroy {

    public createAnother: boolean = false;
    public post: GrafanaUserdashboardPost = this.getDefaultPost()
    public errors: GenericValidationError | null = null;

    public hasGrafanaConfig: boolean = true;
    public containers: SelectKeyValue[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly GrafanaUserdashboardsService = inject(GrafanaUserdashboardsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.loadContainers();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public getDefaultPost(): GrafanaUserdashboardPost {
        return {
            GrafanaUserdashboard: {
                name: '',
                container_id: 0,
                range: 'now-3h',
                refresh: '1m'
            }
        };
    }

    public onGrafanaTimeRangeChange(event: GrafanaTimepickerChange): void {
        this.post.GrafanaUserdashboard.range = event.timerange;
        this.post.GrafanaUserdashboard.refresh = event.autorefresh;
        this.cdr.markForCheck();
    }

    public submit() {
        this.subscriptions.add(this.GrafanaUserdashboardsService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Grafana dashboard');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['grafana_module', 'grafana_userdashboards', 'editor', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.router.navigate(['/', 'grafana_module', 'grafana_userdashboards', 'editor', response.id]);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.notyService.scrollContentDivToTop();
                    this.errors = null;
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            }));
    }

    private loadContainers(): void {
        this.subscriptions.add(this.GrafanaUserdashboardsService.loadContainers().subscribe((response) => {
            this.containers = response.containers;
            this.hasGrafanaConfig = response.hasGrafanaConfig;
            this.cdr.markForCheck();
        }))
    }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { GrafanaTimepickerComponent } from '../../../components/grafana-timepicker/grafana-timepicker.component';
import { NgIf } from '@angular/common';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { GrafanaUserdashboardPost } from '../grafana-userdashboards.interface';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { GrafanaTimepickerChange } from '../../../components/grafana-timepicker/grafana-timepicker.interface';
import { GrafanaUserdashboardsService } from '../grafana-userdashboards.service';
import { HistoryService } from '../../../../../history.service';

@Component({
    selector: 'oitc-grafana-userdashboards-edit',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        GrafanaTimepickerComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        OitcAlertComponent,
        PermissionDirective,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        FormLoaderComponent
    ],
    templateUrl: './grafana-userdashboards-edit.component.html',
    styleUrl: './grafana-userdashboards-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaUserdashboardsEditComponent implements OnInit, OnDestroy {

    public post!: GrafanaUserdashboardPost;
    public errors: GenericValidationError | null = null;

    public hasGrafanaConfig: boolean = true;
    public containers: SelectKeyValue[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly GrafanaUserdashboardsService = inject(GrafanaUserdashboardsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadDashboard(id);
            this.loadContainers();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadDashboard(id: number) {
        this.subscriptions.add(this.GrafanaUserdashboardsService.getUserdashboardEdit(id).subscribe(dashboard => {
            this.post = dashboard;
            this.cdr.markForCheck();
        }));
    }


    public onGrafanaTimeRangeChange(event: GrafanaTimepickerChange): void {
        this.post.GrafanaUserdashboard.range = event.timerange;
        this.post.GrafanaUserdashboard.refresh = event.autorefresh;
        this.cdr.markForCheck();
    }


    public submit() {
        this.subscriptions.add(this.GrafanaUserdashboardsService.saveUserdashboardEdit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();

                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Grafana dashboard');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['grafana_module', 'grafana_userdashboards', 'editor', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/grafana_module/grafana_userdashboards/index']);
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

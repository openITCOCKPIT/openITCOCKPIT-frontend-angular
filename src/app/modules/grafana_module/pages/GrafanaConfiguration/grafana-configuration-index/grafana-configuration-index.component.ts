import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { GrafanaService } from '../../../grafana.service';
import { GrafanaConfigurationPost } from '../../../grafana.interface';
import { SelectKeyValueString, SelectKeyValueWithDisabled } from '../../../../../layouts/primeng/select.interface';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { GenericValidationError } from '../../../../../generic-responses';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'oitc-grafana-configuration-index',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormDirective,
        FormLoaderComponent,
        FormsModule,
        NgIf,
        PermissionDirective,
        ReactiveFormsModule,
        TranslocoDirective,
        CardFooterComponent,
        XsButtonDirective,
        RouterLink,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        TrueFalseDirective,
        SelectComponent,
        MultiSelectComponent,
        OitcAlertComponent,
        TranslocoPipe
    ],
    templateUrl: './grafana-configuration-index.component.html',
    styleUrl: './grafana-configuration-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaConfigurationIndexComponent implements OnInit, OnDestroy {
    private readonly GrafanaService = inject(GrafanaService);

    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private subscriptions: Subscription = new Subscription();

    private cdr = inject(ChangeDetectorRef);

    public post: GrafanaConfigurationPost = {
        id: 1, //its 1 every time
        api_url: '',
        api_key: '',
        graphite_prefix: '',
        use_https: 0, //number
        use_proxy: 1, //number
        ignore_ssl_certificate: 0, //number
        dashboard_style: 'light', //light / dark
        Hostgroup: [],
        Hostgroup_excluded: []
    };

    public hostgroups: SelectKeyValueWithDisabled[] = [];
    public hostgroups_excluded: SelectKeyValueWithDisabled[] = [];
    public errors: GenericValidationError | null = null;

    public readonly dashboardStyles: SelectKeyValueString[] = [
        {key: 'dark', value: this.TranslocoService.translate('dark')},
        {key: 'light', value: this.TranslocoService.translate('light')},
    ];

    public hasGrafanaConnectionError: boolean | null = null; // Null = not checked yet

    public grafanaErrors = {
        status: '',
        statusText: '',
        message: ''
    };

    public ngOnInit(): void {
        this.loadHostgroups();
        this.loadGrafanaConfiguration();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadGrafanaConfiguration(): void {
        this.subscriptions.add(this.GrafanaService.loadGrafanaConfiguration().subscribe((result) => {
            const config = result.grafanaConfiguration;

            this.post.api_url = config.api_url;
            this.post.api_key = config.api_key;
            this.post.graphite_prefix = config.graphite_prefix;
            this.post.use_https = config.use_https;
            this.post.use_proxy = config.use_proxy;
            this.post.ignore_ssl_certificate = config.ignore_ssl_certificate;
            this.post.dashboard_style = config.dashboard_style;
            this.post.Hostgroup = config.Hostgroup;
            this.post.Hostgroup_excluded = config.Hostgroup_excluded;

            this.processHostgroups();

            this.cdr.markForCheck();
        }));
    }

    public loadHostgroups(): void {
        this.subscriptions.add(this.GrafanaService.loadHostgroups().subscribe((hostgroups) => {
            this.hostgroups = [];
            this.hostgroups_excluded = [];

            this.hostgroups = hostgroups;
            this.hostgroups_excluded = JSON.parse(JSON.stringify(hostgroups)); //WO DONT WANT A REFERENCE!!

            this.cdr.markForCheck();
        }));
    }

    public processHostgroups(): void {
        this.processChosenHostgroups();
        this.processChosenExcludedHostgroups();
    }

    public processChosenHostgroups() {
        for (const key in this.hostgroups) {
            this.hostgroups[key].disabled = this.post.Hostgroup_excluded.includes(this.hostgroups[key].key);
        }
        this.cdr.markForCheck();
    }

    public processChosenExcludedHostgroups() {
        for (const key in this.hostgroups_excluded) {
            this.hostgroups_excluded[key].disabled = this.post.Hostgroup.includes(this.hostgroups[key].key);
        }
        this.cdr.markForCheck();
    }

    public updateGrafanaSettings() {
        this.subscriptions.add(this.GrafanaService.saveGrafanaSettings(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {

                    this.notyService.genericSuccess();
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

    public checkGrafanaConnection() {
        this.hasGrafanaConnectionError = null; // Not checked yet

        const sub = this.GrafanaService.testGrafanaConnection(this.post).subscribe({
            next: (result) => {
                //console.log(result);
                // 200 ok

                this.hasGrafanaConnectionError = false;
                if (result.status.status === false) {
                    this.hasGrafanaConnectionError = true;

                    let msg = result.status.msg?.message;
                    if (!msg) {
                        msg = 'Unknown Error';
                    }

                    this.grafanaErrors.status = '400';
                    this.grafanaErrors.statusText = 'Bad Request';
                    this.grafanaErrors.message = msg;
                }

                this.cdr.markForCheck();
            },
            error: (error: HttpErrorResponse) => {
                this.hasGrafanaConnectionError = true;

                this.grafanaErrors.status = String(error.status);
                this.grafanaErrors.statusText = error.statusText;
                this.grafanaErrors.message = error.message

                this.cdr.markForCheck();
            }
        });

        this.subscriptions.add(sub);
    }

}

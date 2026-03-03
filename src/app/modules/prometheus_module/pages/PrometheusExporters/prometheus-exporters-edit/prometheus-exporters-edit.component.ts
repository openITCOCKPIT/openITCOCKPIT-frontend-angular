import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SelectKeyValue, SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { PrometheusExportersService } from '../prometheus-exporters.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { PrometheusExporterEditPost, PrometheusExporterEditRoot } from '../prometheus-exporters.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HistoryService } from '../../../../../history.service';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
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
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { FormsModule } from '@angular/forms';

import { PaginatorModule } from 'primeng/paginator';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';

@Component({
    selector: 'oitc-prometheus-exporters-edit',
    standalone: true,
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        FormDirective,
        FormLoaderComponent,
        FormsModule,
        PaginatorModule,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        FormControlDirective,
        SelectComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        TrueFalseDirective,
        FormCheckLabelDirective,
        CardFooterComponent
    ],
    templateUrl: './prometheus-exporters-edit.component.html',
    styleUrl: './prometheus-exporters-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrometheusExportersEditComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly PrometheusExportersService: PrometheusExportersService = inject(PrometheusExportersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly route = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);

    protected post: PrometheusExporterEditPost = {} as PrometheusExporterEditPost;
    protected containers: SelectKeyValue[] = [];
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected intervals: SelectKeyValueString[] = [
        {key: "15s", value: "15 seconds"},
        {key: "30s", value: "30 seconds"},
        {key: "1m", value: "1 minute"},
        {key: "90s", value: "1 minute 30 seconds"},
        {key: "2m", value: "2 minutes"},
        {key: "5m", value: "5 minutes"},
        {key: "10m", value: "10 minutes"},
        {key: "30m", value: "30 minutes"},
        {key: "1h", value: "1 hour"}
    ];

    public ngOnInit() {
        this.loadContainers();
        this.loadPrometheusExportersEdit();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }


    private loadContainers(): void {
        this.subscriptions.add(this.PrometheusExportersService.loadContainers()
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }))
    }

    private loadPrometheusExportersEdit(): void {

        const id = Number(this.route.snapshot.paramMap.get('id'));


        this.subscriptions.add(this.PrometheusExportersService.getEdit(id)
            .subscribe((result: PrometheusExporterEditRoot) => {
                this.post.PrometheusExporter = result.PrometheusExporter;
                this.cdr.markForCheck();
            }));
    }

    public update(): void {
        this.subscriptions.add(this.PrometheusExportersService.update(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const title: string = this.TranslocoService.translate('Prometheus Exporter');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['prometheus_module', 'PrometheusExporters', 'edit', result.data.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/prometheus_module/PrometheusExporters/index']);
                    return;
                }
                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;

                    console.warn(this.errors);
                }
            })
        );
    }
}

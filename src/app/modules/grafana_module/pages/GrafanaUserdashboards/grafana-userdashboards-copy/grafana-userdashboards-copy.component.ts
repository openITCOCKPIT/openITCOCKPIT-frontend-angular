import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective,
    NavComponent
} from '@coreui/angular';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericValidationError } from '../../../../../generic-responses';
import { GrafanaUserdashboardCopyPost } from '../grafana-userdashboards.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { GrafanaUserdashboardsService } from '../grafana-userdashboards.service';
import { HistoryService } from '../../../../../history.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'oitc-grafana-userdashboards-copy',
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
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormLoaderComponent,
        FormsModule,
        NavComponent,
        NgForOf,
        RequiredIconComponent,
        XsButtonDirective
    ],
    templateUrl: './grafana-userdashboards-copy.component.html',
    styleUrl: './grafana-userdashboards-copy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrafanaUserdashboardsCopyComponent implements OnInit, OnDestroy {

    public dashboards: GrafanaUserdashboardCopyPost[] = [];
    public errors: GenericValidationError | null = null;


    private subscriptions: Subscription = new Subscription()
    private GrafanaUserdashboardsService = inject(GrafanaUserdashboardsService);
    private readonly notyService = inject(NotyService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);
        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'grafana_module', 'grafana_userdashboards', 'index']);
        }

        if (ids) {
            this.subscriptions.add(this.GrafanaUserdashboardsService.getUserDashboardsCopy(ids).subscribe(dashboards => {
                for (let dashboard of dashboards) {
                    this.dashboards.push(<GrafanaUserdashboardCopyPost>{
                        Source: {
                            id: dashboard.id,
                            name: dashboard.name
                        },

                        Dashboard: {
                            name: dashboard.name
                        },
                        Error: null
                    })
                }
                this.cdr.markForCheck();
            }));
        }
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe()
    }

    public copy() {
        const sub = this.GrafanaUserdashboardsService.saveUserDashboardsCopy(this.dashboards).subscribe({
            next: (value: any) => {
                //console.log(value); // Serve result with the new copied dashboards
                // 200 ok
                this.notyService.genericSuccess();
                this.HistoryService.navigateWithFallback(['/', 'grafana_module', 'grafana_userdashboards', 'index']);
            },
            error: (error: HttpErrorResponse) => {
                // We run into a validation error.
                // Some dashboards maybe already got created. For example when the user copied 3 dashboards, and the first
                // two dashboards where copied successfully, but the third one failed due to a validation error.
                //
                // The Server returns everything as the frontend expect it

                this.cdr.markForCheck();
                this.notyService.genericError();
                this.dashboards = error.error.result as GrafanaUserdashboardCopyPost[];
            }
        });
        this.subscriptions.add(sub);
    }
}

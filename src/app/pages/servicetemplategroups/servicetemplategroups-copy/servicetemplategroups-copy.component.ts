import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
    ServiceTemplateGroupsGetCopyGetServicetemplategroup,
    ServiceTemplateGroupsGetCopyPostData,
} from '../servicetemplategroups.interface';
import { ServicetemplategroupsService } from '../servicetemplategroups.service';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-servicetemplategroups-copy',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,

        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NavComponent,
        NgForOf,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormsModule,
        FormLoaderComponent,
        NgIf
    ],
    templateUrl: './servicetemplategroups-copy.component.html',
    styleUrl: './servicetemplategroups-copy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicetemplategroupsCopyComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly ServicetemplategroupsService: ServicetemplategroupsService = inject(ServicetemplategroupsService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected servicetemplategroups: ServiceTemplateGroupsGetCopyPostData[] = [];
    protected errors: GenericValidationError | null = null;

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);

        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'servicetemplategroups', 'index']);
            return;
        }

        this.subscriptions.add(this.ServicetemplategroupsService.getServicetemplategroupsCopy(ids).subscribe((servicetemplategroups: ServiceTemplateGroupsGetCopyGetServicetemplategroup[]) => {
            for (let servicetemplategroup of servicetemplategroups) {
                this.servicetemplategroups.push({
                    Servicetemplategroup: {
                        container: {
                            name: servicetemplategroup.container.name
                        },
                        description: servicetemplategroup.description,
                    },
                    Source: {
                        id: servicetemplategroup.id,
                        name: servicetemplategroup.container.name
                    },
                    Error: null
                });
            }
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public copyServicetemplategroups() {
        this.subscriptions.add(
            this.ServicetemplategroupsService.saveServicetemplategroupsCopy(this.servicetemplategroups).subscribe({
                next: (value: any) => {
                    this.notyService.genericSuccess();
                    this.HistoryService.navigateWithFallback(['/', 'servicetemplategroups', 'index']);
                },
                error: (error: HttpErrorResponse) => {
                    this.cdr.markForCheck();
                    this.notyService.genericError();
                    this.servicetemplategroups = error.error.result as ServiceTemplateGroupsGetCopyPostData[];
                    this.servicetemplategroups.forEach((serviceTemplateGroup: ServiceTemplateGroupsGetCopyPostData) => {
                        if (!serviceTemplateGroup.Error) {
                            return;
                        }
                        if (serviceTemplateGroup.Error?.['container']['name'] !== 'undefined') {
                            serviceTemplateGroup.Error['name'] = <any>serviceTemplateGroup.Error?.['container']['name'];
                        }
                    });
                }
            })
        );
    }
}

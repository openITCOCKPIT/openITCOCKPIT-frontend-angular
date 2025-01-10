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
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ServicegroupsService } from '../servicegroups.service';
import { ServicegroupsCopyPostResult } from '../servicegroups.interface';
import { GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-servicegroups-copy',
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
    templateUrl: './servicegroups-copy.component.html',
    styleUrl: './servicegroups-copy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicegroupsCopyComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly ServicegroupsService: ServicegroupsService = inject(ServicegroupsService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected servicegroups: ServicegroupsCopyPostResult[] = [];
    protected errors: GenericValidationError | null = null;

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);

        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'servicegroups', 'index']);
            return;
        }

        this.subscriptions.add(this.ServicegroupsService.getServicegroupsCopy(ids).subscribe((servicegroups) => {
            for (let servicegroup of servicegroups) {
                this.servicegroups.push({
                    Servicegroup: {
                        container: {
                            name: servicegroup.container.name,
                        },
                        description: servicegroup.description,
                    },
                    Source: {
                        id: servicegroup.id,
                        name: servicegroup.container.name
                    },
                    Error: null
                } as ServicegroupsCopyPostResult);
            }
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public copyServicegroups() {
        this.subscriptions.add(
            this.ServicegroupsService.saveServicegroupsCopy(this.servicegroups).subscribe({
                next: (value: any) => {
                    this.notyService.genericSuccess();
                    this.HistoryService.navigateWithFallback(['/', 'servicegroups', 'index']);
                },
                error: (error: HttpErrorResponse) => {
                    this.cdr.markForCheck();
                    this.notyService.genericError();
                    this.servicegroups = error.error.result as ServicegroupsCopyPostResult[];
                    this.servicegroups.forEach((servicegroup: ServicegroupsCopyPostResult) => {
                        if (!servicegroup.Error) {
                            return;
                        }
                        if (servicegroup.Error?.['container']['name'] !== 'undefined') {
                            servicegroup.Error['name'] = <any>servicegroup.Error?.['container']['name'];
                        }
                    });
                }
            })
        );
    }
}


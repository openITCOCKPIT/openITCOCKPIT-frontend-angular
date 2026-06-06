import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { HistoryService } from '../../../history.service';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';


import { FormsModule } from '@angular/forms';


import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ServicegroupsService } from '../servicegroups.service';
import { ServicegroupAppend } from '../servicegroups.interface';
import { Subscription } from 'rxjs';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { HostgroupsLoadHostgroupsByStringParams } from '../../hostgroups/hostgroups.interface';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';

@Component({
    selector: 'oitc-servicegroups-append',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormDirective,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        PaginatorModule,
        PermissionDirective,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        AlertComponent,
        RouterLink,
        FormErrorDirective,
        FormFeedbackComponent
    ],
    templateUrl: './servicegroups-append.component.html',
    styleUrl: './servicegroups-append.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicegroupsAppendComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly ServicegroupsService: ServicegroupsService = inject(ServicegroupsService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);

    protected servicegroups: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;
    protected post: ServicegroupAppend = {
        Servicegroup: {
            services: {
                _ids: []
            },
            id: 0
        }
    };


    public ngOnInit() {
        this.loadServicegroups('');
        this.cdr.markForCheck();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    protected loadServicegroups = (search: string) => {
        this.subscriptions.add(this.ServicegroupsService.loadServicegroupsByString({
            'filter[Containers.name]': search
        } as HostgroupsLoadHostgroupsByStringParams).subscribe((data: SelectKeyValue[]) => {
            this.servicegroups = data;
            this.cdr.markForCheck();
        }));
    }

    protected submit(): void {
        const serviceIds = this.route.snapshot.paramMap.get('serviceids');
        if (serviceIds) {
            this.post.Servicegroup.services._ids = serviceIds.split(',').map(Number);
        }

        this.subscriptions.add(this.ServicegroupsService.appendServices(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Append services to service group');
                    const msg = this.TranslocoService.translate(' successfully');
                    const url = ['servicegroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.notyService.scrollContentDivToTop();
                    this.HistoryService.navigateWithFallback(['/services/index']);
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

}

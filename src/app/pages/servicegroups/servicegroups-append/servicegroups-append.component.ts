import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { HistoryService } from '../../../history.service';
import {
    AlertComponent,
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
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgIf } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ServicegroupsService } from '../servicegroups.service';
import { ServicegroupAppend, ServicegroupsLoadServicegroupsByStringParams } from '../servicegroups.interface';
import { Subscription } from 'rxjs';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericResponseWrapper } from '../../../generic-responses';

@Component({
    selector: 'oitc-servicegroups-append',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormCheckInputDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        PaginatorModule,
        PermissionDirective,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        AlertComponent,
        RouterLink
    ],
    templateUrl: './servicegroups-append.component.html',
    styleUrl: './servicegroups-append.component.css'
})
export class ServicegroupsAppendComponent implements OnInit, OnDestroy {
    private readonly Subscription: Subscription = new Subscription();
    private readonly ServicegroupsService: ServicegroupsService = inject(ServicegroupsService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    protected post: ServicegroupAppend = {
        Servicegroup: {
            services: {
                _ids: []
            },
            id: 0
        }
    };
    protected servicegroups: SelectKeyValue[] = [];

    protected submit(): void {
        const serviceIds = this.route.snapshot.paramMap.get('serviceids');
        if (serviceIds) {
            this.post.Servicegroup.services._ids = serviceIds.split(',').map(Number);
        }

        this.Subscription.add(this.ServicegroupsService.appendServices(this.post).subscribe((result: GenericResponseWrapper) => {

            const title = this.TranslocoService.translate('Service group');
            const msg = this.TranslocoService.translate('saved successfully');
            const url = ['servicegroups', 'edit', this.post.Servicegroup.id];

            this.notyService.genericSuccess(msg, title, url);


            this.HistoryService.navigateWithFallback(['/servicegroups/index']);
        }));
    }

    public ngOnInit() {
        this.Subscription.add(this.ServicegroupsService.loadServicegroupsByString({} as ServicegroupsLoadServicegroupsByStringParams).subscribe((data: SelectKeyValue[]) => {
            this.servicegroups = data;
        }));
    }

    ngOnDestroy(): void {
        this.Subscription.unsubscribe();
    }

}

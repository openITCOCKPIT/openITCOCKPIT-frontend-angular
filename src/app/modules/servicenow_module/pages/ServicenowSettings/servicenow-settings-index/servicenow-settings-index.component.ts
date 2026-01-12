import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ServicenowService } from '../../../servicenow.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ServicenowSettings, ServicenowSettingsIndexRoot } from '../../../servicenow.interface';
import { GenericValidationError } from '../../../../../generic-responses';
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
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';

import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';

@Component({
    selector: 'oitc-servicenow-settings-index',
    imports: [
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    PermissionDirective,
    RequiredIconComponent,
    RouterLink,
    TranslocoDirective,
    XsButtonDirective,
    FormLoaderComponent,
    FormControlDirective,
    SelectComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    TrueFalseDirective,
    FormCheckLabelDirective
],
    templateUrl: './servicenow-settings-index.component.html',
    styleUrl: './servicenow-settings-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicenowSettingsIndexComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();
    private readonly ServicenowService = inject(ServicenowService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService = inject(NotyService);

    public post: ServicenowSettings = {
        domain: '',
        user_id: '',
        user_password: '',
        assignment_group: '',
        assigned_to: '',
        business_service: '',
        impact: 1,
        urgency: 1,
        recovery_state: 6,
        two_way: false,
        use_proxy: false,
    };
    public errors: GenericValidationError | null = null;

    public selectOptions: SelectKeyValue[] = [
        {key: 1, value: '1 - High'},
        {key: 2, value: '2 - Medium'},
        {key: 3, value: '3 - Low'}
    ];

    public selectOptionsRecoveryState: SelectKeyValue[] = [
        {key: 6, value: 'Resolved'},
        {key: 7, value: 'Closed'},
        {key: 8, value: 'Canceled'},
    ];

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private load() {
        this.subscriptions.add(this.ServicenowService.getServicenowSettingsIndex()
            .subscribe((result: ServicenowSettingsIndexRoot) => {
                this.post = result.servicenowSettings;
                this.cdr.markForCheck();
            }));
    }

    public updateServicenowSettings(): void {
        this.subscriptions.add(this.ServicenowService.updateServicenowSettings(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {

                    const title = this.TranslocoService.translate('Data');
                    const msg = this.TranslocoService.translate('saved successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.errors = null;
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;

                }
            }))
    }

}

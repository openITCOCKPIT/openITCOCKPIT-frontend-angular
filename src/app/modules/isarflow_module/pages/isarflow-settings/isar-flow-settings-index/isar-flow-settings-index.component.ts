import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { FormsModule } from '@angular/forms';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective
} from '@coreui/angular';
import { NgIf } from '@angular/common';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { IsarFlowSettingsPost } from '../isar-flow-settings.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { IsarFlowSettingsService } from '../isar-flow-settings.service';
import { SelectKeyValue, SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { GenericValidationError } from '../../../../../generic-responses';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';

@Component({
    selector: 'oitc-isar-flow-settings-index',
    imports: [
        RouterLink,
        FaIconComponent,
        PermissionDirective,
        FormLoaderComponent,
        FormsModule,
        CardComponent,
        NgIf,
        CardHeaderComponent,
        CardTitleDirective,
        CardFooterComponent,
        CardBodyComponent,
        XsButtonDirective,
        FormDirective,
        TranslocoDirective,
        RequiredIconComponent,
        MultiSelectComponent,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        DebounceDirective,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TrueFalseDirective,
        SelectComponent
    ],
    templateUrl: './isar-flow-settings-index.component.html',
    styleUrl: './isar-flow-settings-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsarFlowSettingsIndexComponent implements OnInit, OnDestroy {

    private readonly TranslocoService = inject(TranslocoService);

    public post?: IsarFlowSettingsPost;
    public errors: GenericValidationError | null = null;
    public externalSystems: SelectKeyValue[] = [];
    public authenticationMethods: SelectKeyValueString[] = [
        {key: 'password', value: this.TranslocoService.translate('Password')},
        {key: 'token', value: this.TranslocoService.translate('Token')},
    ]
    public languageCodes: SelectKeyValueString[] = [
        {key: 'en', value: this.TranslocoService.translate('en')},
        {key: 'de', value: this.TranslocoService.translate('de')},
    ];
    public granularityOptions: SelectKeyValue[] = [
        {key: 60, value: '60'},
        {key: 300, value: '300'},
        {key: 1440, value: '1440'},
        {key: 3600, value: '3600'},
        {key: 86400, value: '86400'},
    ];
    public ipNetworkTrafficDirectionOptions: SelectKeyValueString[] = [
        {key: 'internal', value: this.TranslocoService.translate('internal')},
        {key: 'external', value: this.TranslocoService.translate('external')},
        {key: 'both', value: this.TranslocoService.translate('both')},
    ];
    public ipVersionOptions: SelectKeyValueString[] = [
        {key: '4', value: this.TranslocoService.translate('4')},
        {key: '6', value: this.TranslocoService.translate('6')},
    ];
    public ipViewATrafficDirectionOptions: SelectKeyValueString[] = [
        {key: 'internal', value: this.TranslocoService.translate('internal')},
        {key: 'external', value: this.TranslocoService.translate('external')},
    ];

    private cdr = inject(ChangeDetectorRef);

    private readonly IsarFlowSettingsService: IsarFlowSettingsService = inject(IsarFlowSettingsService);
    private readonly notyService = inject(NotyService);
    private readonly subscriptions = new Subscription();

    public ngOnInit(): void {
        this.loadIsarFlowSettings();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadIsarFlowSettings(): void {
        this.subscriptions.add(this.IsarFlowSettingsService.loadIsarFlowSettings()
            .subscribe((result) => {
                this.post = result.isarflowSettings;
                this.externalSystems = result.externalSystems;
                this.cdr.markForCheck();
            })
        );
    }

    public updateIsarFlowSettings(): void {
        if (!this.post) {
            return;
        }

        this.subscriptions.add(this.IsarFlowSettingsService.saveIsarFlowSettings(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as IsarFlowSettingsPost;

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

}

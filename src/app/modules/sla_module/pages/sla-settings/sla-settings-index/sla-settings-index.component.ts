import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { SlaSettingsService } from '../sla-settings.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { SlaSettingsIndexRoot, SlaSettingsPost } from '../SlaSettings.interface';
import { HistoryService } from '../../../../../history.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import {
    AlertComponent,
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
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import {
    TimeperiodDetailsTooltipComponent
} from '../../../components/timeperiod-details-tooltip/timeperiod-details-tooltip.component';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'oitc-sla-settings-index',
    standalone: true,
    imports: [
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,

        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        BackButtonDirective,
        CardBodyComponent,
        RequiredIconComponent,
        SelectComponent,
        FormErrorDirective,
        NgIf,
        FormFeedbackComponent,
        FormsModule,
        FormDirective,
        FormLabelDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TimeperiodDetailsTooltipComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        TrueFalseDirective,
        FormCheckLabelDirective,
        MultiSelectComponent,
        CardFooterComponent,
        DropdownComponent,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownItemDirective,
        FaStackComponent,
        FaStackItemSizeDirective,
        PermissionDirective,
        AsyncPipe,
        AlertComponent,
        MatSort,
        TableDirective,
        TooltipDirective,
    ],
    templateUrl: './sla-settings-index.component.html',
    styleUrl: './sla-settings-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaSettingsIndexComponent implements OnInit, OnDestroy {

    private readonly SlaSettingsService: SlaSettingsService = inject(SlaSettingsService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    public post: SlaSettingsPost = {} as SlaSettingsPost;

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.post = this.getDefaultPost();
    }

    private getDefaultPost(): SlaSettingsPost {
        return {
            max_age: 53
        };
    }

    public ngOnInit() {
        this.load();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        this.subscriptions.add(this.SlaSettingsService.submit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Data');
                    const msg = this.TranslocoService.translate('saved successfully');

                    this.notyService.genericSuccess(msg, title);

                    this.HistoryService.navigateWithFallback(['/sla_module/sla_settings/index']);
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

    private load(): void {
        this.subscriptions.add(this.SlaSettingsService.loadSlaSettings()
            .subscribe((result: SlaSettingsIndexRoot) => {
                this.post = result.sla_settings;
                this.cdr.markForCheck();
            }))
    }
}

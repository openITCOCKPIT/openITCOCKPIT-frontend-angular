import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { NgClass, NgIf } from '@angular/common';
import { DowntimereportsEnum } from '../downtimereports.enum';
import {
    DowntimeReportsRequest,
    DowntimeReportsResponse,
    getDefaultDowntimeReportsRequest
} from '../downtimereports.interface';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { TimeperiodsService } from '../../timeperiods/timeperiods.service';
import { TimeperiodIndex, TimeperiodsIndexParams } from '../../timeperiods/timeperiods.interface';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TrueFalseDirective } from '../../../directives/true-false.directive';

@Component({
    selector: 'oitc-downtimereports-index',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        CardFooterComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        NgIf,
        NgClass,
        FormFeedbackComponent,
        FormsModule,
        FormErrorDirective,
        FormControlDirective,
        RequiredIconComponent,
        FormLabelDirective,
        SelectComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        XsButtonDirective,
        TrueFalseDirective,
        BadgeComponent,
        TranslocoPipe
    ],
    templateUrl: './downtimereports-index.component.html',
    styleUrl: './downtimereports-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DowntimereportsIndexComponent implements OnInit, OnDestroy {
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly TimeperiodsService: TimeperiodsService = inject(TimeperiodsService);

    protected readonly DowntimereportsEnum = DowntimereportsEnum;
    protected readonly reportFormats: SelectKeyValue[] = [
        {value: 'PDF', key: 1},
        {value: 'HTML', key: 2}
    ];
    protected readonly reflectionStates: SelectKeyValue[] = [
        {value: this.TranslocoService.translate('soft and hard state'), key: 1},
        {value: this.TranslocoService.translate('only hard state'), key: 2}
    ];
    protected timeperiods: SelectKeyValue[] = [];
    protected selectedTab: DowntimereportsEnum = DowntimereportsEnum.Edit;
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected post: DowntimeReportsRequest = getDefaultDowntimeReportsRequest();
    protected dynamicColour: boolean = false;
    protected report?: DowntimeReportsResponse;

    public ngOnInit() {
        this.loadTimeperiods();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    protected submit(): void {
        console.log(this.post);
        this.report = {} as DowntimeReportsResponse;
    }

    private loadTimeperiods(): void {
        this.subscriptions.add(this.TimeperiodsService.getIndex({} as TimeperiodsIndexParams).subscribe(data => {
            this.timeperiods = [];
            data.all_timeperiods.forEach((element: TimeperiodIndex) => {
                this.timeperiods.push({
                    value: element.Timeperiod.name,
                    key: element.Timeperiod.id
                } as SelectKeyValue);
            });

            this.cdr.markForCheck();
        }));
    }

    protected changeTab(newTab: DowntimereportsEnum): void {
        this.selectedTab = newTab;
    }

}

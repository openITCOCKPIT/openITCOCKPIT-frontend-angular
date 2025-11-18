import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Timeperiod, TimeperiodAddResponse } from '../timeperiods.interface';
import { TimeperiodsService } from '../timeperiods.service';
import { WeekdaysService } from '../../../weekdays.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { FormWarningComponent } from '../../../layouts/coreui/form-warning/form-warning.component';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { NgClass } from '@angular/common';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { HistoryService } from '../../../history.service';
import { SelectKeyValue, SelectKeyValueString } from '../../../layouts/primeng/select.interface';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { sprintf } from 'sprintf-js';
import _ from 'lodash';

@Component({
    selector: 'oitc-timeperiods-add',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        FormWarningComponent,
        NgClass,
        RouterLink,
        InputGroupTextDirective,
        InputGroupComponent,
        NgSelectModule,
        NgOptionHighlightDirective,
        DebounceDirective,
        LabelLinkComponent
    ],
    templateUrl: './timeperiods-add.component.html',
    styleUrl: './timeperiods-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeperiodsAddComponent implements OnInit, OnDestroy {

    public post: Timeperiod = {
        container_id: null,
        name: '',
        calendar_id: null,
        timeperiod_timeranges: [],
        validate_timeranges: true,
        description: '',
    }

    public containers: SelectKeyValue[] = [];
    public calendars: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;

    private TimeperiodsService = inject(TimeperiodsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly WeekdaysService = inject(WeekdaysService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();
    public readonly weekdays: SelectKeyValueString[] = this.WeekdaysService.getWeekdays();
    public startPlaceholder = this.TranslocoService.translate('Start') + ' ' + this.TranslocoService.translate('(00:00)');
    public endPlaceholder = this.TranslocoService.translate('End') + ' ' + this.TranslocoService.translate('(24:00)');
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.subscriptions.add(this.TimeperiodsService.getAdd()
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadCalendars(searchString: string) {
        if (!this.post.container_id) {
            return;
        }
        this.subscriptions.add(this.TimeperiodsService.getCalendars(searchString, this.post.container_id)
            .subscribe((result) => {
                this.calendars = result;
                if (this.post.calendar_id) {
                    const key = _.findKey(this.calendars, {key: this.post.calendar_id});
                    if (!key) {
                        this.post.calendar_id = null;
                    }
                }
                this.cdr.markForCheck();
            })
        );
    }

    public addTimerange() {
        let count = this.post.timeperiod_timeranges.length;
        this.post.timeperiod_timeranges.push({
            id: count,
            day: '1',
            start: '',
            end: ''
        });

        this.cdr.markForCheck();
    }

    public removeTimerange(index: number) {
        this.post.timeperiod_timeranges.splice(index, 1);
        this.removeErrorIfExists(index, 'timeperiod_timeranges');
    }

    private removeErrorIfExists(index: number, errorKey: string) {
        if (this.errors) {
            if (this.errors.hasOwnProperty(errorKey) && this.errors[errorKey].hasOwnProperty(index)) {
                if (Array.isArray(this.errors[errorKey])) {
                    // CakePHP returns an array bacuase the index with the error starts at 0
                    this.errors[errorKey].splice(index, 1);
                } else {
                    // CakePHP returns an array bacuase the index with the error starts at is > 0
                    delete this.errors[errorKey][index];
                }
            }

            // Reduce all indexes > index by 1
            // If a user remove an element with error above other elements
            const newErrors: GenericValidationError = {};
            for (const key in this.errors[errorKey]) {
                let numericKey = Number(key);
                if (numericKey > index) {
                    numericKey = numericKey - 1;
                }
                if (!newErrors.hasOwnProperty(errorKey)) {
                    newErrors[errorKey] = {};
                }

                newErrors[errorKey][numericKey] = this.errors[errorKey][key];
            }

            this.errors[errorKey] = newErrors[errorKey];

            this.errors = structuredClone(this.errors); // get new reference to trigger change detection if signals
            this.cdr.markForCheck();
        }
    }


    public submit() {
        this.subscriptions.add(this.TimeperiodsService.createTimeperiod(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as TimeperiodAddResponse;

                    const title = this.TranslocoService.translate('Time period');
                    const msg = this.TranslocoService.translate('created successfully');

                    const url = ['timeperiods', 'edit', response.timeperiod.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/timeperiods/index']);

                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                    // add overlapping time ranges error if exists
                    if (this.errors.hasOwnProperty('validate_timeranges')) {
                        let timerangeOverlappingArray: string[] = [];
                        for (let index in this.errors['validate_timeranges']) {
                            if (this.errors) {
                                if (!this.errors.hasOwnProperty('timeperiod_timeranges')) {
                                    this.errors['timeperiod_timeranges'] = {};
                                }
                                for (const [key, value] of Object.entries(this.errors['validate_timeranges'][index])) {
                                    if (Array.isArray(value)) {
                                        for (let overlappingInfo of value) {
                                            timerangeOverlappingArray.push(
                                                sprintf(
                                                    '%s - %s',
                                                    overlappingInfo.start,
                                                    overlappingInfo.end
                                                )
                                            );
                                        }
                                    }
                                }
                                (this.errors['timeperiod_timeranges'] as any)[index.toString()] = {
                                    start: {
                                        overlapping: _.join(timerangeOverlappingArray, ', ')
                                    },
                                    end: {
                                        overlapping: this.TranslocoService.translate('Time period ranges overlap with existing time period ranges')
                                    }
                                };
                            }
                        }
                    }
                }
            }));
    }

    public onContainerIdChange() {
        this.loadCalendars('');
    }
}

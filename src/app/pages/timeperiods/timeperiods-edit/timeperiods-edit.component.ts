import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TimeperiodsService } from '../timeperiods.service';
import { Timeperiod } from '../timeperiods.interface';
import _ from 'lodash';
import { WeekdaysService } from '../../../weekdays.service';
import { BackButtonDirective } from '../../../directives/back-button.directive';
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormWarningComponent } from '../../../layouts/coreui/form-warning/form-warning.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { SelectKeyValue, SelectKeyValueString } from '../../../layouts/primeng/select.interface';
import { sprintf } from 'sprintf-js';

@Component({
    selector: 'oitc-timeperiods-edit',
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
        NgIf,
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
        FormLoaderComponent,
        ObjectUuidComponent
    ],
    templateUrl: './timeperiods-edit.component.html',
    styleUrl: './timeperiods-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeperiodsEditComponent implements OnInit, OnDestroy {
    private id: number = 0;
    public post!: Timeperiod;

    public containers: SelectKeyValue[] = [];
    public calendars: SelectKeyValue[] = [];

    private TimeperiodsService = inject(TimeperiodsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly WeekdaysService = inject(WeekdaysService);
    public errors: GenericValidationError = {} as GenericValidationError;
    private subscriptions: Subscription = new Subscription();
    public readonly weekdays: SelectKeyValueString[] = this.WeekdaysService.getWeekdays();
    public startPlaceholder = this.TranslocoService.translate('Start') + ' ' + this.TranslocoService.translate('(00:00)');
    public endPlaceholder = this.TranslocoService.translate('End') + ' ' + this.TranslocoService.translate('(24:00)');
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadContainers();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private load() {
        this.subscriptions.add(this.TimeperiodsService.getEdit(this.id).subscribe(result => {
            this.post = result.timeperiod;
            this.post.timeperiod_timeranges = _.orderBy(
                this.post.timeperiod_timeranges,
                ['day', 'start'],
                ['asc', 'asc']
            );
            this.loadCalendars('');
            this.cdr.markForCheck();
        }));
    }

    public loadContainers() {
        this.subscriptions.add(this.TimeperiodsService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
                this.load();
            })
        );
    };

    public loadCalendars(searchString: string) {
        if (!this.post?.container_id) {
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
        this.subscriptions.add(this.TimeperiodsService.updateTimeperiod(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Time period');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['timeperiods', 'edit', response.id];

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
            })
        );
    }

    public onContainerIdChange() {
        this.loadCalendars('');
    }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TimeperiodsService } from '../timeperiods.service';
import { InternalRange, Timeperiod } from '../timeperiods.interface';
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
import { NgClass, NgForOf, NgIf } from '@angular/common';
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
        NgForOf,
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

    public post!: Timeperiod;

    public containers: SelectKeyValue[] = [];

    public timeperiod: { ranges: InternalRange[] } = {
        ranges: []
    };

    public calendars: SelectKeyValue[] = [];

    private router: Router = inject(Router);
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
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.TimeperiodsService.getEdit(id).subscribe(data => {
            this.init(data.timeperiod);
            this.cdr.markForCheck();
        }));
        this.loadContainer();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private init(timeperiod: Timeperiod) {
        this.post = timeperiod;

        this.timeperiod.ranges = [];

        for (let key in this.post.timeperiod_timeranges) {
            this.timeperiod.ranges.push({
                id: <number>this.post.timeperiod_timeranges[key].id,
                day: this.post.timeperiod_timeranges[key].day,
                start: this.post.timeperiod_timeranges[key].start,
                end: this.post.timeperiod_timeranges[key].end,
                index: Number(key)
            });
        }

        this.timeperiod.ranges = _(this.timeperiod.ranges)
            .chain()
            .flatten()
            .sortBy(
                function (range) {
                    return [range.day, range.start];
                })
            .value();

        this.convertContainerIdEmptyValue();
        this.onContainerIdChange();

    }

    public loadContainer() {
        this.subscriptions.add(this.TimeperiodsService.getContainers()
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    };

    public trackByIndex(index: number, item: any): number {
        return index;
    }

    public loadCalendars(searchString: string) {
        this.subscriptions.add(this.TimeperiodsService.getCalendars(searchString, this.post.container_id)
            .subscribe((result) => {
                this.calendars = result;
                this.cdr.markForCheck();
            })
        );
    }

    public removeTimerange(rangeIndex: any) {
        let timeperiodranges = [];
        for (let i in this.timeperiod.ranges) {
            if (this.timeperiod.ranges[i]['index'] !== rangeIndex) {
                timeperiodranges.push(this.timeperiod.ranges[i])
            }
        }
        if (this.errors && (typeof this.errors['validate_timeranges'] !== 'undefined' ||
            typeof this.errors['timeperiod_timeranges'] !== 'undefined')) {
            this.timeperiod.ranges = timeperiodranges;
        } else {
            this.timeperiod.ranges = _(timeperiodranges)
                .chain()
                .flatten()
                .sortBy(
                    function (range) {
                        return [range.day, range.start];
                    })
                .value();
        }
        this.cdr.markForCheck();
    };

    public addTimerange() {
        this.timeperiod.ranges.push({
            id: null,
            day: '1',
            start: '',
            end: '',
            index: Object.keys(this.timeperiod.ranges).length
        });

        if (this.errors && (typeof this.errors['validate_timeranges'] !== 'undefined' ||
            typeof this.errors['timeperiod_timeranges'] !== 'undefined')) {
            this.timeperiod.ranges = this.timeperiod.ranges;
        } else {
            this.timeperiod.ranges = _(this.timeperiod.ranges)
                .chain()
                .flatten()
                .sortBy(
                    function (range) {
                        return [range.day, range.start];
                    })
                .value();
        }
        this.cdr.markForCheck();
    }

    public hasTimeRange(errors: any, range: any) {
        if (errors && errors['validate_timeranges']) {
            errors = errors['validate_timeranges'];
            if (errors[parseInt(range['day'])] && errors[parseInt(range['day'])]['state-error']) {
                const stateErrors = errors[parseInt(range['day'])]['state-error'];
                for (let i in stateErrors) {
                    if (stateErrors[i]['start'] === range['start'] && stateErrors[i]['end'] === range['end']) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    public saveTimeperiod() {

        let index = 0;
        this.post.timeperiod_timeranges = [];
        for (let i in this.timeperiod.ranges) {
            this.post.timeperiod_timeranges[index] = {
                'id': this.timeperiod.ranges[i].id,
                'day': this.timeperiod.ranges[i].day,
                'start': this.timeperiod.ranges[i].start,
                'end': this.timeperiod.ranges[i].end
            };
            index++;
        }

        this.convertContainerIdEmptyValue();

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
                    this.convertContainerIdEmptyValue();
                    this.errors = errorResponse;
                }
            })
        );
    }

    public onContainerIdChange() {
        this.loadCalendars('');
    }

    public getTimeperiodTimeranges(index: number, keyName: string): string[] {
        if (this.errors && this.errors['timeperiod_timeranges'] && this.errors['timeperiod_timeranges'][index]) {
            let timeranges = <any>this.errors['timeperiod_timeranges'][index];
            if (timeranges && timeranges[keyName]) {
                return Object.keys(timeranges[keyName]).map((key) => timeranges[keyName][key]);
            }
            return [];
        } else {
            return [];
        }

    }

    // Empty value will be saved as 0 but it does not show the placeholder in the select
    private convertContainerIdEmptyValue() {
        this.cdr.markForCheck();
        if (this.post.calendar_id === 0) {
            this.post.calendar_id = null;
        } else if (this.post.calendar_id === null) {
            this.post.calendar_id = 0;
        }

    }

}

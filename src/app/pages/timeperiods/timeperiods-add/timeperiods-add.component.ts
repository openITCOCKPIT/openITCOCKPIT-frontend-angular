import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Calendar, Container, InternalRange, Timeperiod, TimeperiodAddResponse } from '../timeperiods.interface';
import { TimeperiodsService } from '../timeperiods.service';
import _ from 'lodash';
import { WeekdaysService } from '../../../weekdays.service';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
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
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { FormWarningComponent } from '../../../layouts/coreui/form-warning/form-warning.component';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-timeperiods-add',
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
        NgOptionHighlightModule,
        DebounceDirective
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

    public containers: Container[] = [];

    public timeperiod: { ranges: InternalRange[] } = {
        ranges: []
    };

    public calendars: Calendar[] = [];

    public errors: GenericValidationError | null = null;

    private TimeperiodsService = inject(TimeperiodsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly WeekdaysService = inject(WeekdaysService);
    private router = inject(Router);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();
    public readonly weekdays: { key: string, value: string }[] = this.WeekdaysService.getWeekdays();
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

    public addTimerange() {
        let count = this.timeperiod.ranges.length + 1;

        this.timeperiod.ranges.push({
            id: count,
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
                'day': this.timeperiod.ranges[i].day,
                'start': this.timeperiod.ranges[i].start,
                'end': this.timeperiod.ranges[i].end
            };
            index++;
        }

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


}

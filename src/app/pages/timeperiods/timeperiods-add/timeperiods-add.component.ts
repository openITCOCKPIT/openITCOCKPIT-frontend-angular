import { Component, inject } from '@angular/core';
import {
    AlertComponent,
    AlertHeadingDirective,
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CodeMirrorContainerComponent
} from '../../../components/code-mirror-container/code-mirror-container.component';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { UserMacrosModalComponent } from '../../commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Container, InternalRange, TimeperiodPost } from '../timeperiods.interface';
import { TimeperiodsService } from '../timeperiods.service';
import _ from 'lodash';
import { FormWarningComponent } from '../../../layouts/coreui/form-warning/form-warning.component';
import { WeekdaysService } from '../../../weekdays.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

@Component({
    selector: 'oitc-timeperiods-add',
    standalone: true,
    imports: [
        AlertComponent,
        AlertHeadingDirective,
        BackButtonDirective,
        ButtonCloseDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CodeMirrorContainerComponent,
        CoreuiComponent,
        FaIconComponent,
        FormCheckComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormSelectDirective,
        FormTextDirective,
        FormsModule,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        TranslocoPipe,
        UserMacrosModalComponent,
        XsButtonDirective,
        FormWarningComponent,
        NgClass,
        KeyValuePipe,
        RouterLink,
        InputGroupTextDirective,
        InputGroupComponent,
        ColComponent,
        NgSelectModule,
        NgOptionHighlightModule
    ],
    templateUrl: './timeperiods-add.component.html',
    styleUrl: './timeperiods-add.component.css'
})
export class TimeperiodsAddComponent {

    public post: TimeperiodPost = {
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

    public calendars: any[] = [];

    public errors: GenericValidationError | null = null;

    private TimeperiodsService = inject(TimeperiodsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly WeekdaysService = inject(WeekdaysService);
    private router = inject(Router);

    private subscriptions: Subscription = new Subscription();
    public readonly weekdays: { key: string, value: string }[] = this.WeekdaysService.getWeekdays();
    public startPlaceholder = this.TranslocoService.translate('Start') + ' ' + this.TranslocoService.translate('00:00');
    public endPlaceholder = this.TranslocoService.translate('End') + ' ' + this.TranslocoService.translate('24:00');


    public ngOnInit() {
        this.subscriptions.add(this.TimeperiodsService.getAdd()
            .subscribe((result) => {
                this.containers = result;
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    trackByIndex(index: number, item: any): number {
        return index;
    }

    public loadCalendars(searchString: string) {
        this.subscriptions.add(this.TimeperiodsService.getCalendars(searchString, this.post.container_id)
            .subscribe((result) => {
                this.calendars = result;
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
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Time period');
                    const msg = this.TranslocoService.translate('created successfully');
                    // @ts-ignore
                    const url = ['timeperiods', 'edit', response.timeperiod.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.router.navigate(['/timeperiods/index']);

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

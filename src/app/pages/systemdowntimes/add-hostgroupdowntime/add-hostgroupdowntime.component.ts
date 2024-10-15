import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
    FormLabelDirective,
    InputGroupComponent,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectKeyValueWithDisabled } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { SystemdowntimesGet, SystemdowntimesPost } from '../systemdowntimes.interface';
import { HostgroupsLoadHostgroupsByStringParams } from '../../hostgroups/hostgroups.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { HostgroupsService } from '../../hostgroups/hostgroups.service';
import { SystemdowntimesService } from '../systemdowntimes.service';
import { JsonPipe, NgIf } from '@angular/common';
import { ObjectTypesEnum } from '../../changelogs/object-types.enum';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import _ from 'lodash';
import { DurationInputComponent } from '../../../layouts/coreui/duration-input/duration-input.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-add-hostgroupdowntime',
    standalone: true,
    imports: [
        CardComponent,
        CoreuiComponent,
        FaIconComponent,
        FormDirective,
        FormsModule,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        BackButtonDirective,
        CardBodyComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        InputGroupComponent,
        MultiSelectComponent,
        RequiredIconComponent,
        JsonPipe,
        FormCheckComponent,
        FormCheckLabelDirective,
        FormCheckInputDirective,
        FormControlDirective,
        TrueFalseDirective,
        CardFooterComponent,
        NgIf,
        DurationInputComponent
    ],
    templateUrl: './add-hostgroupdowntime.component.html',
    styleUrl: './add-hostgroupdowntime.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddHostgroupdowntimeComponent implements OnInit, OnDestroy {
    public hostgroups: SelectKeyValueWithDisabled[] = [];
    public errors: GenericValidationError | null = null;
    public post: SystemdowntimesPost = this.getClearForm();
    public get!: SystemdowntimesGet;
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HostgroupsService = inject(HostgroupsService);
    private readonly SystemdowntimesService = inject(SystemdowntimesService);
    private subscriptions: Subscription = new Subscription();
    public createAnother: boolean = false;
    public weekdays = {
        1: this.TranslocoService.translate('Monday'),
        2: this.TranslocoService.translate('Tuesday'),
        3: this.TranslocoService.translate('Wednesday'),
        4: this.TranslocoService.translate('Thursday'),
        5: this.TranslocoService.translate('Friday'),
        6: this.TranslocoService.translate('Saturday'),
        7: this.TranslocoService.translate('Sunday')
    };
    public weekdaysForSelect: any[] = [];
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.weekdaysForSelect = this.getWeekdays();
        this.subscriptions.add(this.SystemdowntimesService.loadDefaults()
            .subscribe((result) => {
                let fromDate = this.parseDateTime(result.defaultValues.js_from);
                let toDate = this.parseDateTime(result.defaultValues.js_to);
                this.post.from_date = fromDate;
                this.post.from_time = result.defaultValues.from_time;
                this.post.to_date = toDate;
                this.post.to_time = result.defaultValues.to_time;
                this.post.comment = result.defaultValues.comment;
                this.post.duration = result.defaultValues.duration;
                this.post.downtimetype_id = result.defaultValues.downtimetype_id;
                this.cdr.markForCheck();
            }));
        this.loadHostgroups('');

    }

    public getWeekdays() {
        return _.map(
            this.weekdays,
            (value, key) => {
                return {key: key, value: value}
            }
        );
    }


    public getClearForm(): SystemdowntimesPost {
        return {
            is_recurring: 0,
            weekdays: [],
            day_of_month: '',
            from_date: '',
            from_time: '',
            to_date: '',
            to_time: '',
            duration: 15,
            downtime_type: 'hostgroup',
            downtimetype_id: '0',
            objecttype_id: ObjectTypesEnum['HOSTGROUP'],
            object_id: [],
            comment: '',
            is_recursive: 0
        };
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadHostgroups = (searchString: string) => {
        let selected: number[] = [];
        if (this.post.object_id) {
            selected = this.post.object_id;
        }
        let params: HostgroupsLoadHostgroupsByStringParams = {
            angular: true,
            'filter[Containers.name]': searchString,
            'selected[]': selected
        }

        this.subscriptions.add(this.HostgroupsService.loadHostgroupsByString(params)
            .subscribe((result) => {
                this.hostgroups = result;
                this.cdr.markForCheck();
            })
        );
    }

    private parseDateTime = function (jsStringData: string) {
        let splitData = jsStringData.split(',');
        return splitData[0].trim() + '-' + splitData[1].trim() + '-' + splitData[2].trim();
    }

    public submit() {
        this.subscriptions.add(this.SystemdowntimesService.createHostgroupdowntime(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const title = this.TranslocoService.translate('Downtime');
                    const msg = this.TranslocoService.translate('created successfully');

                    this.notyService.genericSuccess(msg, title);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/downtimes/host']);
                    }
                    // Create another
                    this.post = this.getClearForm();
                    this.errors = null;
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();
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
}

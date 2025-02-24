import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink, Router } from '@angular/router';
import {
    BadgeComponent, ButtonDirective,
    CalloutComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    DropdownComponent, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective, FormTextDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { SelectKeyValue, SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { AutoreportsService } from '../autoreports.service';
import {
    AutoreportPost,
    CalendarParams,
    getDefaultPost,
    getDefaultCalendarParams
} from '../autoreports.interface';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { formatDate, NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { TimeperiodsService } from '../../../../../pages/timeperiods/timeperiods.service';
import { UsersService } from '../../../../../pages/users/users.service';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NotyService } from '../../../../../layouts/coreui/noty.service';

@Component({
  selector: 'oitc-autoreport-add-step-one',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormDirective,
        FormsModule,
        CardBodyComponent,
        TranslocoPipe,
        BadgeComponent,
        RowComponent,
        ColComponent,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NgIf,
        RequiredIconComponent,
        SelectComponent,
        FormControlDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        TrueFalseDirective,
        LabelLinkComponent,
        CalloutComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        DropdownComponent,
        ButtonDirective,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownItemDirective,
        DebounceDirective,
        MultiSelectComponent,
    ],
  templateUrl: './autoreport-add-step-one.component.html',
  styleUrl: './../../../assets/autoreport.css', //'./autoreport-add-step-one.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportAddStepOneComponent implements OnInit, OnDestroy {

    private cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();
    private readonly AutoreportsService: AutoreportsService = inject(AutoreportsService);
    private readonly TimeperiodsService: TimeperiodsService = inject(TimeperiodsService);
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly router = inject(Router);

    public errors: GenericValidationError | null = null;
    public containers: SelectKeyValue[] = [];
    public calendars: SelectKeyValue[] = [];
    public timeperiods: SelectKeyValue[] = [];
    public users: SelectKeyValue[] = [];
    public post: AutoreportPost = getDefaultPost();
    protected calendarParams: CalendarParams = getDefaultCalendarParams();
    public setMinAvailability : boolean = false;
    public setMaxNumberOfOutages : boolean = false;
    public evalutionperiods: SelectKeyValueString[] = [
        {key: 'YEAR', value: this.TranslocoService.translate('Year')},
        {key: 'QUARTER', value: this.TranslocoService.translate('Quarter')},
        {key: 'MONTH', value: this.TranslocoService.translate('Month')},
        {key: 'WEEK', value: this.TranslocoService.translate('Week')},
        {key: 'DAY', value: this.TranslocoService.translate('Day')}
    ];
    public sendintervals: SelectKeyValueString[] = [
        {key: 'NEVER', value: this.TranslocoService.translate('never')},
        {key: 'YEAR', value: this.TranslocoService.translate('yearly')},
        {key: 'QUARTER', value: this.TranslocoService.translate('quarterly')},
        {key: 'MONTH', value: this.TranslocoService.translate('monthly')},
        {key: 'WEEK', value: this.TranslocoService.translate('weekly')},
        {key: 'DAY', value: this.TranslocoService.translate('daily')}
    ];
    public graphoptions: SelectKeyValue[] = [
        {key: 0, value: this.TranslocoService.translate('in %')},
        {key: 1, value: this.TranslocoService.translate('in h')}
    ];
    public checkstates: SelectKeyValue[] = [
        {key: 0, value: this.TranslocoService.translate('soft and hard state')},
        {key: 1, value: this.TranslocoService.translate('only hard state')}
    ];


    public ngOnInit(): void {
        this.loadContainers();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private loadContainers() {
        this.subscriptions.add(this.AutoreportsService.loadContainers().subscribe((result) => {
            this.containers = result;
            this.cdr.markForCheck();
        }));
    }

    public onContainerChange() {
        this.loadTimeperiods();
        this.loadCalendars();
        this.loadUsers();
        this.cdr.markForCheck();
    }

    public onAvailabilityChange($event: boolean) {
        if(!$event ) {
            this.post.Autoreport.min_availability = null;
        }
    }

    public onOutageChange($event: boolean) {
        if(!$event ) {
            this.post.Autoreport.max_number_of_outages = null;
            this.cdr.markForCheck();
        }
    }

    public onHolidayChange($event: any) {
        if($event === 0 && this.post.Autoreport.calendar_id !== null){
            this.post.Autoreport.calendar_id = null;
            this.cdr.markForCheck();
        }
    }

    public onStartChange($event: any) {
        if($event === 0){
            this.post.Autoreport.report_start_date = null;
            this.cdr.markForCheck();
        }
    }

    private loadTimeperiods() {
        if(this.post.Autoreport.container_id === null){
            return;
        }
        this.subscriptions.add(this.TimeperiodsService.loadTimeperiodsByContainerId(this.post.Autoreport.container_id).subscribe((result) => {
            this.timeperiods = result;
            this.cdr.markForCheck();
        }));
    }

    private loadCalendars() {
        if(this.post.Autoreport.container_id === null){
            return;
        }
        this.calendarParams.containerId = this.post.Autoreport.container_id;
        this.subscriptions.add(this.AutoreportsService.loadCalendars(this.calendarParams).subscribe((result) => {
            this.calendars = result;
            this.cdr.markForCheck();
        }));
    }

    private loadUsers() {
        if(this.post.Autoreport.container_id === null){
            return;
        }
        this.subscriptions.add(this.UsersService.loadUsersByContainerId(this.post.Autoreport.container_id, this.post.Autoreport.users._ids).subscribe((result) => {
            this.users = result;
            this.cdr.markForCheck();
        }));
    }

    public submitStepOne() {
        this.errors = null;
        if(this.post.Autoreport.report_start_date !== null){
            this.post.Autoreport.report_start_date = formatDate(this.post.Autoreport.report_start_date, 'dd.MM.y', 'en-US');
        }
        this.subscriptions.add(this.AutoreportsService.setAddStepOne(this.post).subscribe((result: GenericResponseWrapper): void => {
                if (result.success) {
                    this.errors = null;
                    this.router.navigate(['/autoreport_module/autoreports/addStepTwo', result.data.autoreport.id]);
                } else {
                    this.errors = result.data as GenericValidationError;
                    this.notyService.genericError();
                }
                this.cdr.markForCheck();
            })
        );
    }
}

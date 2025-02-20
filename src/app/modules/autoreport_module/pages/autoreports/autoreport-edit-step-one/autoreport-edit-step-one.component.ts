import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
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
    getDefaultCalendarParams,
    getDefaultPost
} from '../autoreports.interface';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgIf, formatDate } from '@angular/common';
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
  selector: 'oitc-autoreport-edit-step-one',
    imports: [
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
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
    ],
  templateUrl: './autoreport-edit-step-one.component.html',
  styleUrl: './autoreport-edit-step-one.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportEditStepOneComponent implements OnInit, OnDestroy {

    private cdr = inject(ChangeDetectorRef);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private subscriptions: Subscription = new Subscription();
    private readonly AutoreportsService: AutoreportsService = inject(AutoreportsService);
    private readonly TimeperiodsService: TimeperiodsService = inject(TimeperiodsService);
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);

    public init:boolean = false;
    public id: number = 0;
    public post: AutoreportPost = getDefaultPost() ;
    public errors: GenericValidationError | null = null;
    public containers: SelectKeyValue[] = [];
    public calendars: SelectKeyValue[] = [];
    public timeperiods: SelectKeyValue[] = [];
    public users: SelectKeyValue[] = [];
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
    public graphoptions: SelectKeyValueString[] = [
        {key: '0', value: this.TranslocoService.translate('in %')},
        {key: '1', value: this.TranslocoService.translate('in h')}
    ];
    public checkstates: SelectKeyValueString[] = [
        {key: '0', value: this.TranslocoService.translate('soft and hard state')},
        {key: '1', value: this.TranslocoService.translate('only hard state')}
    ];

    public ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadAutoreport();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
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

    private loadContainers() {
        this.subscriptions.add(this.AutoreportsService.loadContainers().subscribe((result) => {
            this.containers = result;
            this.cdr.markForCheck();
        }));
    }

    public loadAutoreport() {
        this.subscriptions.add(this.AutoreportsService.getEditStepOne(this.id).subscribe((result) => {

            this.post.Autoreport = result;

            if(this.post.Autoreport.report_start_date !== null){
                this.post.Autoreport.report_start_date = formatDate(this.post.Autoreport.report_start_date, 'yyyy-dd-MM', 'en-US');
            }


            //think itis an issue that calendar_id comes with 0 an d not null whenn not set
            if(this.post.Autoreport.calendar_id === 0){
                this.post.Autoreport.calendar_id = null;
            }

            if(this.post.Autoreport.min_availability){
                this.setMinAvailability = true;
            }

            if(this.post.Autoreport.max_number_of_outages !== null && this.post.Autoreport.max_number_of_outages >= 0 ){
                this.setMaxNumberOfOutages = true;
            }

            this.loadContainers();
            if(!this.init) {
                this.loadTimeperiods();
                this.loadCalendars();
                this.loadUsers();
            }
            this.init = true;
            this.cdr.markForCheck();
        }));
    }

    public submitStepOne() {
        this.errors = null;
        if(this.post.Autoreport.report_start_date !== null){
            this.post.Autoreport.report_start_date = formatDate(this.post.Autoreport.report_start_date, 'dd.MM.y', 'en-US');
        }
        this.subscriptions.add(this.AutoreportsService.setEditStepOne(this.id, this.post).subscribe((result: GenericResponseWrapper): void => {
                    if (result.success) {
                        this.errors = null;
                        this.router.navigate(['/autoreport_module/autoreports/editStepTwo', result.data.autoreport.id]);
                    } else {
                        this.errors = result.data as GenericValidationError;
                        this.notyService.genericError();
                    }

                    this.cdr.markForCheck();
                }
            )
        );
    }

}

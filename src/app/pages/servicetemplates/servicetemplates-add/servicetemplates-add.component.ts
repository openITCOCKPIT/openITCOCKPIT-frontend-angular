import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    ServicetemplateContainerResult,
    ServicetemplatePost,
    ServicetemplateTypeResult,
} from '../../servicetemplates/servicetemplates.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { ServicetemplateTypesEnum } from '../../servicetemplates/servicetemplate-types.enum';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ObjectTypesEnum } from '../../changelogs/object-types.enum';
import { ServicetemplatesService } from '../servicetemplates.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    AlertComponent,
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
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CheckAttemptsInputComponent
} from '../../../layouts/coreui/check-attempts-input/check-attempts-input.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { HumanTimeComponent } from '../../../layouts/coreui/interval-input/human-time/human-time.component';
import { IntervalInputComponent } from '../../../layouts/coreui/interval-input/interval-input.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { MacrosComponent } from '../../../components/macros/macros.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { PriorityComponent } from '../../../layouts/coreui/priority/priority.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { HostOrServiceType } from '../../hosts/hosts.interface';
import { HistoryService } from '../../../history.service';


@Component({
    selector: 'oitc-servicetemplates-add',
    imports: [
    AlertComponent,
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    CheckAttemptsInputComponent,
    FaIconComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    HumanTimeComponent,
    IntervalInputComponent,
    LabelLinkComponent,
    MacrosComponent,
    MultiSelectComponent,
    NavComponent,
    NavItemComponent,
    NgSelectModule,
    PaginatorModule,
    PermissionDirective,
    PriorityComponent,
    RequiredIconComponent,
    SelectComponent,
    TranslocoDirective,
    TrueFalseDirective,
    XsButtonDirective,
    RouterLink,
    NgClass,
    TranslocoPipe,
    AsyncPipe
],
    templateUrl: './servicetemplates-add.component.html',
    styleUrl: './servicetemplates-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicetemplatesAddComponent implements OnInit, OnDestroy {
    public servicetemplateTypes: ServicetemplateTypeResult[] = [];
    public containers: ServicetemplateContainerResult | undefined;
    public commands: SelectKeyValue[] = [];
    public eventhandlerCommands: SelectKeyValue[] = [];
    public tagsForSelect: string[] = [];
    public post: ServicetemplatePost = {} as ServicetemplatePost;
    public typeDetails: HostOrServiceType | undefined;

    public timeperiods: SelectKeyValue[] = [];
    public checkperiods: SelectKeyValue[] = [];
    public contacts: SelectKeyValue[] = [];
    public contactgroups: SelectKeyValue[] = [];
    public servicegroups: SelectKeyValue[] = [];

    public errors: GenericValidationError | null = null;
    public hasMacroErrors: boolean = false;

    public createAnother: boolean = false;

    private servicetemplateTypeId = ServicetemplateTypesEnum.GENERIC_SERVICE;
    private readonly ServicetemplatesService = inject(ServicetemplatesService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private router: Router = inject(Router);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            let servicetemplatetype_id = params['servicetemplatetype_id'];
            let servicetemplateTypeId = params['servicetemplateTypeId'] || servicetemplatetype_id;
            if (servicetemplateTypeId === undefined) {
                servicetemplateTypeId = ServicetemplateTypesEnum.GENERIC_SERVICE
            }
            this.servicetemplateTypeId = Number(servicetemplateTypeId);

            //Fire on page load
            this.loadContainers();
            this.loadCommands();
            this.loadServicetemplateTypes();

            this.post = this.getDefaultPost(this.servicetemplateTypeId);
            this.cdr.markForCheck();
        });

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getDefaultPost(servicetemplateTypeId: number): ServicetemplatePost {
        this.tagsForSelect = [];

        return {
            name: '',
            template_name: '',
            description: '',
            command_id: 0,
            eventhandler_command_id: 0,
            check_interval: 60,
            retry_interval: 60,
            max_check_attempts: 3,
            first_notification_delay: 0,
            notification_interval: 7200,
            notify_on_recovery: 1,
            notify_on_warning: 1,
            notify_on_critical: 1,
            notify_on_unknown: 1,
            notify_on_flapping: 0,
            notify_on_downtime: 0,
            flap_detection_enabled: 0,
            flap_detection_on_ok: 0,
            flap_detection_on_warning: 0,
            flap_detection_on_critical: 0,
            flap_detection_on_unknown: 0,
            low_flap_threshold: 0,
            high_flap_threshold: 0,
            process_performance_data: 1,
            freshness_threshold: 3600,
            passive_checks_enabled: 1,
            event_handler_enabled: 0,
            active_checks_enabled: 1,
            retain_status_information: 0,
            retain_nonstatus_information: 0,
            notifications_enabled: 1,
            notes: '',
            priority: 1,
            check_period_id: 0,
            notify_period_id: 0,
            tags: '',
            container_id: 0,
            service_url: '',
            is_volatile: 0,
            freshness_checks_enabled: 0,
            servicetemplatetype_id: servicetemplateTypeId,
            contacts: {
                _ids: []
            },
            contactgroups: {
                _ids: []
            },
            servicegroups: {
                _ids: []
            },
            customvariables: [],
            servicetemplatecommandargumentvalues: [],
            servicetemplateeventcommandargumentvalues: [],
            sla_relevant: 1
        };
    }

    public loadContainers() {
        this.subscriptions.add(this.ServicetemplatesService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    }

    public loadCommands() {
        this.subscriptions.add(this.ServicetemplatesService.loadCommands()
            .subscribe((result) => {
                this.commands = result.commands;
                this.eventhandlerCommands = result.eventhandlerCommands;
                this.cdr.markForCheck();
            })
        );
    }

    public loadServicetemplateTypes() {
        this.subscriptions.add(this.ServicetemplatesService.loadServicetemplateTypes()
            .subscribe((result) => {
                this.servicetemplateTypes = result;
                this.setDetailsForType();
                this.cdr.markForCheck();
            })
        );
    }

    private setDetailsForType() {
        this.typeDetails = this.servicetemplateTypes.find(type => type.key === this.post.servicetemplatetype_id)?.value;
        this.cdr.markForCheck();
    };

    private loadElements() {
        const containerId = this.post.container_id;

        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.ServicetemplatesService.loadElements(containerId)
            .subscribe((result) => {
                this.timeperiods = result.timeperiods;
                this.checkperiods = result.checkperiods;
                this.contacts = result.contacts;
                this.contactgroups = result.contactgroups;
                this.servicegroups = result.servicegroups;
                this.cdr.markForCheck();
            })
        );

    }

    private loadCommandArguments() {
        const commandId = this.post.command_id;

        if (!commandId) {
            return;
        }

        this.subscriptions.add(this.ServicetemplatesService.loadCommandArguments(commandId)
            .subscribe((result) => {
                this.post.servicetemplatecommandargumentvalues = result;
                this.cdr.markForCheck();
            })
        );

    }

    private loadEventHandlerCommandArguments() {
        const eventHandlerCommandId = this.post.eventhandler_command_id;

        if (!eventHandlerCommandId) {
            //"None" selected
            this.post.servicetemplateeventcommandargumentvalues = [];
            this.cdr.markForCheck();

            return;
        }

        this.subscriptions.add(this.ServicetemplatesService.loadEventHandlerCommandArguments(eventHandlerCommandId)
            .subscribe((result) => {
                this.post.servicetemplateeventcommandargumentvalues = result;
                this.cdr.markForCheck();

            })
        );

    }

    public onContainerChange() {
        this.loadElements();
    }

    public onTypeChange() {
        this.setDetailsForType();
    }

    public onCommandChange() {
        this.loadCommandArguments();
    }

    public onEventHandlerChange() {
        this.loadEventHandlerCommandArguments();
    }

    /*******************
     * MACRO functions *
     *******************/
    public addMacro() {
        this.post.customvariables.push({
            name: '',
            objecttype_id: ObjectTypesEnum["SERVICETEMPLATE"],
            password: 0,
            value: '',
        });
        this.cdr.markForCheck();

    }

    protected deleteMacro = (index: number) => {
        this.post.customvariables.splice(index, 1);
        this.cdr.markForCheck();

    }

    public submit() {
        this.post.tags = this.tagsForSelect.join(',');


        this.subscriptions.add(this.ServicetemplatesService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();

                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Service template');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['servicetemplates', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/servicetemplates/index']);
                        return;
                    }
                    this.post = this.getDefaultPost(this.servicetemplateTypeId);
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();
                    this.errors = null;
                    this.hasMacroErrors = false;
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;

                    this.hasMacroErrors = false;
                    if (this.errors.hasOwnProperty('customvariables')) {
                        if (typeof (this.errors['customvariables']['custom']) === "string") {
                            this.hasMacroErrors = true;
                        }
                    }
                }
            }))

    }
}

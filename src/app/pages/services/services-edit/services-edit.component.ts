import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
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
    InputGroupComponent,
    InputGroupTextDirective,
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
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { PriorityComponent } from '../../../layouts/coreui/priority/priority.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TemplateDiffBtnComponent } from '../../../components/template-diff-btn/template-diff-btn.component';
import { TemplateDiffComponent } from '../../../components/template-diff/template-diff.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { UiBlockerComponent } from '../../../components/ui-blocker/ui-blocker.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import {
    ServiceInheritedContactsAndContactgroups,
    ServiceInheritedContactsAndContactgroupsWithId,
    ServicePost
} from '../services.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { ServicetemplatePost } from '../../servicetemplates/servicetemplates.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { ObjectTypesEnum } from '../../changelogs/object-types.enum';
import { HostsService } from '../../hosts/hosts.service';
import { ServicesService } from '../services.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { HostEntity, HostOrServiceType } from '../../hosts/hosts.interface';
import { FakeSelectComponent } from '../../../layouts/coreui/fake-select/fake-select.component';
import { ServiceTypesEnum } from '../services.enum';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';


@Component({
    selector: 'oitc-services-edit',
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
        InputGroupComponent,
        InputGroupTextDirective,
        IntervalInputComponent,
        LabelLinkComponent,
        MacrosComponent,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NgSelectModule,
        PermissionDirective,
        PriorityComponent,
        RequiredIconComponent,
        SelectComponent,
        TemplateDiffBtnComponent,
        TemplateDiffComponent,
        TranslocoDirective,
        TrueFalseDirective,
        UiBlockerComponent,
        XsButtonDirective,
        RouterLink,
        ObjectUuidComponent,
        NgClass,
        FakeSelectComponent,
        FormLoaderComponent,
        TranslocoPipe,
        AsyncPipe
    ],
    templateUrl: './services-edit.component.html',
    styleUrl: './services-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesEditComponent {
    public host?: HostEntity;
    public commands: SelectKeyValue[] = [];
    public eventhandlerCommands: SelectKeyValue[] = [];
    public tagsForSelect: string[] = [];
    public post!: ServicePost;

    public serviceType?: HostOrServiceType;

    public inheritedContactsAndContactgroups: ServiceInheritedContactsAndContactgroups = {} as ServiceInheritedContactsAndContactgroups;
    public servicetemplateContactsAndContactgroups: ServiceInheritedContactsAndContactgroupsWithId = {} as ServiceInheritedContactsAndContactgroupsWithId;
    public hostContactsAndContactgroups: ServiceInheritedContactsAndContactgroupsWithId = {} as ServiceInheritedContactsAndContactgroupsWithId;
    public hosttemplateContactsAndContactgroups: ServiceInheritedContactsAndContactgroupsWithId = {} as ServiceInheritedContactsAndContactgroupsWithId;

    public data = {
        isServicenameInUse: false,
        disableInheritance: false,
        areContactsInheritedFromHosttemplate: false,
        areContactsInheritedFromHost: false,
        areContactsInheritedFromServicetemplate: false,
    };
    public servicenameCheckedForDuplicates: string = '';

    public servicetemplates: SelectKeyValue[] = [];
    public servicegroups: SelectKeyValue[] = [];
    public timeperiods: SelectKeyValue[] = [];
    public checkperiods: SelectKeyValue[] = [];
    public contacts: SelectKeyValue[] = [];
    public contactgroups: SelectKeyValue[] = [];
    public existingServices: Record<number, string> = {};
    public isSlaHost: boolean = false;

    public errors: GenericValidationError | null = null;
    public hasMacroErrors: boolean = false;

    protected servicetemplate?: ServicetemplatePost;

    private readonly HostsService = inject(HostsService);
    private readonly ServicesService = inject(ServicesService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private router: Router = inject(Router);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.subscriptions.add(this.ServicesService.getEdit(id)
                .subscribe((result) => {
                    this.cdr.markForCheck();
                    this.post = result.service.Service;
                    this.host = result.host.Host;
                    this.servicetemplate = result.servicetemplate.Servicetemplate;

                    this.hostContactsAndContactgroups = result.hostContactsAndContactgroups;
                    this.hosttemplateContactsAndContactgroups = result.hosttemplateContactsAndContactgroups;

                    this.data.areContactsInheritedFromHosttemplate = result.areContactsInheritedFromHosttemplate;
                    this.data.areContactsInheritedFromHost = result.areContactsInheritedFromHost;
                    this.data.areContactsInheritedFromServicetemplate = result.areContactsInheritedFromServicetemplate;

                    this.serviceType = result.serviceType;
                    this.isSlaHost = result.isSlaHost;

                    this.data.disableInheritance = true;
                    if (
                        this.data.areContactsInheritedFromHosttemplate ||
                        this.data.areContactsInheritedFromHost ||
                        this.data.areContactsInheritedFromServicetemplate
                    ) {
                        this.data.disableInheritance = false;
                    }

                    if (this.post.tags) {
                        this.tagsForSelect = this.post.tags.split(',');
                    }

                    this.loadCommands();
                    this.loadElements();
                }));
        });

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadCommands() {
        this.subscriptions.add(this.ServicesService.loadCommands()
            .subscribe((result) => {
                this.commands = result.commands;
                this.eventhandlerCommands = result.eventhandlerCommands;
                this.cdr.markForCheck();
            })
        );
    }

    private loadElements() {
        const hostId = this.post.host_id;
        const serviceId = this.post.id;

        if (!hostId || !serviceId) {
            return;
        }

        this.subscriptions.add(this.ServicesService.loadElements(hostId, serviceId)
            .subscribe((result) => {
                this.servicetemplates = result.servicetemplates;
                this.servicegroups = result.servicegroups;
                this.timeperiods = result.timeperiods;
                this.checkperiods = result.checkperiods;
                this.contacts = result.contacts;
                this.contactgroups = result.contactgroups;
                this.existingServices = result.existingServices;
                this.isSlaHost = result.isSlaHost;
                this.cdr.markForCheck();
            })
        );

    }

    private loadCommandArguments() {
        const commandId = this.post.command_id;
        const serviceId = this.post.id;

        if (!commandId || !serviceId) {
            return;
        }

        this.subscriptions.add(this.ServicesService.loadCommandArguments(commandId, serviceId)
            .subscribe((result) => {
                this.post.servicecommandargumentvalues = result;
                this.cdr.markForCheck();
            })
        );

    }

    private loadEventHandlerCommandArguments() {
        const eventHandlerCommandId = this.post.eventhandler_command_id;
        const serviceId = this.post.id;

        if (!eventHandlerCommandId) {
            //"None" selected
            this.cdr.markForCheck();
            this.post.serviceeventcommandargumentvalues = [];
            return;
        }

        if (!serviceId) {
            return;
        }

        this.subscriptions.add(this.ServicesService.loadEventHandlerCommandArguments(eventHandlerCommandId, serviceId)
            .subscribe((result) => {
                this.post.serviceeventcommandargumentvalues = result;
                this.cdr.markForCheck();
            })
        );

    }

    public onHostChange() {
        this.loadElements();
    }

    public onServicetemplateChange() {
        const servicetemplateId = this.post.servicetemplate_id;
        if (!servicetemplateId) {
            return;
        }

        this.subscriptions.add(this.ServicesService.loadServicetemplate(servicetemplateId, this.post.host_id)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.servicetemplate = result.servicetemplate.Servicetemplate;
                this.setValuesFromServicetemplate();

                //Services add. At this point all contacts must be inherited from somewhere because the service does not exist jet.
                this.data.disableInheritance = false;
                this.data.areContactsInheritedFromHosttemplate = result.areContactsInheritedFromHosttemplate;
                this.data.areContactsInheritedFromHost = result.areContactsInheritedFromHost;
                this.data.areContactsInheritedFromServicetemplate = result.areContactsInheritedFromServicetemplate;

                this.inheritedContactsAndContactgroups = result.contactsAndContactgroups;
                this.servicetemplateContactsAndContactgroups = result.servicetemplateContactsAndContactgroups;
                this.hostContactsAndContactgroups = result.hostContactsAndContactgroups;
                this.hosttemplateContactsAndContactgroups = result.hosttemplateContactsAndContactgroups;

                this.post.contacts._ids = result.contactsAndContactgroups.contacts._ids;
                this.post.contactgroups._ids = result.contactsAndContactgroups.contactgroups._ids;

                this.checkForDuplicateServicename();
            })
        );
    }

    public checkForDuplicateServicename() {
        // Remove current service from existing services to avoid false positive
        const serviceId = this.post.id;
        if (serviceId && this.existingServices) {
            if (this.existingServices.hasOwnProperty(serviceId)) {
                delete this.existingServices[serviceId];
            }
        }

        const existingServicesNames: string[] = Object.values(this.existingServices);
        this.data.isServicenameInUse = existingServicesNames.includes(this.post.name);
        this.servicenameCheckedForDuplicates = this.post.name;
        this.cdr.markForCheck();
    }

    public onCommandChange() {
        this.loadCommandArguments();
    }

    public onEventHandlerChange() {
        this.loadEventHandlerCommandArguments();
    }

    public onDisableInheritanceChange() {
        this.cdr.markForCheck();
        if (
            this.data.areContactsInheritedFromHosttemplate === false &&
            this.data.areContactsInheritedFromHost === false &&
            this.data.areContactsInheritedFromServicetemplate === false) {
            return;
        }

        if (!this.data.disableInheritance) {
            if (this.data.areContactsInheritedFromServicetemplate === true) {
                if (this.servicetemplate) {
                    this.post.contacts._ids = this.servicetemplate.contacts._ids;
                    this.post.contactgroups._ids = this.servicetemplate.contactgroups._ids;
                }
                return;
            }

            if (this.data.areContactsInheritedFromHost === true) {
                if (this.hostContactsAndContactgroups) {
                    this.post.contacts._ids = this.hostContactsAndContactgroups.contacts._ids;
                    this.post.contactgroups._ids = this.hostContactsAndContactgroups.contactgroups._ids;
                }
                return;
            }

            //Contact information got inherited from host template
            if (this.hosttemplateContactsAndContactgroups) {
                this.post.contacts._ids = this.hosttemplateContactsAndContactgroups.contacts._ids;
                this.post.contactgroups._ids = this.hosttemplateContactsAndContactgroups.contactgroups._ids;
            }
        }
    }

    private setValuesFromServicetemplate() {
        if (!this.servicetemplate) {
            return;
        }

        this.cdr.markForCheck();

        const fields = [
            'name',
            'description',
            'servicetemplate_id',
            'command_id',
            'eventhandler_command_id',
            'check_interval',
            'retry_interval',
            'max_check_attempts',
            'first_notification_delay',
            'notification_interval',
            'notify_on_recovery',
            'notify_on_warning',
            'notify_on_critical',
            'notify_on_unknown',
            'notify_on_flapping',
            'notify_on_downtime',
            'flap_detection_enabled',
            'flap_detection_on_ok',
            'flap_detection_on_warning',
            'flap_detection_on_critical',
            'flap_detection_on_unknown',
            'low_flap_threshold',
            'high_flap_threshold',
            'process_performance_data',
            'freshness_checks_enabled',
            'freshness_threshold',
            'passive_checks_enabled',
            'event_handler_enabled',
            'active_checks_enabled',
            'retain_status_information',
            'retain_nonstatus_information',
            'notifications_enabled',
            'notes',
            'priority',
            'check_period_id',
            'notify_period_id',
            'tags',
            'service_url',
            'is_volatile',
            'sla_relevant'
        ];

        for (let index in fields) {
            let field = fields[index];
            if (this.servicetemplate.hasOwnProperty(field)) {

                // Basically, we are doing the following:
                //this.post[field] = this.servicetemplate[field];

                (this.post as any)[field] = (this.servicetemplate as any)[field];
            }
        }

        var hasManyAssociations = [
            'servicegroups', 'contacts', 'contactgroups'
        ];
        for (let index in hasManyAssociations) {
            let field = hasManyAssociations[index];
            if (this.servicetemplate.hasOwnProperty(field)) {
                // @ts-ignore
                this.post[field]._ids = this.servicetemplate[field]._ids;
            }
        }

        this.post.customvariables = [];
        for (let index in this.servicetemplate.customvariables) {
            this.post.customvariables.push({
                objecttype_id: ObjectTypesEnum['SERVICETEMPLATE'], //OBJECT_SERVICETEMPLATE because value from service template
                name: this.servicetemplate.customvariables[index].name,
                value: this.servicetemplate.customvariables[index].value,
                password: this.servicetemplate.customvariables[index].password
            });
        }

        this.post.servicecommandargumentvalues = [];
        for (let index in this.servicetemplate.servicetemplatecommandargumentvalues) {
            this.post.servicecommandargumentvalues.push({
                commandargument_id: this.servicetemplate.servicetemplatecommandargumentvalues[index].commandargument_id,
                value: this.servicetemplate.servicetemplatecommandargumentvalues[index].value,
                commandargument: this.servicetemplate.servicetemplatecommandargumentvalues[index].commandargument
            });
        }

        this.post.serviceeventcommandargumentvalues = [];
        for (let index in this.servicetemplate.servicetemplateeventcommandargumentvalues) {
            this.post.servicecommandargumentvalues.push({
                commandargument_id: this.servicetemplate.servicetemplateeventcommandargumentvalues[index].commandargument_id,
                value: this.servicetemplate.servicetemplateeventcommandargumentvalues[index].value,
                commandargument: this.servicetemplate.servicetemplateeventcommandargumentvalues[index].commandargument
            });
        }

        // "".split() returns [''] instead of [] like in php
        this.tagsForSelect = (this.post.tags !== '') ? this.post.tags.split(',') : [];
    }


    /*******************
     * MACRO functions *
     *******************/
    public addMacro() {
        this.post.customvariables.push({
            name: '',
            objecttype_id: ObjectTypesEnum["SERVICE"],
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


        this.subscriptions.add(this.ServicesService.edit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Service');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['services', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/services/index']);

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

    protected readonly ServiceTypesEnum = ServiceTypesEnum;
}

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
import { AsyncPipe, NgClass } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { PriorityComponent } from '../../../layouts/coreui/priority/priority.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
    ServiceInheritedContactsAndContactgroups,
    ServiceInheritedContactsAndContactgroupsWithId,
    ServicePost
} from '../../services/services.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { ObjectTypesEnum } from '../../changelogs/object-types.enum';
import { ServicesService } from '../services.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { HostsService } from '../../hosts/hosts.service';
import { HostsLoadHostsByStringParams } from '../../hosts/hosts.interface';
import { ServicetemplatePost } from '../../servicetemplates/servicetemplates.interface';
import { TemplateDiffComponent } from '../../../components/template-diff/template-diff.component';
import { TemplateDiffBtnComponent } from '../../../components/template-diff-btn/template-diff-btn.component';
import { UiBlockerComponent } from '../../../components/ui-blocker/ui-blocker.component';
import { HistoryService } from '../../../history.service';


@Component({
    selector: 'oitc-services-add',
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
    InputGroupComponent,
    InputGroupTextDirective,
    TemplateDiffComponent,
    TemplateDiffBtnComponent,
    UiBlockerComponent,
    TranslocoPipe,
    AsyncPipe
],
    templateUrl: './services-add.component.html',
    styleUrl: './services-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesAddComponent {
    public hosts: SelectKeyValue[] | undefined;
    public commands: SelectKeyValue[] = [];
    public eventhandlerCommands: SelectKeyValue[] = [];
    public tagsForSelect: string[] = [];
    public post: ServicePost = {} as ServicePost;

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
    public existingServices: object = {}
    public isSlaHost: boolean = false;

    public errors: GenericValidationError | null = null;
    public hasMacroErrors: boolean = false;

    public createAnother: boolean = false;

    protected servicetemplate?: ServicetemplatePost;

    private hostId = 0;
    private readonly HostsService = inject(HostsService);
    private readonly ServicesService = inject(ServicesService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            let hostId = params['hostId'];
            if (hostId === undefined) {
                hostId = 0;
            }
            this.hostId = Number(hostId);

            this.post = this.getDefaultPost(this.hostId);

            //Fire on page load
            this.loadHosts('');
            this.loadCommands();

            if (this.hostId > 0) {
                this.loadElements();
            }
            this.cdr.markForCheck();
        });

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getDefaultPost(hostId: number): ServicePost {
        this.tagsForSelect = [];

        return {
            host_id: hostId,
            servicetemplate_id: 0,
            name: '',
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
            servicecommandargumentvalues: [],
            serviceeventcommandargumentvalues: [],
            sla_relevant: 1
        };
    }

    public loadHosts = (searchString: string) => {
        var selected = [];
        if (this.post.host_id) {
            selected.push(this.post.host_id);
        }

        let params: HostsLoadHostsByStringParams = {
            angular: true,
            'filter[Hosts.name]': searchString,
            'selected[]': selected,
            includeDisabled: false
        }

        this.subscriptions.add(this.HostsService.loadHostsByString(params, true)
            .subscribe((result) => {
                this.hosts = result;
                this.cdr.markForCheck();
            })
        );
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

        if (!hostId) {
            return;
        }

        this.subscriptions.add(this.ServicesService.loadElements(hostId)
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

        if (!commandId) {
            return;
        }

        this.subscriptions.add(this.ServicesService.loadCommandArguments(commandId)
            .subscribe((result) => {
                this.post.servicecommandargumentvalues = result;
                this.cdr.markForCheck();
            })
        );

    }

    private loadEventHandlerCommandArguments() {
        const eventHandlerCommandId = this.post.eventhandler_command_id;

        if (!eventHandlerCommandId) {
            //"None" selected
            this.cdr.markForCheck();
            this.post.serviceeventcommandargumentvalues = [];
            return;
        }

        this.subscriptions.add(this.ServicesService.loadEventHandlerCommandArguments(eventHandlerCommandId)
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
        const existingServicesNames: string[] = Object.values(this.existingServices);
        this.data.isServicenameInUse = existingServicesNames.includes(this.post.name);
        // Ensure that the service name in the warning box will not change until the user changes the name again
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
            // Restore contacts from the template
            if (this.servicetemplate) {
                this.post.contacts._ids = this.inheritedContactsAndContactgroups.contacts._ids;
                this.post.contactgroups._ids = this.inheritedContactsAndContactgroups.contactgroups._ids;
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


        this.subscriptions.add(this.ServicesService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Service');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['services', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/services/index']);
                        return;
                    }
                    this.post = this.getDefaultPost(this.hostId);
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

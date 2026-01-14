import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';

import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HumanTimeComponent } from '../../../layouts/coreui/interval-input/human-time/human-time.component';
import { IntervalInputComponent } from '../../../layouts/coreui/interval-input/interval-input.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { MacrosComponent } from '../../../components/macros/macros.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { PriorityComponent } from '../../../layouts/coreui/priority/priority.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { ObjectTypesEnum, ROOT_CONTAINER } from '../../changelogs/object-types.enum';
import { HostsService } from '../hosts.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { HostAddEditSuccessResponse, HostDnsLookup, HostOrServiceType, HostPost } from '../hosts.interface';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AnimateCssService } from '../../../services/animate-css.service';
import { HosttemplatePost } from '../../hosttemplates/hosttemplates.interface';
import { TemplateDiffComponent } from '../../../components/template-diff/template-diff.component';
import { TemplateDiffBtnComponent } from '../../../components/template-diff-btn/template-diff-btn.component';
import { HostSubmitType, HostTypesEnum } from '../hosts.enum';
import { sprintf } from "sprintf-js";
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { FakeSelectComponent } from '../../../layouts/coreui/fake-select/fake-select.component';
import { UiBlockerComponent } from '../../../components/ui-blocker/ui-blocker.component';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-hosts-edit',
    imports: [
        AlertComponent,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CheckAttemptsInputComponent,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
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
        NgSelectModule,
        PermissionDirective,
        PriorityComponent,
        ReactiveFormsModule,
        RequiredIconComponent,
        SelectComponent,
        TemplateDiffBtnComponent,
        TemplateDiffComponent,
        TranslocoDirective,
        TranslocoPipe,
        TrueFalseDirective,
        XsButtonDirective,
        RouterLink,
        ObjectUuidComponent,
        NgClass,
        FakeSelectComponent,
        UiBlockerComponent,
        FormLoaderComponent,
        AsyncPipe
    ],
    templateUrl: './hosts-edit.component.html',
    styleUrl: './hosts-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsEditComponent implements OnInit, OnDestroy {

    private id: number = 0;

    // This variable gets used, in case the user changes the primary container.
    // In this case, the interface will create a shared container automaticaly for parent hosts
    private oldPrimaryContainerId: number = 0;

    public containers: SelectKeyValue[] | undefined;
    public commands: SelectKeyValue[] = [];
    public tagsForSelect: string[] = [];
    public post!: HostPost;
    public typeDetails: HostOrServiceType | undefined;

    public data = {
        createAnother: false,
        dnsLookUp: false,
        dnsHostnameNotFound: false,
        dnsAddressNotFound: false,

        isHostnameInUse: false,

        isPrimaryContainerChangeable: false,
        allowSharing: false,
        isHostOnlyEditableDueToHostSharing: false,
        areContactsInheritedFromHosttemplate: false,
        disableInheritance: false
    };

    public hostnameCheckedForDuplicates: string = '';


    public hosttemplates: SelectKeyValue[] = [];
    public hostgroups: SelectKeyValue[] = [];
    public timeperiods: SelectKeyValue[] = [];
    public checkperiods: SelectKeyValue[] = [];
    public contacts: SelectKeyValue[] = [];
    public contactgroups: SelectKeyValue[] = [];
    public satellites: SelectKeyValue[] = [];
    public sharingContainers: SelectKeyValue[] = [];
    public exporters: SelectKeyValue[] = [];
    public slas: SelectKeyValue[] = [];
    public parenthosts: SelectKeyValue[] = [];

    public errors: GenericValidationError | null = null;
    public hasMacroErrors: boolean = false;

    public createAnother: boolean = false;

    protected hosttemplate?: HosttemplatePost;

    private readonly HostsService = inject(HostsService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly LocalStorageService = inject(LocalStorageService);
    private readonly AnimateCssService = inject(AnimateCssService);
    private router: Router = inject(Router);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadContainers(); // will also trigger loadHost

        this.data.dnsLookUp = this.LocalStorageService.getItemWithDefault('HostsDnsLookUpEnabled', 'false') === 'true';
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadContainers() {
        this.subscriptions.add(this.HostsService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
                this.loadHost();
            })
        );
    }

    public loadHost() {
        this.subscriptions.add(this.HostsService.getEdit(this.id)
            .subscribe((result) => {
                //Fire on page load

                this.commands = result.commands;
                this.post = result.host.Host;

                this.oldPrimaryContainerId = result.host.Host.container_id;

                this.hosttemplate = result.hosttemplate.Hosttemplate;
                this.typeDetails = result.hostType;

                this.data.isPrimaryContainerChangeable = result.isPrimaryContainerChangeable;
                this.data.allowSharing = result.allowSharing;
                this.data.isHostOnlyEditableDueToHostSharing = result.isHostOnlyEditableDueToHostSharing;
                this.data.areContactsInheritedFromHosttemplate = result.areContactsInheritedFromHosttemplate;
                this.data.disableInheritance = !this.data.areContactsInheritedFromHosttemplate

                // Remove primary container from sharing containers list as it would break the gui (empty select option)
                this.post.hosts_to_containers_sharing._ids = this.post.hosts_to_containers_sharing._ids.filter(id => id !== this.post.container_id);

                if (this.post.tags) {
                    this.tagsForSelect = this.post.tags.split(',');
                }

                if (this.data.isHostOnlyEditableDueToHostSharing === true) {
                    //User has only permissions to edit this host via host sharing.
                    //We fake the displayed primary container id for the user to not expose any container names
                    this.containers = result.fakeDisplayContainers;
                }

                this.cdr.markForCheck();
                this.loadElements();
                this.loadParentHosts('');
            }));
    }

    private loadElements() {
        const containerId = this.post.container_id;

        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.HostsService.loadElements(containerId, this.id)
            .subscribe((result) => {
                this.hosttemplates = result.hosttemplates;
                this.hostgroups = result.hostgroups;
                this.timeperiods = result.timeperiods;
                this.checkperiods = result.checkperiods;
                this.contacts = result.contacts;
                this.contactgroups = result.contactgroups;
                this.satellites = result.satellites;
                this.sharingContainers = result.sharingContainers;
                this.exporters = result.exporters;
                this.slas = result.slas;

                // Do we need to create an automatic shared container for parent hosts?
                if (this.oldPrimaryContainerId !== containerId && this.oldPrimaryContainerId !== ROOT_CONTAINER) {
                    if (!this.post.hosts_to_containers_sharing._ids.includes(this.oldPrimaryContainerId)) {
                        this.post.hosts_to_containers_sharing._ids.push(this.oldPrimaryContainerId);
                    }
                }
                this.cdr.markForCheck();
            })
        );
    }

    public loadParentHosts = (searchString: string) => {
        if (!this.post.container_id) {
            return;
        }

        this.subscriptions.add(this.HostsService.loadParentHosts(searchString, this.post.container_id, this.post.parenthosts._ids, this.post.satellite_id)
            .subscribe((result) => {
                this.parenthosts = result;
                this.cdr.markForCheck();
            })
        );
    };

    private loadCommandArguments() {
        const commandId = this.post.command_id;

        if (!commandId) {
            return;
        }

        this.subscriptions.add(this.HostsService.loadCommandArguments(commandId, this.id)
            .subscribe((result) => {
                this.post.hostcommandargumentvalues = result;
                this.cdr.markForCheck();
            })
        );
    }

    public onContainerChange() {
        this.loadElements();
        this.loadParentHosts('');
    }

    public onCommandChange() {
        this.loadCommandArguments();
    }

    public onHosttemplateChange() {
        const hosttemplateId = this.post.hosttemplate_id;
        if (!hosttemplateId) {
            return;
        }

        this.subscriptions.add(this.HostsService.loadHosttemplate(hosttemplateId)
            .subscribe((result) => {
                this.hosttemplate = result;
                this.setValuesFromHosttemplate();
            })
        );

    }

    public onSatelliteChange() {
        this.loadParentHosts('');
    }

    public onDnsLookupChange() {
        if (this.post.host_type === HostTypesEnum.EVK_HOST) {
            // EVC Hosts use "127.0.0.1" as address
            return;
        }

        const value = this.data.dnsLookUp ? 'true' : 'false';
        this.LocalStorageService.setItem('HostsDnsLookUpEnabled', value);

        if (!this.data.dnsLookUp) {
            this.data.dnsHostnameNotFound = false;
            this.data.dnsAddressNotFound = false;
        }
        this.cdr.markForCheck();
    }

    public runDnsLookup(lookupByHostname: boolean) {
        if (!this.data.dnsLookUp) {
            return;
        }
        if (this.post.host_type === HostTypesEnum.EVK_HOST) {
            // EVC Hosts use "127.0.0.1" as address
            return;
        }

        let data: HostDnsLookup = {
            hostname: null,
            address: null
        };


        if (lookupByHostname) {
            if (this.post.name == '') {
                return;
            }
            data.hostname = this.post.name;
        } else {
            if (this.post.address == '') {
                return;
            }
            data.address = this.post.address;
        }

        this.subscriptions.add(this.HostsService.runDnsLookup(data)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (lookupByHostname) {
                    const address = result.address;
                    if (address === null) {
                        this.data.dnsHostnameNotFound = true;
                    } else {
                        this.data.dnsHostnameNotFound = false;
                        this.post.address = address;
                        this.AnimateCssService.animateCSS('#HostAddress', 'headShake');
                    }
                } else {
                    const hostname = result.hostname;
                    if (hostname === null) {
                        this.data.dnsAddressNotFound = true;
                    } else {
                        this.data.dnsAddressNotFound = false;
                        this.post.name = hostname;
                        this.checkForDuplicateHostname();
                        this.AnimateCssService.animateCSS('#HostName', 'headShake');
                    }
                }
            })
        );
    }

    public checkForDuplicateHostname() {
        this.subscriptions.add(this.HostsService.checkForDuplicateHostname(this.post.name, [this.id])
            .subscribe((result) => {
                this.data.isHostnameInUse = result;
                // Ensure that the host name in the warning box will not change until the user changes the name again
                this.hostnameCheckedForDuplicates = this.post.name;
                this.cdr.markForCheck();
            })
        );
    }

    private setValuesFromHosttemplate() {
        if (!this.hosttemplate) {
            return;
        }

        this.cdr.markForCheck();

        const fields = [
            'description',
            'hosttemplate_id',
            'address',
            'command_id',
            'eventhandler_command_id',
            'check_interval',
            'retry_interval',
            'max_check_attempts',
            'first_notification_delay',
            'notification_interval',
            'notify_on_down',
            'notify_on_unreachable',
            'notify_on_recovery',
            'notify_on_flapping',
            'notify_on_downtime',
            'flap_detection_enabled',
            'flap_detection_on_up',
            'flap_detection_on_down',
            'flap_detection_on_unreachable',
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
            'host_url',
            'sla_id'
        ];

        for (let index in fields) {
            let field = fields[index];
            if (this.hosttemplate.hasOwnProperty(field)) {

                // Basically, we are doing the following:
                //this.post[field] = this.hosttemplate[field];

                (this.post as any)[field] = (this.hosttemplate as any)[field];
            }
        }

        var hasManyAssociations = [
            'hostgroups', 'contacts', 'contactgroups', 'prometheus_exporters'
        ];
        for (let index in hasManyAssociations) {
            let field = hasManyAssociations[index];
            if (this.hosttemplate.hasOwnProperty(field)) {
                // @ts-ignore
                this.post[field]._ids = this.hosttemplate[field]._ids;
            }
        }

        this.post.customvariables = [];
        for (let index in this.hosttemplate.customvariables) {
            this.post.customvariables.push({
                objecttype_id: ObjectTypesEnum['HOSTTEMPLATE'], //OBJECT_HOSTTEMPLATE because value from host template
                name: this.hosttemplate.customvariables[index].name,
                value: this.hosttemplate.customvariables[index].value,
                password: this.hosttemplate.customvariables[index].password
            });
        }

        this.post.hostcommandargumentvalues = [];
        for (let index in this.hosttemplate.hosttemplatecommandargumentvalues) {
            this.post.hostcommandargumentvalues.push({
                commandargument_id: this.hosttemplate.hosttemplatecommandargumentvalues[index].commandargument_id,
                value: this.hosttemplate.hosttemplatecommandargumentvalues[index].value,
                commandargument: this.hosttemplate.hosttemplatecommandargumentvalues[index].commandargument
            });
        }

        // "".split() returns [''] instead of [] like in php
        this.tagsForSelect = (this.post.tags !== '') ? this.post.tags.split(',') : [];
    }

    public onDisableInheritanceChange() {
        if (this.data.areContactsInheritedFromHosttemplate === false) {
            return;
        }

        if (!this.data.disableInheritance) {
            // Restore contacts from the template
            if (this.hosttemplate) {
                this.post.contacts._ids = this.hosttemplate.contacts._ids;
                this.post.contactgroups._ids = this.hosttemplate.contactgroups._ids;
                this.cdr.markForCheck();
            }
        }
    }

    /*******************
     * MACRO functions *
     *******************/
    public addMacro() {
        this.post.customvariables.push({
            name: '',
            objecttype_id: ObjectTypesEnum["HOST"],
            password: 0,
            value: '',
        });
        this.cdr.markForCheck();
    }

    protected deleteMacro = (index: number) => {
        this.post.customvariables.splice(index, 1);
        this.cdr.markForCheck();
    }

    public submit(submitType: HostSubmitType) {
        this.post.tags = this.tagsForSelect.join(',');


        let save_host_and_assign_matching_servicetemplate_groups = false;
        if (submitType === HostSubmitType.AssignMatchingServicetemplateGroups) {
            save_host_and_assign_matching_servicetemplate_groups = true;
        }

        this.subscriptions.add(this.HostsService.edit(this.post, save_host_and_assign_matching_servicetemplate_groups)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {

                    const response = result.data as HostAddEditSuccessResponse;

                    const title = this.TranslocoService.translate('Host');
                    const genericMsg = this.TranslocoService.translate('updated successfully');
                    const url = ['hosts', 'edit', response.id];
                    let showWarning: boolean = false;

                    let msg = genericMsg + ' ';
                    let allocate_message = this.TranslocoService.translate('+ %s Services created successfully');
                    let allocate_warning_message = this.TranslocoService.translate('. %s service template groups has been removed due to insufficient permissions');
                    let disable_message = this.TranslocoService.translate(' + %s Services has been disabled');

                    if (submitType === HostSubmitType.AssignMatchingServicetemplateGroups) {
                        if (response.services?._ids) {
                            msg += sprintf(allocate_message, response.services?._ids.length);
                        }

                        if (response.servicetemplategroups_removed_count && response.servicetemplategroups_removed_count > 0) {
                            showWarning = true;
                            msg += sprintf(allocate_warning_message, response.servicetemplategroups_removed_count);
                        }

                        if (response.services_disabled_count && response.services_disabled_count > 0) {
                            msg += sprintf(disable_message, response.services_disabled_count);
                        }
                    }

                    if (showWarning) {
                        this.notyService.genericWarning(msg, title, url);
                    } else {
                        this.notyService.genericSuccess(msg, title, url);
                    }

                    if (!this.createAnother && submitType) {
                        switch (submitType) {
                            case HostSubmitType.ServiceAdd:
                                this.router.navigate(['/services/add/'], {queryParams: {hostId: response.id}});
                                break;

                            case HostSubmitType.AgentDiscovery:
                                this.router.navigate(['/agentconnector/wizard'], {queryParams: {hostId: response.id}});
                                break;

                            case HostSubmitType.CheckmkDiscovery:
                                this.router.navigate(['/checkmk_module/scans/index/' + response.id]);
                                break;

                            default:
                                this.HistoryService.navigateWithFallback(['/hosts/index']);
                                break;
                        }
                        return;
                    }

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
            }));

    }

    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
    protected readonly HostSubmitType = HostSubmitType;
    protected readonly HostTypesEnum = HostTypesEnum;
}

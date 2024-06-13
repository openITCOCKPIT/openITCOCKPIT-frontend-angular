import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import {
    AlertComponent,
    AlertHeadingDirective,
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
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { HumanTimeComponent } from '../../../layouts/coreui/interval-input/human-time/human-time.component';
import { IntervalInputComponent } from '../../../layouts/coreui/interval-input/interval-input.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { MacrosComponent } from '../../../components/macros/macros.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgForOf, NgIf } from '@angular/common';
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
import { HostAddEditSuccessResponse, HostDnsLookup, HostPost } from '../hosts.interface';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AnimateCssService } from '../../../services/animate-css.service';
import { HosttemplatePost } from '../../hosttemplates/hosttemplates.interface';
import { TemplateDiffComponent } from '../../../components/template-diff/template-diff.component';
import { TemplateDiffBtnComponent } from '../../../components/template-diff-btn/template-diff-btn.component';
import { HostSubmitType } from '../hosts.enum';
import _ from 'lodash';
import { sprintf } from "sprintf-js";

@Component({
    selector: 'oitc-hosts-add',
    standalone: true,
    imports: [
        AlertComponent,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CheckAttemptsInputComponent,
        CoreuiComponent,
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
        NgForOf,
        NgIf,
        NgSelectModule,
        PermissionDirective,
        PriorityComponent,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        TrueFalseDirective,
        XsButtonDirective,
        RouterLink,
        TranslocoPipe,
        AlertHeadingDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TemplateDiffComponent,
        TemplateDiffBtnComponent,
        DropdownComponent,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownItemDirective
    ],
    templateUrl: './hosts-add.component.html',
    styleUrl: './hosts-add.component.css'
})
export class HostsAddComponent implements OnInit, OnDestroy {

    public containers: SelectKeyValue[] | undefined;
    public commands: SelectKeyValue[] = [];
    public tagsForSelect: string[] = [];
    public post: HostPost = {} as HostPost;
    public showRootAlert: boolean = false;

    public data = {
        createAnother: false,
        dnsLookUp: false,
        dnsHostnameNotFound: false,
        dnsAddressNotFound: false,

        isHostnameInUse: false
    };

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

    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            //Fire on page load
            this.loadContainers();
            this.loadCommands();

            this.post = this.getDefaultPost();
        });

        this.data.dnsLookUp = this.LocalStorageService.getItemWithDefault('HostsDnsLookUpEnabled', 'false') === 'true';
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getDefaultPost(): HostPost {
        this.tagsForSelect = [];

        return {
            name: '',
            description: '',
            hosttemplate_id: 0,
            address: '',
            command_id: 0,
            eventhandler_command_id: 0,
            check_interval: 3600,
            retry_interval: 60,
            max_check_attempts: 3,
            first_notification_delay: 0,
            notification_interval: 7200,
            notify_on_down: 1,
            notify_on_unreachable: 1,
            notify_on_recovery: 1,
            notify_on_flapping: 0,
            notify_on_downtime: 0,
            flap_detection_enabled: 0,
            flap_detection_on_up: 0,
            flap_detection_on_down: 0,
            flap_detection_on_unreachable: 0,
            low_flap_threshold: 0,
            high_flap_threshold: 0,
            process_performance_data: 0,
            freshness_checks_enabled: 0,
            freshness_threshold: 0,
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
            host_url: '',
            satellite_id: 0,
            sla_id: null,
            contacts: {
                _ids: []
            },
            contactgroups: {
                _ids: []
            },
            hostgroups: {
                _ids: []
            },
            hosts_to_containers_sharing: {
                _ids: []
            },
            parenthosts: {
                _ids: []
            },
            customvariables: [],
            hostcommandargumentvalues: [],
            prometheus_exporters: {
                _ids: []
            }
        };
    }

    public loadContainers() {
        this.subscriptions.add(this.HostsService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
            })
        );
    }

    public loadCommands() {
        this.subscriptions.add(this.HostsService.loadCommands()
            .subscribe((result) => {
                this.commands = result;
            })
        );
    }


    private loadElements() {
        const containerId = this.post.container_id;

        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.HostsService.loadElements(containerId)
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
            })
        );
    };

    private loadCommandArguments() {
        const commandId = this.post.command_id;

        if (!commandId) {
            return;
        }

        this.subscriptions.add(this.HostsService.loadCommandArguments(commandId)
            .subscribe((result) => {
                this.post.hostcommandargumentvalues = result;
            })
        );
    }

    public onContainerChange() {
        this.loadElements();
        this.loadParentHosts('');
        this.showRootAlert = this.post.container_id === ROOT_CONTAINER;
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

    public onDnsLookupChange() {
        const value = this.data.dnsLookUp ? 'true' : 'false';
        this.LocalStorageService.setItem('HostsDnsLookUpEnabled', value);

        if (!this.data.dnsLookUp) {
            this.data.dnsHostnameNotFound = false;
            this.data.dnsAddressNotFound = false;
        }
    }

    public runDnsLookup(lookupByHostname: boolean) {
        if (!this.data.dnsLookUp) {
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
        this.subscriptions.add(this.HostsService.checkForDuplicateHostname(this.post.name)
            .subscribe((result) => {
                this.data.isHostnameInUse = result;
            })
        );
    }

    private setValuesFromHosttemplate() {
        if (!this.hosttemplate) {
            return;
        }

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

        this.tagsForSelect = this.post.tags.split(',');
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
    }

    protected deleteMacro = (index: number) => {
        this.post.customvariables.splice(index, 1);
    }


    protected getMacroErrors = (index: number): GenericValidationError => {
        // No error, here.
        if (!this.errors) {
            return {} as GenericValidationError;
        }

        if (this.errors['customvariables'] === undefined) {
            return {} as GenericValidationError;
        }
        return this.errors['customvariables'][index] as unknown as GenericValidationError;
    }

    public submit(submitType: HostSubmitType) {
        this.post.tags = this.tagsForSelect.join(',');

        //clean up parent host  -> remove not visible ids
        this.post.parenthosts._ids = _.intersection(
            _.map(this.parenthosts, 'key'),
            this.post.parenthosts._ids
        );

        //clean up host and host templates -> remove not visible ids
        this.post.hostgroups._ids = _.intersection(
            _.map(this.hostgroups, 'key'),
            this.post.hostgroups._ids
        );

        let save_host_and_assign_matching_servicetemplate_groups = false;
        if (submitType === HostSubmitType.AssignMatchingServicetemplateGroups) {
            save_host_and_assign_matching_servicetemplate_groups = true;
        }

        this.subscriptions.add(this.HostsService.add(this.post, save_host_and_assign_matching_servicetemplate_groups)
            .subscribe((result) => {
                if (result.success) {

                    const response = result.data as HostAddEditSuccessResponse;

                    const title = this.TranslocoService.translate('Host');
                    const genericMsg = this.TranslocoService.translate('created successfully');
                    const url = ['hosts', 'edit', response.id];
                    let showWarning: boolean = false;

                    let msg = genericMsg + ' ';
                    let allocate_message = this.TranslocoService.translate('+ %s Services created successfully');
                    let allocate_warning_message = this.TranslocoService.translate('. %s service template groups has been removed due to insufficient permissions');

                    if (submitType === HostSubmitType.AssignMatchingServicetemplateGroups && response.services?._ids) {
                        msg += sprintf(allocate_message, response.services?._ids.length);
                        if (response.servicetemplategroups_removed_count) {
                            showWarning = true;
                            msg += sprintf(allocate_warning_message, response.servicetemplategroups_removed_count);
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
                                this.router.navigate(['/services/add/' + response.id]);
                                break;

                            case HostSubmitType.AgentDiscovery:
                                this.router.navigate(['/agentconnector/wizard/' + response.id]);
                                break;

                            case HostSubmitType.CheckmkDiscovery:
                                this.router.navigate(['/checkmk_module/scans/index/' + response.id]);
                                break;

                            default:
                                this.router.navigate(['/hosts/index']);
                                break;
                        }
                        return;
                    }

                    this.post = this.getDefaultPost();
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
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import {
    AlertComponent,
    AlertHeadingDirective,
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
import { HostPost } from '../hosts.interface';
import { LocalStorageService } from '../../../services/local-storage.service';

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
        AlertHeadingDirective
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

    public errors: GenericValidationError | null = null;
    public hasMacroErrors: boolean = false;

    public createAnother: boolean = false;

    private readonly HostsService = inject(HostsService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly LocalStorageService = inject(LocalStorageService);
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

        console.log(this.LocalStorageService.getItemWithDefault('HostsDnsLookUpEnabled', 'false'));
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
        this.showRootAlert = this.post.container_id === ROOT_CONTAINER;
    }

    public onCommandChange() {
        this.loadCommandArguments();
    }

    public onDnsLookupChange() {
        const value = this.data.dnsLookUp ? 'true' : 'false';
        this.LocalStorageService.setItem('HostsDnsLookUpEnabled', value);

        if (this.data.dnsLookUp === false) {
            this.data.dnsHostnameNotFound = false;
            this.data.dnsAddressNotFound = false;
        }
    }

    public checkForDuplicateHostname() {
        this.subscriptions.add(this.HostsService.checkForDuplicateHostname(this.post.name)
            .subscribe((result) => {
                this.data.isHostnameInUse = result;
            })
        );
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

    public submit() {
        this.post.tags = this.tagsForSelect.join(',');

        /*
                this.subscriptions.add(this.HostsService.add(this.post)
                    .subscribe((result) => {
                        if (result.success) {
                            const response = result.data as GenericIdResponse;
                            const title = this.TranslocoService.translate('Host template');
                            const msg = this.TranslocoService.translate('created successfully');
                            const url = ['hosts', 'edit', response.id];

                            this.notyService.genericSuccess(msg, title, url);

                            if (!this.createAnother) {
                                this.router.navigate(['/hosts/index']);
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
                    }))

         */

    }

    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
}

import { Component, inject } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    AlertComponent,
    BadgeComponent,
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { UserMacrosModalComponent } from '../../commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HosttemplateTypesEnum } from '../hosttemplate-types.enum';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import {
    HosttemplateContainerResult,
    HosttemplatePost,
    HosttemplateTypeResult,
    HosttemplateTypeResultDetails
} from '../hosttemplates.interface';
import { Subscription } from 'rxjs';
import { HosttemplatesService } from '../hosttemplates.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NgSelectModule } from '@ng-select/ng-select';
import { PriorityComponent } from '../../../layouts/coreui/priority/priority.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { IntervalInputComponent } from '../../../layouts/coreui/interval-input/interval-input.component';
import {
    CheckAttemptsInputComponent
} from '../../../layouts/coreui/check-attempts-input/check-attempts-input.component';
import { HumanTimeComponent } from '../../../layouts/coreui/interval-input/human-time/human-time.component';
import { MacrosComponent } from '../../../components/macros/macros.component';
import { ObjectTypesEnum } from '../../changelogs/object-types.enum';
import { PermissionsService } from '../../../permissions/permissions.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';

@Component({
    selector: 'oitc-hosttemplates-edit',
    standalone: true,
    imports: [
        CoreuiComponent,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        TranslocoDirective,
        UserMacrosModalComponent,
        XsButtonDirective,
        RouterLink,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NgForOf,
        RequiredIconComponent,
        NgIf,
        NgClass,
        MultiSelectComponent,
        SelectComponent,
        NgSelectModule,
        PriorityComponent,
        LabelLinkComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        TrueFalseDirective,
        IntervalInputComponent,
        AlertComponent,
        CheckAttemptsInputComponent,
        HumanTimeComponent,
        BadgeComponent,
        MacrosComponent,
        CardFooterComponent,
        ObjectUuidComponent,
    ],
    templateUrl: './hosttemplates-edit.component.html',
    styleUrl: './hosttemplates-edit.component.css'
})
export class HosttemplatesEditComponent {

    public hosttemplateTypes: HosttemplateTypeResult[] = [];
    public containers: HosttemplateContainerResult | undefined;
    public commands: SelectKeyValue[] = [];
    public tagsForSelect: string[] = [];
    public post: HosttemplatePost = {} as HosttemplatePost;
    public typeDetails: HosttemplateTypeResultDetails | undefined;

    public timeperiods: SelectKeyValue[] = [];
    public checkperiods: SelectKeyValue[] = [];
    public contacts: SelectKeyValue[] = [];
    public contactgroups: SelectKeyValue[] = [];
    public hostgroups: SelectKeyValue[] = [];
    public exporters: SelectKeyValue[] = [];
    public slas: SelectKeyValue[] = [];

    public errors: GenericValidationError | null = null;
    public hasMacroErrors: boolean = false;

    public createAnother: boolean = false;

    private hosttemplateTypeId = HosttemplateTypesEnum.GENERIC_HOSTTEMPLATE;
    private readonly HosttemplatesService = inject(HosttemplatesService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private router: Router = inject(Router);

    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.HosttemplatesService.getEdit(id)
            .subscribe((result) => {
                //this.post = result.command;

            }));
    }

    public ngOnDestroy(): void {
    }

    private getDefaultPost(hosttemplateTypeId: number): HosttemplatePost {
        return {
            name: '',
            description: '',
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
            hosttemplatetype_id: hosttemplateTypeId,
            contacts: {
                _ids: []
            },
            contactgroups: {
                _ids: []
            },
            hostgroups: {
                _ids: []
            },
            customvariables: [],
            hosttemplatecommandargumentvalues: [],
            prometheus_exporters: {
                _ids: []
            },
            sla_id: null
        };
    }

    public loadContainers() {
        this.subscriptions.add(this.HosttemplatesService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
            })
        );
    }

    public loadCommands() {
        this.subscriptions.add(this.HosttemplatesService.loadCommands()
            .subscribe((result) => {
                this.commands = result;
            })
        );
    }

    public loadHosttemplateTypes() {
        this.subscriptions.add(this.HosttemplatesService.loadHosttemplateTypes()
            .subscribe((result) => {
                this.hosttemplateTypes = result;
                this.setDetailsForType();
            })
        );
    }

    private setDetailsForType() {
        this.typeDetails = this.hosttemplateTypes.find(type => type.key === this.post.hosttemplatetype_id)?.value;
    };

    private loadElements() {
        const containerId = this.post.container_id;

        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.HosttemplatesService.loadElements(containerId)
            .subscribe((result) => {
                this.timeperiods = result.timeperiods;
                this.checkperiods = result.checkperiods;
                this.contacts = result.contacts;
                this.contactgroups = result.contactgroups;
                this.hostgroups = result.hostgroups;
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

        this.subscriptions.add(this.HosttemplatesService.loadCommandArguments(commandId)
            .subscribe((result) => {
                this.post.hosttemplatecommandargumentvalues = result;
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

    /*******************
     * MACRO functions *
     *******************/
    public addMacro() {
        this.post.customvariables.push({
            name: '',
            objecttype_id: ObjectTypesEnum["HOSTTEMPLATE"],
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


        this.subscriptions.add(this.HosttemplatesService.add(this.post)
            .subscribe((result) => {
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Host template');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['hosttemplates', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.router.navigate(['/hosttemplates/index']);
                        return;
                    }
                    this.post = this.getDefaultPost(this.hosttemplateTypeId);
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();
                    this.errors = null;
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

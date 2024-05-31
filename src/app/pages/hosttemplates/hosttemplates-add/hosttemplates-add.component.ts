import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { UserMacrosModalComponent } from '../../commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
import { GenericValidationError } from '../../../generic-responses';

@Component({
    selector: 'oitc-hosttemplates-add',
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
        SelectComponent
    ],
    templateUrl: './hosttemplates-add.component.html',
    styleUrl: './hosttemplates-add.component.css'
})
export class HosttemplatesAddComponent implements OnInit, OnDestroy {

    public hosttemplateTypes: HosttemplateTypeResult[] = [];
    public containers: HosttemplateContainerResult | undefined;
    public commands: SelectKeyValue[] = [];
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

    private hosttemplateTypeId = HosttemplateTypesEnum.GENERIC_HOSTTEMPLATE;
    private readonly HosttemplatesService = inject(HosttemplatesService);
    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            let hosttemplateTypeId = params['hosttemplateTypeId'];
            if (hosttemplateTypeId === undefined) {
                hosttemplateTypeId = HosttemplateTypesEnum.GENERIC_HOSTTEMPLATE
            }
            this.hosttemplateTypeId = Number(hosttemplateTypeId);

            //Fire on page load
            this.loadContainers();
            this.loadCommands();
            this.loadHosttemplateTypes();

            this.post = this.getDefaultPost(this.hosttemplateTypeId);
        });
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

    public setDetailsForType() {
        this.typeDetails = this.hosttemplateTypes.find(type => type.key === this.post.hosttemplatetype_id)?.value;
    };

    public loadElements() {
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

    public onContainerChange() {
        this.loadElements();
    }

}

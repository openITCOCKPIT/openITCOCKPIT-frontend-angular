import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ContainersLoadContainersByStringParams } from '../../../../../pages/containers/containers.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { HostdefaultsService } from '../hostdefaults.service';
import { HistoryService } from '../../../../../history.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { HostDefaultsPost } from '../hostdefaults.interface';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import {
    AlertComponent,
    AlertHeadingDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
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
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { AsyncPipe, NgIf } from '@angular/common';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MultiSelectOptgroupComponent
} from '../../../../../layouts/primeng/multi-select/multi-select-optgroup/multi-select-optgroup.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import {
    RegexHelperTooltipComponent
} from '../../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { HostTypesEnum } from '../../../../../pages/hosts/hosts.enum';
import { FakeSelectComponent } from '../../../../../layouts/coreui/fake-select/fake-select.component';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';


@Component({
    selector: 'oitc-hostdefaults-add',
    standalone: true,
    imports: [
        AlertComponent,
        AlertHeadingDirective,
        AsyncPipe,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
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
        InputGroupComponent,
        InputGroupTextDirective,
        MultiSelectOptgroupComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        PermissionDirective,
        ReactiveFormsModule,
        RegexHelperTooltipComponent,
        RequiredIconComponent,
        RowComponent,
        SelectComponent,
        TranslocoDirective,
        TrueFalseDirective,
        XsButtonDirective,
        RouterLink,
        MultiSelectComponent,
        FakeSelectComponent,
        LabelLinkComponent
    ],
    templateUrl: './hostdefaults-add.component.html',
    styleUrl: './hostdefaults-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostdefaultsAddComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly HostdefaultsService = inject(HostdefaultsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    public post = this.getClearForm();
    public createAnother: boolean = false;

    public errors: GenericValidationError | null = null;
    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    public containers: SelectKeyValue[] = [];
    public sharingContainers: SelectKeyValue[] = [];
    public hosttemplates: SelectKeyValue[] = [];
    public servicetemplates: SelectKeyValue[] = [];
    public servicetemplategroups: SelectKeyValue[] = [];
    public satellites: SelectKeyValue[] = [];
    public agentchecks: SelectKeyValue[] = [];

    private cdr = inject(ChangeDetectorRef);

    constructor() {
    }

    ngOnInit(): void {
        this.loadContainers();
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    public getClearForm(): HostDefaultsPost {
        return {
            container_id: null,
            name: '',
            description: '',
            hosttemplate_id: 0,
            satellite_id: 0,
            host_container_id: null,
            hostdefaults_to_containers_sharing: {
                _ids: []
            },
            hostdefaults_to_servicetemplates: [],
            hostdefaults_to_servicetemplategroups: [],
            hostdefaults_to_agentchecks: [],
            hostdefaults_to_servicetemplates_external_monitoring: []
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public submit() {
        this.subscriptions.add(this.HostdefaultsService.createHostdefault(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Host defaults');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['import_module', 'Hostdefaults', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/import_module/HostDefaults/index']);
                        return;
                    }

                    // Create another
                    this.post = this.getClearForm();
                    this.errors = null;
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();

                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

    protected loadElements() {
        const containerId = this.post.container_id;

        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.HostdefaultsService.loadElements(containerId)
            .subscribe((result) => {
                this.sharingContainers = result.sharingContainers;
                this.hosttemplates = result.hosttemplates;
                this.servicetemplates = result.servicetemplates;
                this.servicetemplategroups = result.servicetemplategroups;
                this.satellites = result.satellites;
                this.agentchecks = result.agentchecks;
                this.cdr.markForCheck();
            })
        );
    }
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import {
    AlertComponent, AlertHeadingDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownComponent, DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective, FormCheckComponent,
    FormCheckInputDirective, FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent, InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { ContainersLoadContainersByStringParams } from '../../../../../pages/containers/containers.interface';
import { ExternalSystemConnect, ExternalSystemConnectStatus, ExternalSystemPost } from '../external-systems.interface';
import {
    IdoitOverviewComponent
} from '../../../components/additional-host-information/idoit/idoit-overview/idoit-overview.component';
import {
    ItopOverviewComponent
} from '../../../components/additional-host-information/itop/itop-overview/itop-overview.component';
import { GenericValidationError } from '../../../../../generic-responses';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { ExternalSystemsService } from '../external-systems.service';

@Component({
    selector: 'oitc-external-systems-add',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormCheckInputDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgOptionTemplateDirective,
        NgSelectComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        NgIf,
        SelectComponent,
        IdoitOverviewComponent,
        ItopOverviewComponent,
        ColComponent,
        RowComponent,
        ContainerComponent,
        InputGroupComponent,
        DropdownComponent,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownItemDirective,
        InputGroupTextDirective,
        DebounceDirective,
        FormCheckComponent,
        FormCheckLabelDirective,
        AlertComponent,
        AlertHeadingDirective
    ],
    templateUrl: './external-systems-add.component.html',
    styleUrl: './external-systems-add.component.css'
})
export class ExternalSystemsAddComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly ExternalSystemsService = inject(ExternalSystemsService);
    public post = this.getClearForm();
    public errors: GenericValidationError | null = null;
    public readonly PermissionsService: PermissionsService = inject(PermissionsService)

    protected readonly ExternalSystemTypes = [
        {
            key: 'idoit',
            value: this.TranslocoService.translate('i-doit System'),
            placeholder: 'i-doit.system/src/jsonrpc.php'
        },
        {
            key: 'itop',
            value: this.TranslocoService.translate('iTop System'),
            placeholder: 'itop/webservices/rest.php?version=1.3'
        }
    ];

    containers: SelectKeyValue[] = [];
    public status?: ExternalSystemConnect;

    public ngOnInit(): void {
        this.loadContainers();

    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
            }));
    }

    public getClearForm(): ExternalSystemPost {
        return {
            container_id: null,
            name: '',
            description: '',
            api_url: '',
            api_key: '',
            api_user: '',
            api_password: '',
            use_https: 1, //number
            use_proxy: 1, //number
            ignore_ssl_certificate: 0, //number
            system_type: 'idoit',
            object_type_ids: [],
            custom_data: {
                custom_mappings: [],
                hostgroup_mappings: []
            }
        }
    }


    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    public submit() {

    }

    public checkConnection() {
        this.subscriptions.add(this.ExternalSystemsService.testConnection(this.post)
            .subscribe((result: ExternalSystemConnect) => {
                this.status = result;
                console.log(this.status);
            }));
    }
}

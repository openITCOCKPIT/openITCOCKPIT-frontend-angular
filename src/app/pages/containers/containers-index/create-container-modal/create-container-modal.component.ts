import { Component, effect, inject, input, OnChanges, OnDestroy, OnInit, output, SimpleChanges } from '@angular/core';
import { ContainerTypesEnum } from '../../../changelogs/object-types.enum';
import {
    ButtonCloseDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ProgressComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { LocationPost } from '../../../locations/locations.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { LocationsService } from '../../../locations/locations.service';
import { UsersService } from '../../../users/users.service';
import { FormErrorDirective } from '../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../layouts/coreui/form-feedback/form-feedback.component';
import { PaginatorModule } from 'primeng/paginator';
import { TenantPost } from '../../../tenants/tenant.interface';
import { GenericIdResponse, GenericValidationError } from '../../../../generic-responses';
import { TenantsService } from '../../../tenants/tenants.service';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { NodePost } from '../../containers.interface';
import { ContainersService } from '../../containers.service';
import { UserTimezonesSelect } from '../../../users/users.interface';

@Component({
    selector: 'oitc-create-container-modal',
    standalone: true,
    imports: [
        ButtonCloseDirective,
        ColComponent,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgForOf,
        NgIf,
        ProgressComponent,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        PaginatorModule,
        TranslocoPipe,
        FormLabelDirective,
        RequiredIconComponent,
        SelectComponent,
        NgOptionTemplateDirective,
        NgSelectComponent,
        NgOptionHighlightDirective,
        JsonPipe
    ],
    templateUrl: './create-container-modal.component.html',
    styleUrl: './create-container-modal.component.css'
})
export class CreateContainerModalComponent implements OnInit, OnChanges, OnDestroy {

    //@Input() public parentContainerId: number = 0;
    public parentContainerId = input<number>(0);

    //@Input() public parentContainerTypeId: ContainerTypesEnum = ContainerTypesEnum.CT_GLOBAL;
    public parentContainerTypeId = input<ContainerTypesEnum>(ContainerTypesEnum.CT_GLOBAL);

    //@Output() completed = new EventEmitter<boolean>();
    completed = output<boolean>();

    // container_type of the new container
    public availableContainerTypes: SelectKeyValue[] = [];
    public currentContainerTypeId: ContainerTypesEnum = ContainerTypesEnum.CT_NODE;

    public locationPost: LocationPost = this.getDefaultLocationPost();
    public tenantPost: TenantPost = this.getDefaultTenantPost();
    public nodePost: NodePost = this.getDefaultNodePost();
    public errors: GenericValidationError | null = null;
    public isSaving: boolean = false;

    public timezones: UserTimezonesSelect[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly LocationsService = inject(LocationsService);
    private readonly TenantsService = inject(TenantsService);
    private readonly ContainersService = inject(ContainersService);
    private readonly UsersService = inject(UsersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly modalService = inject(ModalService);


    constructor() {
        effect(() => {
            this.availableContainerTypes = this.getOptionsForContainerTypeSelect();
            if (this.parentContainerTypeId() === ContainerTypesEnum.CT_GLOBAL) {
                this.currentContainerTypeId = ContainerTypesEnum.CT_TENANT;
            } else {
                this.currentContainerTypeId = ContainerTypesEnum.CT_NODE;
            }
        });
    }

    public ngOnInit() {
        // Timezones are required for locations
        this.subscriptions.add(this.UsersService.getDateformats().subscribe(data => {
            this.timezones = data.timezones;
        }));
    }

    public ngOnChanges(changes: SimpleChanges) {
        //  if (changes['parentContainerTypeId']) {
        //      this.parentContainerTypeId = changes['parentContainerTypeId'].currentValue;
        //      this.availableContainerTypes = this.getOptionsForContainerTypeSelect();

        //      if (this.parentContainerTypeId === ContainerTypesEnum.CT_GLOBAL) {
        //          this.currentContainerTypeId = ContainerTypesEnum.CT_TENANT;
        //      } else {
        //          this.currentContainerTypeId = ContainerTypesEnum.CT_NODE;
        //      }
        //  }

        //if (changes['parentContainerId']) {
        //    this.parentContainerId = changes['parentContainerId'].currentValue;
        //}
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public hideModal() {
        this.modalService.toggle({
            show: false,
            id: 'createContainerModal'
        });
    }

    public getDefaultLocationPost(): LocationPost {
        return {
            description: '',
            latitude: null,
            longitude: null,
            timezone: 'Europe/Berlin',
            container: {
                name: '',
                parent_id: 0
            }
        };
    }

    private getDefaultTenantPost(): TenantPost {
        return {
            description: '',
            is_active: 1,
            number_users: 0,
            max_users: 0,
            number_hosts: 0,
            number_services: 0,
            firstname: '',
            lastname: '',
            street: '',
            zipcode: null,
            city: '',
            container: {
                name: '',
            }
        };
    }

    private getDefaultNodePost(): NodePost {
        return {
            parent_id: 0,
            containertype_id: ContainerTypesEnum.CT_NODE,
            name: ''
        };
    }

    public submitLocation() {
        this.isSaving = true;

        this.locationPost.container.parent_id = this.parentContainerId();

        this.subscriptions.add(this.LocationsService.add(this.locationPost)
            .subscribe((result) => {
                this.isSaving = false;
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Location');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['locations', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.locationPost = this.getDefaultLocationPost();
                    this.errors = null;
                    this.completed.emit(true);
                    this.hideModal();
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            }));

    }

    public submitTenant() {
        this.isSaving = true;
        this.subscriptions.add(this.TenantsService.add(this.tenantPost)
            .subscribe((result) => {
                this.isSaving = false;

                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Tenant');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['tenants', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.tenantPost = this.getDefaultTenantPost();
                    this.errors = null;
                    this.completed.emit(true);
                    this.hideModal();
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            }));
    }

    public submitNode() {
        this.isSaving = true;

        this.nodePost.parent_id = this.parentContainerId();

        this.subscriptions.add(this.ContainersService.add(this.nodePost)
            .subscribe((result) => {
                this.isSaving = false;

                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Node');
                    const msg = this.TranslocoService.translate('created successfully');

                    this.notyService.genericSuccess(msg, title);

                    this.nodePost = this.getDefaultNodePost();
                    this.errors = null;
                    this.completed.emit(true);
                    this.hideModal();
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            }));
    }

    public getOptionsForContainerTypeSelect(): SelectKeyValue[] {
        const types: SelectKeyValue[] = []

        if (this.parentContainerTypeId() === ContainerTypesEnum.CT_GLOBAL) {
            types.push({key: ContainerTypesEnum.CT_TENANT, value: this.TranslocoService.translate('Tenant')});
        }

        if (this.parentContainerTypeId() !== ContainerTypesEnum.CT_GLOBAL) {
            types.push({key: ContainerTypesEnum.CT_NODE, value: this.TranslocoService.translate('Node')});
            types.push({key: ContainerTypesEnum.CT_LOCATION, value: this.TranslocoService.translate('Location')});

        }
        return types;
    }

    protected readonly ContainerTypesEnum = ContainerTypesEnum;
}

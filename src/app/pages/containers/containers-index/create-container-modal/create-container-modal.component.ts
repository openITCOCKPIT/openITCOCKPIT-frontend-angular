import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
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
import { NgForOf, NgIf } from '@angular/common';
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
        SelectComponent
    ],
    templateUrl: './create-container-modal.component.html',
    styleUrl: './create-container-modal.component.css'
})
export class CreateContainerModalComponent implements OnChanges, OnDestroy {

    @Input() public parentContainerId: number = 0;
    @Input() public parentContainerTypeId: ContainerTypesEnum = ContainerTypesEnum.CT_GLOBAL;
    @Output() completed = new EventEmitter<boolean>();

    // container_type of the new container
    public availableContainerTypes: SelectKeyValue[] = [];
    public currentContainerTypeId: ContainerTypesEnum = ContainerTypesEnum.CT_NODE;

    public locationPost: LocationPost = this.getDefaultLocationPost();
    public tenantPost: TenantPost = this.getDefaultTenantPost();
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription();
    private readonly LocationsService = inject(LocationsService);
    private readonly TenantsService = inject(TenantsService);
    private readonly UsersService = inject(UsersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly modalService = inject(ModalService);

    public ngOnChanges(changes: SimpleChanges) {
        console.log('change');
        if (changes['parentContainerTypeId']) {
            this.parentContainerTypeId = changes['parentContainerTypeId'].currentValue;
            this.availableContainerTypes = this.getOptionsForContainerTypeSelect();

            if (this.parentContainerTypeId === ContainerTypesEnum.CT_GLOBAL) {
                this.currentContainerTypeId = ContainerTypesEnum.CT_TENANT;
            } else {
                this.currentContainerTypeId = ContainerTypesEnum.CT_NODE;
            }
        }
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
                parent_id: this.parentContainerId
            }
        }
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
        }
    }

    public submitLocation() {

    }

    public submitTenant() {
        this.subscriptions.add(this.TenantsService.add(this.tenantPost)
            .subscribe((result) => {
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Tenant');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['tenants', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.tenantPost = this.getDefaultTenantPost();
                    this.errors = null;
                    this.completed.emit(true);
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

    }

    public getOptionsForContainerTypeSelect(): SelectKeyValue[] {
        const types: SelectKeyValue[] = []

        if (this.parentContainerTypeId === ContainerTypesEnum.CT_GLOBAL) {
            types.push({key: ContainerTypesEnum.CT_TENANT, value: this.TranslocoService.translate('Tenant')});
        }

        if (this.parentContainerTypeId !== ContainerTypesEnum.CT_GLOBAL) {
            types.push({key: ContainerTypesEnum.CT_LOCATION, value: this.TranslocoService.translate('Node')});
            types.push({key: ContainerTypesEnum.CT_NODE, value: this.TranslocoService.translate('Location')});

        }
        return types;
    }

    protected readonly ContainerTypesEnum = ContainerTypesEnum;
}

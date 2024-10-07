import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormLabelDirective,
    ModalService,
    RowComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ContainersService } from '../containers.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { ContainerTypesEnum, ROOT_CONTAINER } from '../../changelogs/object-types.enum';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { CommonModule, JsonPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { ContainersIndexContainer, ContainersIndexNested, DataForCreateContainerModal } from '../containers.interface';
import { NestLoaderComponent } from '../../../layouts/primeng/loading/nest-loader/nest-loader.component';
import { ContainerNestComponent } from './container-nest/container-nest.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { PermissionsService } from '../../../permissions/permissions.service';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { CreateContainerModalComponent } from './create-container-modal/create-container-modal.component';
import { EditContainerModalComponent } from './edit-container-modal/edit-container-modal.component';

@Component({
    selector: 'oitc-containers-index',
    standalone: true,
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardBodyComponent,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NgIf,
        RequiredIconComponent,
        SelectComponent,
        RowComponent,
        ColComponent,
        JsonPipe,
        NestLoaderComponent,
        ContainerNestComponent,
        LabelLinkComponent,
        NgSwitchCase,
        TranslocoPipe,
        NgSwitch,
        CommonModule,
        DeleteAllModalComponent,
        CreateContainerModalComponent,
        EditContainerModalComponent
    ],
    templateUrl: './containers-index.component.html',
    styleUrl: './containers-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: ContainersService} // Inject the ContainersService into the DeleteAllModalComponent
    ]
})
export class ContainersIndexComponent implements OnInit, OnDestroy {

    public containers?: SelectKeyValue[] = [];

    public selectedContainerId: number = 0;
    public nestedContainers: ContainersIndexNested[] = [];
    public isLoading: boolean = false;

    // Used for the delete all modal
    public selectedItems: any[] = [];

    // For the create modal
    public dataForCreateContainerModal: DataForCreateContainerModal = {
        parentContainerId: ROOT_CONTAINER,
        parentContainerTypeId: ContainerTypesEnum.CT_GLOBAL
    };

    // For the edit modal
    public selectedContainerForEdit?: ContainersIndexContainer;

    private subscriptions: Subscription = new Subscription();
    public readonly PermissionsService = inject(PermissionsService);
    private readonly ContainersService = inject(ContainersService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    public ngOnInit(): void {

        this.loadContainersForSelect();

        // This subscription is used to reload the container tree, when the ID in the URL changes.
        // This will happen in the following cases:
        // - The user navigates to /containers/index and select a ID form the dropdown
        // - The user navigates to /containers/index/ID directly
        // - The user click on a CT_NODE link the tree
        this.subscriptions.add(this.route.params.subscribe(
            params => {
                if (params.hasOwnProperty('id')) {
                    const id = Number(params['id']);
                    if (id) {
                        this.selectedContainerId = id;
                        this.loadContainers(id);
                    }
                }
            }
        ));

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onContainerChange(event: any) {
        // Clear the current container tree
        this.nestedContainers = [];

        // Update the URL with the new container ID
        this.router.navigate(['/', 'containers', 'index', this.selectedContainerId], {
            queryParamsHandling: 'merge'
        });

        // Load new container tree
        //this.loadContainers(this.selectedContainerId);
        // The reload will be done by the subscription to the route params
        // see ngOnInit method for details
    }

    public loadContainers(id: number, showLoader: boolean = true): void {
        if (showLoader) {
            this.isLoading = true;
        }
        this.subscriptions.add(this.ContainersService.loadContainersByContainerId(id).subscribe(containers => {
            this.nestedContainers = containers;
            this.isLoading = false;
        }));
    }

    public loadContainersForSelect(): void {
        this.subscriptions.add(this.ContainersService.loadAllContainers().subscribe(containers => {
            this.containers = containers;
        }));
    }


    public getIconByContainerType(containerType: number): IconProp {
        switch (containerType) {
            case ContainerTypesEnum.CT_GLOBAL:
                return ['fas', 'globe'];

            case ContainerTypesEnum.CT_TENANT:
                return ['fas', 'home'];

            case ContainerTypesEnum.CT_LOCATION:
                return ['fas', 'location-arrow'];

            case ContainerTypesEnum.CT_NODE:
                return ['fas', 'link'];

            case ContainerTypesEnum.CT_CONTACTGROUP:
                return ['fas', 'users'];

            case ContainerTypesEnum.CT_HOSTGROUP:
                return ['fas', 'server'];

            case ContainerTypesEnum.CT_SERVICEGROUP:
                return ['fas', 'cogs'];

            case ContainerTypesEnum.CT_SERVICETEMPLATEGROUP:
                return ['fas', 'pen-to-square'];

            default:
                return ['fas', 'question'];
        }
    }

    public toggleCreateContainerModal(container: ContainersIndexContainer): void {
        this.dataForCreateContainerModal = {
            parentContainerId: container.id,
            parentContainerTypeId: container.containertype_id
        };

        this.modalService.toggle({
            show: true,
            id: 'createContainerModal',
        });
    }

    public toggleDeleteAllModal(container: ContainersIndexContainer): void {
        let items: DeleteAllItem[] = [];
        if (container.allowEdit) {
            items = [{
                id: container.id,
                displayName: container.name
            }];
        }

        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }

        // Pass selection to the modal
        this.selectedItems = items;
        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    // We do not really make mass changes as we only delete, add or edit one container at a time
    // but to be consistent with the other components, we keep the name
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadContainers(this.selectedContainerId, false);
        }
    }

    public editContainer(container: ContainersIndexContainer): void {
        this.selectedContainerForEdit = container;

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'editContainerModal',
        });
    }

    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
    protected readonly ContainerTypesEnum = ContainerTypesEnum;
}

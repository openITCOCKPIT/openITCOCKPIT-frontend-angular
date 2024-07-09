import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { NgForOf, NgIf } from '@angular/common';
import { NotUsedByObjectComponent } from '../../../layouts/coreui/not-used-by-object/not-used-by-object.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    getDefaultServicetemplatesUsedByParams,
    HostWithServices,
    ServicetemplateEntity,
    ServicetemplatesUsedByParams,
    ServicetemplatesUsedByService
} from '../../servicetemplates/servicetemplates.interface';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { Subscription } from 'rxjs';
import { ServicetemplatesService } from '../servicetemplates.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { ServicesService } from '../../services/services.service';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { PaginatorModule } from 'primeng/paginator';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';

@Component({
    selector: 'oitc-servicetemplates-used-by',
    standalone: true,
    imports: [
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        CoreuiComponent,
        DeleteAllModalComponent,
        DropdownDividerDirective,
        FaIconComponent,
        ItemSelectComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NotUsedByObjectComponent,
        PermissionDirective,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        PaginatorModule,
        FormLoaderComponent
    ],
    templateUrl: './servicetemplates-used-by.component.html',
    styleUrl: './servicetemplates-used-by.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: ServicesService} // Inject the ServicesService into the DeleteAllModalComponent
    ]
})
export class ServicetemplatesUsedByComponent implements OnInit, OnDestroy {
    public hostsWithServices: HostWithServices[] = [];
    public servicetemplate?: ServicetemplateEntity;
    public total: number = 0;
    public selectedItems: DeleteAllItem[] = [];

    public params: ServicetemplatesUsedByParams = getDefaultServicetemplatesUsedByParams();

    private servicetemplateId: number = 0;
    private subscriptions: Subscription = new Subscription();
    private ServicetemplatesService = inject(ServicetemplatesService);
    protected PermissionsService = inject(PermissionsService);
    private readonly modalService = inject(ModalService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);

    private router = inject(Router);
    private route = inject(ActivatedRoute)

    public ngOnInit(): void {
        this.servicetemplateId = Number(this.route.snapshot.paramMap.get('id'));
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.ServicetemplatesService.usedBy(this.servicetemplateId, this.params)
            .subscribe((result) => {
                this.hostsWithServices = result.hostsWithServices;
                this.servicetemplate = result.servicetemplate;
                this.total = result.count
            }));
    }

    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.load();
    }


    // Open the Delete All Modal
    public toggleDeleteAllModal(service?: ServicetemplatesUsedByService) {
        let items: DeleteAllItem[] = [];

        if (service) {
            // User just want to delete a single contact
            items = [
                {
                    id: Number(service.id),
                    displayName: service.hostname + '/' + service.servicename
                }
            ];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.id,
                    displayName: item.hostname + '/' + item.servicename
                };
            });
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
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.load();
        }
    }
}

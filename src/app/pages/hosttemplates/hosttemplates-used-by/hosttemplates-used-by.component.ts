import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HosttemplatesService } from '../hosttemplates.service';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NgForOf, NgIf } from '@angular/common';
import { NotUsedByObjectComponent } from '../../../layouts/coreui/not-used-by-object/not-used-by-object.component';
import { HostObjectCake2 } from '../../hosts/hosts.interface';
import { HosttemplateEntity } from '../hosttemplates.interface';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { PermissionsService } from '../../../permissions/permissions.service';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { HostsService } from '../../hosts/hosts.service';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';

@Component({
    selector: 'oitc-hosttemplates-used-by',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        NavComponent,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        NgIf,
        NotUsedByObjectComponent,
        NavItemComponent,
        ContainerComponent,
        NgForOf,
        TableDirective,
        ItemSelectComponent,
        TranslocoPipe,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        DeleteAllModalComponent,
        ColComponent,
        RowComponent,
        SelectAllComponent,
        FormLoaderComponent
    ],
    templateUrl: './hosttemplates-used-by.component.html',
    styleUrl: './hosttemplates-used-by.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: HostsService} // Inject the ContactsService into the DeleteAllModalComponent
    ]
})
export class HosttemplatesUsedByComponent implements OnInit, OnDestroy {

    public hosts: HostObjectCake2[] = [];
    public hosttemplate?: HosttemplateEntity;
    public total: number = 0;
    public selectedItems: DeleteAllItem[] = [];

    private hosttemplateId: number = 0;
    private subscriptions: Subscription = new Subscription();
    private HosttemplatesService = inject(HosttemplatesService);
    protected PermissionsService = inject(PermissionsService);
    private readonly modalService = inject(ModalService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);

    private router = inject(Router);
    private route = inject(ActivatedRoute);

    public ngOnInit(): void {
        this.hosttemplateId = Number(this.route.snapshot.paramMap.get('id'));
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.HosttemplatesService.usedBy(this.hosttemplateId)
            .subscribe((result) => {
                this.hosts = result.all_hosts;
                this.hosttemplate = result.hosttemplate;
                this.total = result.all_hosts.length;
            }));
    }


    // Open the Delete All Modal
    public toggleDeleteAllModal(host?: HostObjectCake2) {
        let items: DeleteAllItem[] = [];

        if (host) {
            // User just want to delete a single contact
            items = [
                {
                    id: Number(host.Host.id),
                    displayName: String(host.Host.name)
                }
            ];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Host.id,
                    displayName: item.Host.name
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

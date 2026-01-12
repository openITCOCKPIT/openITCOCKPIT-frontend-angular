import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutoreportsService } from '../autoreports.service';
import {
    AutoreportServiceUsedByResponse,
    AutoreportObject, AutoreportIndex
} from '../autoreports.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    DropdownDividerDirective,
    NavComponent,
    NavItemComponent,
    TableDirective,
    ModalService
} from '@coreui/angular';

import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Component({
    selector: 'oitc-autoreport-service-used-by',
    imports: [
    TranslocoDirective,
    FaIconComponent,
    PermissionDirective,
    RouterLink,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    BackButtonDirective,
    NavItemComponent,
    XsButtonDirective,
    CardBodyComponent,
    TableLoaderComponent,
    MatSort,
    TableDirective,
    ActionsButtonComponent,
    ActionsButtonElementComponent,
    DropdownDividerDirective,
    DeleteAllModalComponent
],
    templateUrl: './autoreport-service-used-by.component.html',
    styleUrl: './autoreport-service-used-by.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: AutoreportsService} // Inject the CommandsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportServiceUsedByComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private subscriptions: Subscription = new Subscription();
    private readonly AutoreportsService: AutoreportsService = inject(AutoreportsService);
    private readonly modalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);

    public service_id: number = 0;
    public autoreportsWithService!: AutoreportServiceUsedByResponse;
    public selectedItems: DeleteAllItem[] = [];

    public ngOnInit(): void {

        this.service_id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadReportsUsedByService();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadReportsUsedByService() {
        this.subscriptions.add(this.AutoreportsService.serviceUsedByAutoreport(this.service_id).subscribe(data => {
            this.autoreportsWithService = data;
            this.cdr.markForCheck();
        }));
    }

    public toggleDeleteAllModal(autoreport: AutoreportObject) {
        let items: DeleteAllItem[] = [];
        if (autoreport) {
            // User just want to delete a single command
            items = [{
                id: autoreport.id,
                displayName: autoreport.name
            }];
        }
        this.selectedItems = items;

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }

    public onMassActionComplete(success: boolean): void {
        if (success) {
            this.loadReportsUsedByService()
        }
    }

}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IndexPage } from '../../../../../pages.interface';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { getDefaultMapUploadsParams, MapUploadsParams, Upload, UploadsIconsRoot } from '../backgrounduploads.interface';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { AsyncPipe } from '@angular/common';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { BackgrounduploadsIconsService } from './backgrounduploads-icons.service';

@Component({
    selector: 'oitc-backgrounduploads-icons',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        LabelLinkComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        TooltipDirective,
        ItemSelectComponent,
        AsyncPipe,
        DropdownDividerDirective,
        DeleteAllModalComponent
    ],
    templateUrl: './backgrounduploads-icons.component.html',
    styleUrl: './backgrounduploads-icons.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: BackgrounduploadsIconsService} // Inject the BackgrounduploadsIconsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgrounduploadsIconsComponent implements OnInit, OnDestroy, IndexPage {

    public params: MapUploadsParams = getDefaultMapUploadsParams();
    public icons?: UploadsIconsRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];
    public activeTab = 'icons';

    private subscriptions: Subscription = new Subscription();
    private readonly BackgrounduploadsIconsService = inject(BackgrounduploadsIconsService);
    private readonly SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.loadIcons();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadIcons() {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(
            this.BackgrounduploadsIconsService.getIcons(this.params).subscribe((icons) => {
                this.icons = icons;
                this.cdr.markForCheck();
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.loadIcons();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadIcons();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadIcons();
    }


    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadIcons();
        }
    }

    public resetFilter() {
        this.params = getDefaultMapUploadsParams();
        this.loadIcons();
    }

    // Open the Delete All Modal

    public toggleDeleteAllModal(icon?: Upload) {

        let items: DeleteAllItem[] = [];

        if (icon) {
            // User just want to delete a single command
            items = [{
                id: icon.saved_name,
                displayName: String(icon.upload_name)
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.saved_name,
                    displayName: item.upload_name
                };
            });
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
}

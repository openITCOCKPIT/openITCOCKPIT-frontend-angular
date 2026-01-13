import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
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
    TableDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';

import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { IndexPage } from '../../../../../pages.interface';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { getDefaultMkchecksIndexParams, Mkcheck, MkchecksIndexParams, MkchecksIndexRoot } from '../mkchecks.interface';
import { MkchecksService } from '../mkchecks.service';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { ServicetemplateTypesEnum } from '../../../../../pages/servicetemplates/servicetemplate-types.enum';
import { FormsModule } from '@angular/forms';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';

@Component({
    selector: 'oitc-mkchecks-index',
    imports: [
    TranslocoDirective,
    RouterLink,
    FaIconComponent,
    PermissionDirective,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent,
    XsButtonDirective,
    CardBodyComponent,
    ContainerComponent,
    RowComponent,
    ColComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective,
    DebounceDirective,
    TranslocoPipe,
    TableLoaderComponent,
    TableDirective,
    MatSort,
    ItemSelectComponent,
    ActionsButtonComponent,
    ActionsButtonElementComponent,
    DropdownDividerDirective,
    NoRecordsComponent,
    SelectAllComponent,
    PaginateOrScrollComponent,
    CardFooterComponent,
    FormsModule,
    MatSortHeader,
    LabelLinkComponent,
    DeleteAllModalComponent
],
    templateUrl: './mkchecks-index.component.html',
    styleUrl: './mkchecks-index.component.css',
    providers: [
        { provide: DELETE_SERVICE_TOKEN, useClass: MkchecksService } // Inject the ServicesService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MkchecksIndexComponent implements OnInit, OnDestroy, IndexPage {

    public params: MkchecksIndexParams = getDefaultMkchecksIndexParams();
    public mkchecks?: MkchecksIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly MkchecksService = inject(MkchecksService);
    private readonly SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService = inject(TranslocoService);
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

            this.loadMkchecks();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadMkchecks(): void {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(
            this.MkchecksService.getIndex(this.params).subscribe((mkchecks) => {
                this.mkchecks = mkchecks;
                this.cdr.markForCheck();
            })
        );
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public onFilterChange(event: Event): void {
        this.params.page = 1;
        this.loadMkchecks();
    }

    public onSortChange(sort: Sort): void {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadMkchecks();
        }
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadMkchecks();
    }

    public resetFilter(): void {
        this.params = getDefaultMkchecksIndexParams();
        this.loadMkchecks();
    }

    public onMassActionComplete(success: boolean): void {
        if (success) {
            this.loadMkchecks();
        }
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(mkcheck?: Mkcheck) {
        let items: DeleteAllItem[] = [];

        if (mkcheck) {
            // User just want to delete a single command
            items = [{
                id: Number(mkcheck.id),
                displayName: String(mkcheck.name)
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.id,
                    displayName: item.name
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


    protected readonly ServicetemplateTypesEnum = ServicetemplateTypesEnum;
}

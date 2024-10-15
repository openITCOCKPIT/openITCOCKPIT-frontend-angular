import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutomapsService } from '../automaps.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { IndexPage } from '../../../pages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    QueryHandlerCheckerComponent
} from '../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
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
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { NgForOf, NgIf } from '@angular/common';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import {
    AutomapEntity,
    AutomapsIndexParams,
    AutomapsIndexRoot,
    getDefaultAutomapsIndexParams
} from '../automaps.interface';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { PermissionsService } from '../../../permissions/permissions.service';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DisableModalComponent } from '../../../layouts/coreui/disable-modal/disable-modal.component';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';

@Component({
    selector: 'oitc-automaps-index',
    standalone: true,
    imports: [
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        QueryHandlerCheckerComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        PaginatorModule,
        RowComponent,
        TranslocoPipe,
        MatSort,
        NgIf,
        TableDirective,
        TableLoaderComponent,
        MatSortHeader,
        ItemSelectComponent,
        NgForOf,
        BadgeComponent,
        BadgeOutlineComponent,
        TooltipDirective,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        DeleteAllModalComponent,
        DisableModalComponent,
        NoRecordsComponent,
        SelectAllComponent,
        CardFooterComponent,
        PaginateOrScrollComponent
    ],
    templateUrl: './automaps-index.component.html',
    styleUrl: './automaps-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: AutomapsService} // Inject the AutomapsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomapsIndexComponent implements OnInit, OnDestroy, IndexPage {

    public params: AutomapsIndexParams = getDefaultAutomapsIndexParams();
    public automaps?: AutomapsIndexRoot;
    public hideFilter: boolean = true;

    public selectedItems: any[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly AutomapsService = inject(AutomapsService);
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService: NotyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.loadAutomaps();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public onFilterChange(event: Event): void {
        this.params.page = 1;
        this.loadAutomaps();
    }

    public onMassActionComplete(success: boolean): void {
        if (success) {
            this.loadAutomaps();
        }
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadAutomaps();
    }

    public onSortChange(sort: Sort): void {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadAutomaps();
        }
    }

    public resetFilter(): void {
        this.params = getDefaultAutomapsIndexParams();
        this.loadAutomaps();
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public loadAutomaps() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.AutomapsService.getIndex(this.params).subscribe(automaps => {
            this.automaps = automaps;
            this.cdr.markForCheck();
        }));
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(automap?: AutomapEntity) {
        let items: DeleteAllItem[] = [];

        if (automap) {
            // User just want to delete a single command
            items = [{
                id: Number(automap.id),
                displayName: String(automap.name)
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

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'automaps', 'copy', ids]);
        }
    }

}

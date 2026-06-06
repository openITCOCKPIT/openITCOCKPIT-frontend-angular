import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IndexPage } from '../../../pages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import {
    getDefaultInstantreportEvaluationTypesFilter,
    getDefaultInstantreportsIndexObjectTypesFilter,
    getDefaultInstantreportsIndexParams,
    InstantreportEvaluationTypesFilter,
    InstantreportIndex,
    InstantreportsIndexObjectTypesFilter,
    InstantreportsIndexParams,
    InstantreportsIndexRoot
} from '../instantreports.interface';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import _ from 'lodash';
import { InstantreportsService } from '../instantreports.service';
import {
    AlertComponent,
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
    TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { InstantreportEvaluationTypes, InstantreportObjectTypes } from '../instantreports.enums';

import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { NotyService } from '../../../layouts/coreui/noty.service';


@Component({
    selector: 'oitc-instantreports-index',
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        CardBodyComponent,
        CardFooterComponent,
        RouterLink,
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
        RowComponent,
        TranslocoPipe,
        TableLoaderComponent,
        MatSort,
        MatSortHeader,
        TableDirective,
        NoRecordsComponent,
        SelectAllComponent,
        PaginateOrScrollComponent,
        ItemSelectComponent,
        BadgeOutlineComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        DeleteAllModalComponent,
        AlertComponent
    ],
    templateUrl: './instantreports-index.component.html',
    styleUrl: './instantreports-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: InstantreportsService} // Inject the CommandsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstantreportsIndexComponent implements OnInit, OnDestroy, IndexPage {

    public hideFilter: boolean = true;
    public instantreports!: InstantreportsIndexRoot;
    public params: InstantreportsIndexParams = getDefaultInstantreportsIndexParams();
    public objectTypesFilter: InstantreportsIndexObjectTypesFilter = getDefaultInstantreportsIndexObjectTypesFilter()
    public evaluationTypesFilter: InstantreportEvaluationTypesFilter = getDefaultInstantreportEvaluationTypesFilter()

    public selectedItems: DeleteAllItem[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService: NotyService = inject(NotyService);
    private readonly InstantreportsService: InstantreportsService = inject(InstantreportsService);
    private readonly modalService = inject(ModalService);

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.loadInstantreports();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public onFilterChange(event: Event): void {
        this.params.page = 1;
        this.loadInstantreports();
    }

    public onMassActionComplete(success: boolean): void {
        if (success) {
            this.loadInstantreports();
        }
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadInstantreports();
    }

    public onSortChange(sort: Sort): void {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadInstantreports();
        }
    }

    public resetFilter(): void {
        this.params = getDefaultInstantreportsIndexParams();
        this.objectTypesFilter = getDefaultInstantreportsIndexObjectTypesFilter()
        this.evaluationTypesFilter = getDefaultInstantreportEvaluationTypesFilter()

        this.loadInstantreports();
    }

    public loadInstantreports(): void {
        this.SelectionServiceService.deselectAll();


        this.params['filter[Instantreports.type][]'] = Object.keys(_.pickBy(this.objectTypesFilter, (value, key) => value === true));
        this.params['filter[Instantreports.evaluation][]'] = Object.keys(_.pickBy(this.evaluationTypesFilter, (value, key) => value === true));

        this.subscriptions.add(this.InstantreportsService.getIndex(this.params).subscribe(data => {
            this.instantreports = data;
            this.cdr.markForCheck();
        }));

    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(instantreport?: InstantreportIndex) {
        let items: DeleteAllItem[] = [];

        if (instantreport) {
            // User just want to delete a single command
            items = [{
                id: instantreport.Instantreport.id,
                displayName: instantreport.Instantreport.name
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Instantreport.id,
                    displayName: item.Instantreport.name
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


    protected readonly InstantreportObjectTypes = InstantreportObjectTypes;
    protected readonly InstantreportEvaluationTypes = InstantreportEvaluationTypes;
}

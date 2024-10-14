import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
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
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    getDefaultHosttemplatesIndexParams,
    HosttemplateIndex,
    HosttemplateIndexRoot,
    HosttemplatesIndexParams
} from '../hosttemplates.interface';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { HosttemplateTypesEnum } from '../hosttemplate-types.enum';
import { HosttemplatesService } from '../hosttemplates.service';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { IndexPage } from '../../../pages.interface';

@Component({
    selector: 'oitc-hosttemplates-index',
    standalone: true,
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
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
        ReactiveFormsModule,
        RowComponent,
        TranslocoPipe,
        FormErrorDirective,
        NgSelectModule,
        NgOptionHighlightModule,
        JsonPipe,
        CardFooterComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        SelectAllComponent,
        TableDirective,
        NgClass,
        DeleteAllModalComponent,
        MultiSelectModule,
        MultiSelectComponent,
        TableLoaderComponent
    ],
    templateUrl: './hosttemplates-index.component.html',
    styleUrl: './hosttemplates-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: HosttemplatesService} // Inject the HosttemplatesService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HosttemplatesIndexComponent implements OnInit, OnDestroy, IndexPage {

    public params: HosttemplatesIndexParams = getDefaultHosttemplatesIndexParams();
    public hosttemplates?: HosttemplateIndexRoot;
    public hideFilter: boolean = true;

    public hosttemplateTypes: any[] = [];
    public selectedItems: DeleteAllItem[] = [];

    private readonly HosttemplatesService = inject(HosttemplatesService);
    private subscriptions: Subscription = new Subscription();
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly modalService = inject(ModalService);

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.hosttemplateTypes = this.HosttemplatesService.getHosttemplateTypes();

        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            let id = params['id'];
            if (id) {
                this.params['filter[Hosttemplates.id][]'] = [].concat(id); // make sure we always get an array
            }

            this.loadHosttemplates();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadHosttemplates() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.HosttemplatesService.getIndex(this.params)
            .subscribe((result) => {
                this.hosttemplates = result;
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
        this.loadHosttemplates();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadHosttemplates();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadHosttemplates();
    }

    public resetFilter() {
        this.params = getDefaultHosttemplatesIndexParams();
        this.loadHosttemplates();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(hosttemplate?: HosttemplateIndex) {
        let items: DeleteAllItem[] = [];

        if (hosttemplate) {
            // User just want to delete a single command
            items = [{
                id: hosttemplate.Hosttemplate.id,
                displayName: hosttemplate.Hosttemplate.name
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Hosttemplate.id,
                    displayName: item.Hosttemplate.name
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
            this.loadHosttemplates();
        }
    }

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.Hosttemplate.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'hosttemplates', 'copy', ids]);
        }
    }

    protected readonly HosttemplateTypesEnum = HosttemplateTypesEnum;
}

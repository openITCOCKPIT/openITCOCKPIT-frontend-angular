import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    AlertComponent,
    AlertHeadingDirective,
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
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
    TemplateIdDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { TrueFalseDirective } from '../../../directives/true-false.directive';

import {
    Downtime,
    DowntimeServiceIndexRoot,
    getDefaultServiceDowntimesParams,
    ServiceDowntimesParams
} from '../downtimes.interface';
import { Subscription } from 'rxjs';
import { AsyncPipe, formatDate, NgForOf, NgIf } from '@angular/common';
import { DowntimesService } from '../downtimes.service';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { DowntimeSimpleIconComponent } from '../downtime-simple-icon/downtime-simple-icon.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import {
    CancelServicedowntimeModalComponent
} from '../cancel-servicedowntime-modal/cancel-servicedowntime-modal.component';
import { CancelAllItem } from '../cancel-servicedowntime-modal/cancel-servicedowntime.interface';
import { PermissionsService } from '../../../permissions/permissions.service';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';


@Component({
    selector: 'oitc-downtimes-service',
    standalone: true,
    imports: [
        CardComponent,
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
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
        TrueFalseDirective,
        MatSort,
        MatSortHeader,
        NgForOf,
        NgIf,
        TableDirective,
        ItemSelectComponent,
        DowntimeSimpleIconComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        SelectAllComponent,
        AlertComponent,
        TemplateIdDirective,
        ButtonCloseDirective,
        AlertHeadingDirective,
        CancelServicedowntimeModalComponent,
        DropdownComponent,
        DropdownMenuDirective,
        DropdownToggleDirective,
        DropdownItemDirective,
        TableLoaderComponent,
        AsyncPipe
    ],
    templateUrl: './downtimes-service.component.html',
    styleUrl: './downtimes-service.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: DowntimesService} // Inject the DowntimesService into the CancelAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DowntimesServiceComponent implements OnInit, OnDestroy {
    private DowntimesService = inject(DowntimesService)

    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: ServiceDowntimesParams = getDefaultServiceDowntimesParams();
    public serviceDowntimes?: DowntimeServiceIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: CancelAllItem[] = [];
    private subscriptions: Subscription = new Subscription();
    private readonly modalService = inject(ModalService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    public from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            this.loadServiceDowntimes();
        }));
    }

    public ngOnDestroy(): void {
    }

    public loadServiceDowntimes() {
        this.SelectionServiceService.deselectAll();

        this.params['filter[from]'] = formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US');
        this.params['filter[to]'] = formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US');

        this.subscriptions.add(this.DowntimesService.getServiceDowntimes(this.params)
            .subscribe((result) => {
                this.serviceDowntimes = result;
                this.cdr.markForCheck();
            })
        );
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultServiceDowntimesParams();
        this.from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.loadServiceDowntimes();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadServiceDowntimes();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadServiceDowntimes();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadServiceDowntimes();
        }
    }

    // Open the Delete All Modal
    public toggleCancelDowntimeModal(serviceDowntime?: Downtime) {
        let items: CancelAllItem[] = [];
        if (serviceDowntime) {
            // User just want to delete a single command

            items = [{
                id: serviceDowntime.internalDowntimeId
            }];


        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): CancelAllItem => {
                return {
                    id: item
                };
            });
        }

        // Pass selection to the modal
        this.selectedItems = items;
        this.cdr.markForCheck();

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'cancelServiceAllModal',
        });
    }


    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadServiceDowntimes();
        }
    }
}

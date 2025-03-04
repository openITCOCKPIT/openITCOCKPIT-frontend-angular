import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    FormControlDirective,
    FormDirective,
    HeaderComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { IndexPage } from '../../../../../pages.interface';
import { Subscription } from 'rxjs';
import { SatellitesService } from '../satellites.service';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import {
    AllIndexSatellite,
    getDefaultSatelliteIndexParams,
    SatelliteIndex,
    SatelliteIndexParams
} from '../satellites.interface';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { BadgeOutlineComponent } from '../../../../../layouts/coreui/badge-outline/badge-outline.component';

@Component({
    selector: 'oitc-satellites-index',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormsModule,
        HeaderComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        MatSort,
        MatSortHeader,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        RowComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        ItemSelectComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        BadgeOutlineComponent
    ],
    templateUrl: './satellites-index.component.html',
    styleUrl: './satellites-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SatellitesIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly SatellitesService: SatellitesService = inject(SatellitesService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);

    protected selectedItems: DeleteAllItem[] = [];
    protected params: SatelliteIndexParams = getDefaultSatelliteIndexParams();
    protected hideFilter: boolean = true;
    protected readonly syncMethods: SelectKeyValueString[] = [
        {value: 'SSH', key: 'ssh'},
        {value: this.TranslocoService.translate('HTTPS pull mode'), key: 'https_pull'},
        {value: this.TranslocoService.translate('HTTPS push mode'), key: 'https_push'},
    ]

    protected result: SatelliteIndex = {
        all_satellites: []
    } as SatelliteIndex;

    public reload() {
        this.subscriptions.add(this.SatellitesService.getSatellitesIndex(this.params)
            .subscribe((result: SatelliteIndex) => {
                this.result = result;
                this.cdr.markForCheck();

            }));
    }

    public ngOnInit() {
        this.reload();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }


    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.reload();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.reload();
    }

    public resetFilter() {
        this.params = getDefaultSatelliteIndexParams();
        this.reload();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.reload();
        }
    }

    public onMassActionComplete(success: boolean) {
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(satellite?: AllIndexSatellite) {
        let items: DeleteAllItem[] = [];
        if (satellite) {
            items = [
                {
                    id: satellite.id as number,
                    displayName: satellite.name
                }
            ];
        } else {
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.id,
                    displayName: item.full_name
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

}

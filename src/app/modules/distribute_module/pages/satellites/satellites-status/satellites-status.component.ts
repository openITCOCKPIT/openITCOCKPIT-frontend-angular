import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent, DropdownDividerDirective,
    FormControlDirective,
    FormDirective,
    HeaderComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent, TableDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import {
    getDefaultSatellitesStatusParams,
    SatellitesStatusParams,
    SatelliteStatusIndex
} from '../satellites.interface';
import { SelectKeyValue, SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { IndexPage } from '../../../../../pages.interface';
import { Subscription } from 'rxjs';
import { SatellitesService } from '../satellites.service';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NgForOf, NgIf } from '@angular/common';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { BadgeOutlineComponent } from '../../../../../layouts/coreui/badge-outline/badge-outline.component';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';

@Component({
    selector: 'oitc-satellites-status',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardComponent,
        HeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        MultiSelectComponent,
        ReactiveFormsModule,
        RowComponent,
        TranslocoPipe,
        NgIf,
        TableLoaderComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        BadgeOutlineComponent,
        DropdownDividerDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        NgForOf,
        TableDirective,
        NoRecordsComponent,
        PaginateOrScrollComponent
    ],
    templateUrl: './satellites-status.component.html',
    styleUrl: './satellites-status.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SatellitesStatusComponent implements OnInit, OnDestroy, IndexPage {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly SatellitesService: SatellitesService = inject(SatellitesService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);

    protected params: SatellitesStatusParams = getDefaultSatellitesStatusParams();
    protected hideFilter: boolean = true;
    protected readonly syncMethods: SelectKeyValueString[] = [
        {key: 'SSH', value: 'ssh'},
        {key: this.TranslocoService.translate('HTTPS pull mode'), value: 'https_pull'},
        {key: this.TranslocoService.translate('HTTPS push mode'), value: 'https_push'},
    ]
    protected readonly syncStatus: SelectKeyValue[] = [
        {key: 0, value: this.TranslocoService.translate('Unknown')},
        {key: 1, value: this.TranslocoService.translate('Success')},
        {key: 2, value: this.TranslocoService.translate('Error')},
    ];

    public reload() {
        this.subscriptions.add(this.SatellitesService.getStatusIndex(this.params)
            .subscribe((result: SatelliteStatusIndex) => {
                this.result = result;
                this.cdr.markForCheck();

            }));
    }


    protected result: SatelliteStatusIndex = {
        all_satellites: []
    } as SatelliteStatusIndex;

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
        this.params = getDefaultSatellitesStatusParams();
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
}

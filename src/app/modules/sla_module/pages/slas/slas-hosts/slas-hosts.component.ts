import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { SlasService } from '../Slas.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { getDefaultSlasHostsParams, SlasHostsParams, SlasHostsRoot } from '../Slas.interface';
import {
    AlertComponent,
    BadgeComponent,
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
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { CoreuiComponent } from '../../../../../layouts/coreui/coreui.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { PermissionsService } from '../../../../../permissions/permissions.service';

@Component({
    selector: 'oitc-slas-hosts',
    standalone: true,
    imports: [
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        CoreuiComponent,
        DebounceDirective,
        DeleteAllModalComponent,
        DropdownDividerDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
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
        NgClass,
        FaStackComponent,
        FaStackItemSizeDirective,
        BackButtonDirective,
        AlertComponent
    ],
    templateUrl: './slas-hosts.component.html',
    styleUrl: './slas-hosts.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: SlasService} // Inject the ContactsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlasHostsComponent implements OnInit, OnDestroy {

    private readonly SlasService: SlasService = inject(SlasService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public hideFilter: boolean = true;

    public slaAndHosts?: SlasHostsRoot;
    public params: SlasHostsParams = getDefaultSlasHostsParams();
    protected slaId: number = 0;
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.slaId = Number(this.route.snapshot.paramMap.get('id'));
        this.cdr.markForCheck();
        this.loadSlaHosts();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadSlaHosts() {
        this.subscriptions.add(this.SlasService.getSlaHosts(this.slaId, this.params)
            .subscribe((result: SlasHostsRoot) => {
                this.slaAndHosts = result;
                this.cdr.markForCheck();
            }));

    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultSlasHostsParams();
        this.loadSlaHosts();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadSlaHosts();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadSlaHosts();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadSlaHosts();
        }
    }
}

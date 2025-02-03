import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { BadgeOutlineComponent } from '../../../../../layouts/coreui/badge-outline/badge-outline.component';
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
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import {
    ResetPasswordModalComponent
} from '../../../../../components/reset-password-modal/reset-password-modal.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
    AllAlertRule,
    getDefaultPrometheusAlertRulesIndexParams,
    PrometheusAlertRulesIndexParams,
    PrometheusAlertRulesIndexRoot
} from '../prometheus-alert-rules.interface';
import { IndexPage } from '../../../../../pages.interface';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { PrometheusQueryService } from '../../PrometheusQuery/prometheus-query.service';
import { PrometheusAlertRulesService } from '../prometheus-alert-rules.service';
import { Subscription } from 'rxjs';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import {
    PrometheusPopoverGraphComponent
} from '../../../components/prometheus-popover-graph/prometheus-popover-graph.component';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../../../services/timezone.service';

@Component({
    selector: 'oitc-prometheus-alert-rules-index',
    imports: [
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        BadgeOutlineComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
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
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        ResetPasswordModalComponent,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        SelectComponent,
        PrometheusPopoverGraphComponent
    ],
    templateUrl: './prometheus-alert-rules-index.component.html',
    styleUrl: './prometheus-alert-rules-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: PrometheusAlertRulesService}
    ],
})
export class PrometheusAlertRulesIndexComponent implements OnInit, OnDestroy, IndexPage {
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly PrometheusQueryService: PrometheusQueryService = inject(PrometheusQueryService);
    private readonly PrometheusAlertRulesService: PrometheusAlertRulesService = inject(PrometheusAlertRulesService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly TimezoneService: TimezoneService = inject(TimezoneService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected selectedItems: DeleteAllItem[] = [];
    protected hosts: SelectKeyValue[] = [];
    protected params: PrometheusAlertRulesIndexParams = getDefaultPrometheusAlertRulesIndexParams();
    protected result: PrometheusAlertRulesIndexRoot | undefined = undefined;
    protected hideFilter: boolean = true;
    protected timezone!: TimezoneObject;


    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.reload();
        }
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(item?: AllAlertRule) {
        let items: DeleteAllItem[] = [];
        if (item) {
            // User just want to delete a single Service
            items = [
                {
                    id: item.id as number,
                    displayName: `${item.Hosts.name}/${item.servicename}`
                }
            ];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.id,
                    displayName: `${item.Hosts.name}/${item.servicename}`
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
        this.params = getDefaultPrometheusAlertRulesIndexParams();
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

    public ngOnInit() {
        this.getUserTimezone();
        this.loadHosts();

        const hostId = Number(this.route.snapshot.paramMap.get('hostId'));
        if (hostId) {
            this.params['filter[PrometheusAlertRules.host_id]'] = hostId;
            this.reload();
            this.cdr.markForCheck();
        }
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.timezone = data;
            this.cdr.markForCheck();
        }));
    }

    public reload() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.PrometheusAlertRulesService.getIndex(this.params)
            .subscribe((result: PrometheusAlertRulesIndexRoot) => {
                this.result = result;
                this.cdr.markForCheck();
            }));
    }

    private loadHosts(): void {
        this.subscriptions.add(this.PrometheusQueryService.loadHostsByString('')
            .subscribe((result: SelectKeyValue[]) => {
                this.hosts = result;
                this.cdr.markForCheck();
            }))
    }

}

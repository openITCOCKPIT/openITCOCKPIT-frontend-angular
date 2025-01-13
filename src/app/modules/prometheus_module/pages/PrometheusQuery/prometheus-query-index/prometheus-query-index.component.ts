import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { PrometheusQueryService } from '../prometheus-query.service';
import {
    getDefaultPrometheusQueryIndexParams,
    PrometheusQueryIndexParams,
    PrometheusQueryIndexRoot,
    PrometheusQueryIndexTarget,
    PrometheusQueryIndexTargetDatum
} from '../prometheus-query.interface';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PrometheusPopoverGraphComponent
} from '../../../components/prometheus-popover-graph/prometheus-popover-graph.component';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../../../services/timezone.service';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';

@Component({
    selector: 'oitc-prometheus-query-index',
    standalone: true,
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        SelectComponent,
        FormLabelDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
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
        DropdownDividerDirective,
        MatSort,
        MatSortHeader,
        NgForOf,
        TableDirective,
        NoRecordsComponent,
        PrometheusPopoverGraphComponent,
        FaStackComponent,
        FaStackItemSizeDirective,
        NgClass,
        OitcAlertComponent,
        ItemSelectComponent,
        SelectAllComponent
    ],
    templateUrl: './prometheus-query-index.component.html',
    styleUrl: './prometheus-query-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrometheusQueryIndexComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly PrometheusQueryService: PrometheusQueryService = inject(PrometheusQueryService);
    private readonly TimezoneService: TimezoneService = inject(TimezoneService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected hostId: number = 0;
    protected hosts: SelectKeyValue[] = [];
    protected params: PrometheusQueryIndexParams = getDefaultPrometheusQueryIndexParams();
    protected timezone!: TimezoneObject;

    protected index: PrometheusQueryIndexRoot = {
        targets: {
            data: [] as PrometheusQueryIndexTargetDatum[]
        } as PrometheusQueryIndexTarget
    } as PrometheusQueryIndexRoot;
    protected hideFilter: boolean = true;

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.timezone = data;
            this.cdr.markForCheck();
        }));
    }

    public ngOnInit(): void {
        this.getUserTimezone();
        this.loadContainers();
    }

    private loadContainers(): void {
        this.subscriptions.add(this.PrometheusQueryService.loadHostsByString('')
            .subscribe((result: SelectKeyValue[]) => {
                this.hosts = result;
                this.cdr.markForCheck();
            }))
    }

    protected loadIndex(): void {
        this.subscriptions.add(this.PrometheusQueryService.getIndex(this.params)
            .subscribe((result: PrometheusQueryIndexRoot) => {
                this.index = result;
                this.cdr.markForCheck();
            }))
    }


    public onFilterChange(event: any): void {
        this.loadIndex();
    }

    public resetFilter(): void {
        this.params = getDefaultPrometheusQueryIndexParams();

        this.loadIndex();
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }


}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleDirective,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  NavComponent,
  NavItemComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';


import { PaginatorModule } from 'primeng/paginator';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';

import { Subscription } from 'rxjs';
import { CustomalertRulesService } from '../customalert-rules.service';
import {
    CustomAlertRuleServices,
    CustomAlertRulesServicesParams,
    getDefaultCustomAlertRulesServicesParams
} from '../customalert-rules.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { IndexPage } from '../../../../../pages.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-customalert-rules-services',
    imports: [
    FaIconComponent,
    PermissionDirective,
    TranslocoDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
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
    MatSort,
    PaginatorModule,
    RowComponent,
    TableDirective,
    TableLoaderComponent,
    TranslocoPipe,
    MatSortHeader,
    NoRecordsComponent,
    PaginateOrScrollComponent,
    RouterLink
],
    templateUrl: './customalert-rules-services.component.html',
    styleUrl: './customalert-rules-services.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertRulesServicesComponent implements OnInit, OnDestroy, IndexPage {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly CustomAlertRulesService: CustomalertRulesService = inject(CustomalertRulesService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly route = inject(ActivatedRoute);

    protected CustomAlertRuleId: number = 0;
    protected params: CustomAlertRulesServicesParams = getDefaultCustomAlertRulesServicesParams();
    protected result?: CustomAlertRuleServices;
    protected hideFilter: boolean = true;

    public ngOnInit(): void {

        this.CustomAlertRuleId = Number(this.route.snapshot.paramMap.get('id'));
        this.refresh();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.refresh();
    }

    public resetFilter() {
        this.params = getDefaultCustomAlertRulesServicesParams();
        this.refresh();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.refresh();
        }
    }


    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.refresh();
    }

    protected refresh(): void {
        this.subscriptions.add(this.CustomAlertRulesService.getServices(this.CustomAlertRuleId, this.params)
            .subscribe((result: CustomAlertRuleServices) => {
                this.result = result;
                this.cdr.markForCheck();
            }));
    }

    public onMassActionComplete(success: boolean): void {
        // Here are no mass actions, but I wanted to implement the IndexPage interface :-)
        return;
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }
}

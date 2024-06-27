import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent, TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { SnmpttService } from '../../../snmptt.service';
import {
    getDefaultSnmpttEntryIndexParams,
    SnmpttEntryIndexParams,
    SnmpttEntryIndexRoot
} from '../../../snmptt.interface';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import {
    HoststatusSimpleIconComponent
} from '../../../../../pages/hosts/hoststatus-simple-icon/hoststatus-simple-icon.component';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';


@Component({
    selector: 'oitc-snmptt-list-index',
    standalone: true,
    imports: [RouterModule, CardComponent, CoreuiComponent, FaIconComponent, PermissionDirective, TranslocoDirective, CardHeaderComponent, CardTitleDirective, NavComponent, NavItemComponent, XsButtonDirective, CardBodyComponent, ColComponent, ContainerComponent, DebounceDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, FormControlDirective, FormDirective, FormsModule, InputGroupComponent, InputGroupTextDirective, PaginatorModule, RowComponent, TranslocoPipe, TrueFalseDirective, HoststatusSimpleIconComponent, MatSort, MatSortHeader, NgForOf, NgIf, NoRecordsComponent, PaginateOrScrollComponent, TableDirective],
    templateUrl: './snmptt-list-index.component.html',
    styleUrl: './snmptt-list-index.component.css'
})
export class SnmpttListIndexComponent implements OnInit {
    private SnmpttService = inject(SnmpttService)
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: SnmpttEntryIndexParams = getDefaultSnmpttEntryIndexParams();

    public snmptt_entries?: SnmpttEntryIndexRoot;
    public hideFilter: boolean = true;
    private subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            this.loadSnmpttEntries();
        }));
    }

    public loadSnmpttEntries() {
        this.subscriptions.add(this.SnmpttService.getIndex(this.params)
            .subscribe((result) => {
                this.snmptt_entries = result;
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadSnmpttEntries();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadSnmpttEntries();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadSnmpttEntries();
        }
    }

    public resetFilter() {
        this.params = getDefaultSnmpttEntryIndexParams();
        this.loadSnmpttEntries();
    }

}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { LogentriesService } from '../logentries.service';

import { getDefaultLogentriesParams, LogentriesRoot, LogentryIndexParams } from '../logentries.interface';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NgForOf, NgIf } from '@angular/common';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { HoststatusSimpleIconComponent } from '../../hosts/hoststatus-simple-icon/hoststatus-simple-icon.component';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';

@Component({
    selector: 'oitc-logentries-index',
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
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        PaginatorModule,
        RowComponent,
        TranslocoPipe,
        TrueFalseDirective,
        MatSort,
        MatSortHeader,
        NgIf,
        TableDirective,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        ItemSelectComponent,
        NgForOf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        ContainerComponent,
        HoststatusSimpleIconComponent,
        TrustAsHtmlPipe
    ],
    templateUrl: './logentries-index.component.html',
    styleUrl: './logentries-index.component.css'
})
export class LogentriesIndexComponent implements OnInit, OnDestroy {
    private LogentriesService = inject(LogentriesService)
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: LogentryIndexParams = getDefaultLogentriesParams();

    public logentries?: LogentriesRoot;
    public hideFilter: boolean = true;
    private subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            this.loadLogentries();
        }));
    }

    public ngOnDestroy(): void {
    }


    public loadLogentries() {
        this.subscriptions.add(this.LogentriesService.getIndex(this.params)
            .subscribe((result) => {
                this.logentries = result;
                console.log(this.logentries);
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultLogentriesParams();
        this.loadLogentries();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadLogentries();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadLogentries();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadLogentries();
        }
    }

    protected readonly String = String;
}

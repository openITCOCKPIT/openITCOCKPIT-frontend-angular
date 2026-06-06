import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
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
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import {
    HostBrowserMenuConfig,
    HostsBrowserMenuComponent
} from '../../hosts/hosts-browser-menu/hosts-browser-menu.component';
import { HoststatusSimpleIconComponent } from '../../hosts/hoststatus-simple-icon/hoststatus-simple-icon.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { formatDate, NgClass } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorModule } from 'primeng/paginator';

import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { getHostStateForApi, HostNotificationsStateFilter } from '../../notifications/notifications.interface';
import { Subscription } from 'rxjs';
import { HostchecksService } from '../hostchecks.service';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { getDefaultHostchecksIndexParams, HostchecksIndexParams, HostchecksIndexRoot } from '../hostchecks.interface';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';

import { IndexPage } from '../../../pages.interface';
import { LocalNumberPipe } from '../../../pipes/local-number.pipe';

@Component({
    selector: 'oitc-hostchecks-index',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        HostsBrowserMenuComponent,
        HoststatusSimpleIconComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PaginatorModule,
        RowComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        TrueFalseDirective,
        XsButtonDirective,
        TrustAsHtmlPipe,
        NgClass,
        CardFooterComponent,
        LocalNumberPipe,
        TooltipDirective
    ],
    templateUrl: './hostchecks-index.component.html',
    styleUrl: './hostchecks-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostchecksIndexComponent implements OnInit, OnDestroy, IndexPage {
    private hostId: number = 0;
    private HostchecksService = inject(HostchecksService)
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);

    public params: HostchecksIndexParams = getDefaultHostchecksIndexParams();
    public stateFilter: HostNotificationsStateFilter = {
        recovery: false,
        down: false,
        unreachable: false
    };

    public state_typesFilter = {
        soft: false,
        hard: false
    };

    public hostchecks?: HostchecksIndexRoot;
    public hideFilter: boolean = true;
    private subscriptions: Subscription = new Subscription();
    public from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');

    public hostBrowserConfig?: HostBrowserMenuConfig;

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.hostId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadHostchecks();

        // Define the configuration for the HostBrowserMenuComponent because we know the hostId now
        this.hostBrowserConfig = {
            hostId: this.hostId,
            showReschedulingButton: false,
            showBackButton: true
        };
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadHostchecks() {
        this.params['filter[Hostchecks.state][]'] = getHostStateForApi(this.stateFilter);
        this.params['filter[from]'] = formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US');
        this.params['filter[to]'] = formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US');

        let state_type: string = '';
        if (this.state_typesFilter.soft !== this.state_typesFilter.hard) {
            state_type = '0';
            if (this.state_typesFilter.hard) {
                state_type = '1';
            }
        }
        this.params['filter[Hostchecks.state_type]'] = state_type;


        this.subscriptions.add(this.HostchecksService.getHostchecksIndex(this.hostId, this.params)
            .subscribe((result) => {
                this.hostchecks = result;
                this.cdr.markForCheck();
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultHostchecksIndexParams();
        this.from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.stateFilter = {
            recovery: false,
            down: false,
            unreachable: false
        };
        this.loadHostchecks();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadHostchecks();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadHostchecks();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadHostchecks();
        }
    }

    public onMassActionComplete(success: boolean) {
    }

    protected readonly String = String;
}

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
    TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import {
    HostBrowserMenuConfig,
    HostsBrowserMenuComponent
} from '../../hosts/hosts-browser-menu/hosts-browser-menu.component';
import { HoststatusSimpleIconComponent } from '../../hosts/hoststatus-simple-icon/hoststatus-simple-icon.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { formatDate } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorModule } from 'primeng/paginator';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { getHostStateForApi, HostNotificationsStateFilter } from '../../notifications/notifications.interface';
import { Subscription } from 'rxjs';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { AcknowledgementsService } from '../acknowledgements.service';
import {
    AcknowledgementsHostParams,
    AcknowledgementsHostRoot,
    getDefaultAcknowledgementsHostParams
} from '../acknowledgement.interface';

@Component({
    selector: 'oitc-acknowledgements-host',
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
    TrustAsHtmlPipe,
    XsButtonDirective,
    CardFooterComponent
],
    templateUrl: './acknowledgements-host.component.html',
    styleUrl: './acknowledgements-host.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcknowledgementsHostComponent implements OnInit, OnDestroy {
    private hostId: number = 0;
    private AcknowledgementsService = inject(AcknowledgementsService)
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);

    public params: AcknowledgementsHostParams = getDefaultAcknowledgementsHostParams();
    public stateFilter: HostNotificationsStateFilter = {
        recovery: false,
        down: false,
        unreachable: false
    };

    public hostAcknowledgements?: AcknowledgementsHostRoot;
    public hideFilter: boolean = true;
    private subscriptions: Subscription = new Subscription();
    public from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');

    private cdr = inject(ChangeDetectorRef);

    public hostBrowserConfig?: HostBrowserMenuConfig;

    public ngOnInit(): void {
        this.hostId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadHostacknowledgements();

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

    public loadHostacknowledgements() {
        this.params['filter[AcknowledgementHosts.state][]'] = getHostStateForApi(this.stateFilter);
        this.params['filter[from]'] = formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US');
        this.params['filter[to]'] = formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US');


        this.subscriptions.add(this.AcknowledgementsService.getAcknowledgementsHost(this.hostId, this.params)
            .subscribe((result) => {
                this.hostAcknowledgements = result;
                this.cdr.markForCheck();
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultAcknowledgementsHostParams();
        this.from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.stateFilter = {
            recovery: false,
            down: false,
            unreachable: false
        };
        this.loadHostacknowledgements();
        this.cdr.markForCheck();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadHostacknowledgements();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadHostacknowledgements();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadHostacknowledgements();
        }
    }
}

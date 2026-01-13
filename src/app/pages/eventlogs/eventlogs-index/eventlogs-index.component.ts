import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
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
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { formatDate } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { EventlogsIndex, EventlogsIndexParams, getDefaultEventlogsIndexParams } from '../eventlogs.interface';
import { EventlogsService } from '../eventlogs.service';
import { HttpParams } from '@angular/common/http';
import { IndexPage } from '../../../pages.interface';


@Component({
    selector: 'oitc-eventlogs-index',
    imports: [
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DebounceDirective,
    FaIconComponent,
    FormControlDirective,
    FormDirective,
    FormsModule,
    InputGroupComponent,
    InputGroupTextDirective,
    MatSort,
    MatSortHeader,
    NavComponent,
    NavItemComponent,
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
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    CardFooterComponent
],
    templateUrl: './eventlogs-index.component.html',
    styleUrl: './eventlogs-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventlogsIndexComponent implements OnInit, OnDestroy, IndexPage {
    private EventlogsService: EventlogsService = inject(EventlogsService);

    public readonly route = inject(ActivatedRoute);
    public params: EventlogsIndexParams = getDefaultEventlogsIndexParams();
    public eventlogs?: EventlogsIndex;
    public hideFilter: boolean = true;
    private subscriptions: Subscription = new Subscription();

    public from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');

    public tmpFilter = {
        Types: {
            login: true,
            user_delete: true,
            user_password_change: true
        }
    }

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            this.loadEventlogs();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadEventlogs() {

        this.params['filter[Eventlogs.type][]'] = [];
        this.params['types[]'] = [];
        for (let type in this.tmpFilter.Types) {
            if (this.tmpFilter.Types[type as keyof typeof this.tmpFilter.Types]) {
                this.params['filter[Eventlogs.type][]'].push(type);
                this.params['types[]'].push(type);
            }
        }

        if (this.params['types[]'].length === 0) {
            for (let type in this.tmpFilter.Types) {
                this.params['filter[Eventlogs.type][]'].push(type);
                this.params['types[]'].push(type);
            }
        }

        this.params['filter[from]'] = formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US');
        this.params['filter[to]'] = formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US');

        this.cdr.markForCheck();
        this.subscriptions.add(this.EventlogsService.getIndex(this.params)
            .subscribe((result: EventlogsIndex) => {
                this.eventlogs = result;
                this.cdr.markForCheck();
            })
        );
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultEventlogsIndexParams();

        this.from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');

        this.tmpFilter = {
            Types: {
                login: true,
                user_delete: true,
                user_password_change: true
            }
        }
        this.loadEventlogs();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadEventlogs();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadEventlogs();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadEventlogs();
        }
    }

    public linkFor(type: string) {
        let baseUrl: string = '/eventlogs/listToPdf.pdf?';
        if (type === 'csv') {
            baseUrl = '/eventlogs/listToCsv?';
        }

        let urlParams = {
            'angular': true,
            'sort': this.params.sort,
            'page': this.params.page,
            'direction': this.params.direction,
            'types[]': this.params['types[]'],
            'filter[Eventlogs.type][]': this.params['filter[Eventlogs.type][]'],
            'filter[name]': this.params['filter[name]'],
            'filter[user_email]': this.params['filter[user_email]'],
            'filter[from]': formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US'),
            'filter[to]': formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US')
        };

        let stringParams: HttpParams = new HttpParams();

        stringParams = stringParams.appendAll(urlParams);
        return baseUrl + stringParams.toString();

    }

    public onMassActionComplete(success: boolean): void {
    }

}

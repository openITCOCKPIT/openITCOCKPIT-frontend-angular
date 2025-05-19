import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
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
import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    CalendarIndex,
    CalendarIndexRoot,
    CalendarsIndexParams,
    getDefaultCalendarsIndexParams
} from '../calendars.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { Subscription } from 'rxjs';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { CalendarsService } from '../calendars.service';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { IndexPage } from '../../../pages.interface';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NotyService } from '../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-calendars-index',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
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
        ReactiveFormsModule,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TranslocoPipe,
        XsButtonDirective,
        TableLoaderComponent
    ],
    templateUrl: './calendars-index.component.html',
    styleUrl: './calendars-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: CalendarsService} // Inject the CalendarsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarsIndexComponent implements OnInit, OnDestroy, IndexPage {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: CalendarsIndexParams = getDefaultCalendarsIndexParams()
    public calendars?: CalendarIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];
    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private CalendarsService = inject(CalendarsService)
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    constructor(private _liveAnnouncer: LiveAnnouncer) {
    }

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.loadCalendars();
        }));
    }

    public loadCalendars() {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(this.CalendarsService.getIndex(this.params)
            .subscribe((result) => {
                this.calendars = result;
                this.cdr.markForCheck();
            })
        );
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultCalendarsIndexParams();
    }

    public onPaginatorChange(calendar: PaginatorChangeEvent): void {
        this.params.page = calendar.page;
        this.params.scroll = calendar.scroll;
        this.loadCalendars();
    }

    public onFilterChange($event: any) {
        this.params.page = 1;
        this.loadCalendars();
    }

    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadCalendars();
        }
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(calendar?: CalendarIndex) {
        let items: DeleteAllItem[] = [];

        if (calendar) {
            // User just want to delete a single calendar
            items = [{
                id: calendar.id,
                displayName: calendar.name
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.id,
                    displayName: item.name
                };
            });
        }

        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }

        // Pass selection to the modal
        this.selectedItems = items;
        this.cdr.markForCheck();

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadCalendars();
        }
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}

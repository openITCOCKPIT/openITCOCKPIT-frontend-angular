import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
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
    RowComponent
} from '@coreui/angular';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { ChangelogIndexRoot, ChangelogsEntityParams, getDefaultChangelogsEntityParams } from '../changelogs.interface';
import { Subscription } from 'rxjs';
import { ChangelogsService } from '../changelogs.service';
import { ObjectTypesEnum } from '../object-types.enum';
import { DatePipe, DecimalPipe, formatDate, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { ChangelogsEntryComponent } from '../changelogs-entry/changelogs-entry.component';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';

@Component({
    selector: 'oitc-changelogs-entity',
    standalone: true,
    imports: [

        TranslocoDirective,
        RouterLink,
        FaIconComponent,
        PermissionDirective,
        CardComponent,
        CardHeaderComponent,
        NavComponent,
        NavItemComponent,
        CardTitleDirective,
        XsButtonDirective,
        CardBodyComponent,
        ColComponent,
        ContainerComponent,
        FormDirective,
        FormsModule,
        ReactiveFormsModule,
        RowComponent,
        DebounceDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        DatePipe,
        NgIf,
        JsonPipe,
        DecimalPipe,
        PaginateOrScrollComponent,
        ChangelogsEntryComponent,
        NgForOf,
        BackButtonDirective,
        NoRecordsComponent
    ],
    templateUrl: './changelogs-entity.component.html',
    styleUrl: './changelogs-entity.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangelogsEntityComponent implements OnInit, OnDestroy {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);

    public hideFilter: boolean = true;
    public params: ChangelogsEntityParams = getDefaultChangelogsEntityParams();
    private subscriptions: Subscription = new Subscription();
    private ChangelogsService = inject(ChangelogsService)
    public changes?: ChangelogIndexRoot;
    public entityType = String(this.route.snapshot.paramMap.get('type')).toUpperCase();
    protected readonly ObjectTypesEnum = ObjectTypesEnum;


    public from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');


    public tmpFilter = {
        Action: {
            add: true,
            edit: true,
            copy: true,
            delete: true,
            activate: true,
            deactivate: true
        }
    };
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.loadChanges();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    loadChanges() {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        if (id && this.entityType) {
            this.params['filter[Changelogs.object_id]'] = id;
            this.params['filter[Changelogs.objecttype_id]'] = [ObjectTypesEnum[this.entityType as keyof typeof ObjectTypesEnum]];

            this.params['filter[Changelogs.action][]'] = [];

            for (let action in this.tmpFilter.Action) {
                if (this.tmpFilter.Action[action as keyof typeof this.tmpFilter.Action]) {
                    this.params['filter[Changelogs.action][]'].push(action);
                }
            }

            this.params['filter[from]'] = formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US');
            this.params['filter[to]'] = formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US');

            this.subscriptions.add(this.ChangelogsService.getEntity(this.params)
                .subscribe((result: ChangelogIndexRoot) => {
                    this.changes = result;
                    this.cdr.markForCheck();
                })
            );
        }
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultChangelogsEntityParams();
        this.from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.tmpFilter = {
            Action: {
                add: true,
                edit: true,
                copy: true,
                delete: true,
                activate: true,
                deactivate: true
            }
        }
        this.loadChanges();
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadChanges();
    }

    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadChanges();
    }
}

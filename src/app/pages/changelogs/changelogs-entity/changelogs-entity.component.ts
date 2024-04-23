import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { DatePipe, DecimalPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { ChangelogsEntryComponent } from '../changelogs-entry/changelogs-entry.component';

@Component({
    selector: 'oitc-changelogs-entity',
    standalone: true,
    imports: [
        CoreuiComponent,
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
        NgForOf
    ],
    templateUrl: './changelogs-entity.component.html',
    styleUrl: './changelogs-entity.component.css'
})
export class ChangelogsEntityComponent implements OnInit, OnDestroy {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);

    public hideFilter: boolean = false;
    public params: ChangelogsEntityParams = getDefaultChangelogsEntityParams();
    private subscriptions: Subscription = new Subscription();
    private ChangelogsService = inject(ChangelogsService)
    public changes?: ChangelogIndexRoot;


    loadChanges() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        const typeStr = String(this.route.snapshot.paramMap.get('type')).toUpperCase();
        if (id && typeStr) {
            this.params['filter[Changelogs.object_id]'] = id;

            this.params['filter[Changelogs.objecttype_id]'] = [ObjectTypesEnum[typeStr as keyof typeof ObjectTypesEnum]];
            this.subscriptions.add(this.ChangelogsService.getIndex(this.params)
                .subscribe((result: ChangelogIndexRoot) => {
                    this.changes = result;
                })
            );
        }
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public ngOnDestroy(): void {
    }

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.loadChanges();
        }));
    }

    protected readonly ObjectTypesEnum = ObjectTypesEnum;

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

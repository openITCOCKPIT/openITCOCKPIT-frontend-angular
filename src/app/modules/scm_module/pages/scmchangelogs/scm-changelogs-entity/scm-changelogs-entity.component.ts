import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
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
import { ChangelogsEntryComponent } from '../../../../../pages/changelogs/changelogs-entry/changelogs-entry.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { formatDate, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';

import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { ChangelogIndexRoot } from '../../../../../pages/changelogs/changelogs.interface';
import { Subscription } from 'rxjs';
import { ScmchangelogsService } from '../scmchangelogs.service';
import { ScmObjectTypesEnum } from '../scm-object-types.enum';
import { getDefaultScmChangelogsEntityParams, ScmChangelogsEntityParams } from '../scmchangelogs.interface';

@Component({
    selector: 'oitc-scm-changelogs-entity',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ChangelogsEntryComponent,
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
        InputGroupComponent,
        InputGroupTextDirective,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        ReactiveFormsModule,
        RowComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink
    ],
    templateUrl: './scm-changelogs-entity.component.html',
    styleUrl: './scm-changelogs-entity.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScmChangelogsEntityComponent implements OnInit, OnDestroy {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);

    public hideFilter: boolean = true;
    public params: ScmChangelogsEntityParams = getDefaultScmChangelogsEntityParams();
    private subscriptions: Subscription = new Subscription();
    private ScmChangelogsService = inject(ScmchangelogsService)
    public changes?: ChangelogIndexRoot;
    public entityType = String(this.route.snapshot.paramMap.get('type')).toUpperCase();

    public from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');


    public tmpFilter = {
        Action: {
            add: true,
            edit: true,
            delete: true
        }
    };
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
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
            this.params['filter[Changelogs.objecttype_id]'] = [ScmObjectTypesEnum[this.entityType as keyof typeof ScmObjectTypesEnum]];

            this.params['filter[Changelogs.action][]'] = [];

            for (let action in this.tmpFilter.Action) {
                if (this.tmpFilter.Action[action as keyof typeof this.tmpFilter.Action]) {
                    this.params['filter[Changelogs.action][]'].push(action);
                }
            }

            this.params['filter[from]'] = formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US');
            this.params['filter[to]'] = formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US');

            this.subscriptions.add(this.ScmChangelogsService.getEntity(this.params)
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
        this.params = getDefaultScmChangelogsEntityParams();
        this.from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.tmpFilter = {
            Action: {
                add: true,
                edit: true,
                delete: true
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

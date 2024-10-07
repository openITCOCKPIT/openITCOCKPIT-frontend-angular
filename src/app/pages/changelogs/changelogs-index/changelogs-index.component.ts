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
    RowComponent
} from '@coreui/angular';
import { ChangelogsEntryComponent } from '../changelogs-entry/changelogs-entry.component';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { formatDate, NgClass, NgForOf, NgIf } from '@angular/common';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { ChangelogIndexRoot, ChangelogsIndexParams, getDefaultChangelogsIndexParams } from '../changelogs.interface';
import { Subscription } from 'rxjs';
import { ChangelogsService } from '../changelogs.service';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { HostgroupExtendedTabs } from '../../hostgroups/hostgroups.enum';
import { PermissionsService } from '../../../permissions/permissions.service';
import {
    SlaHostgroupHostsStatusOverviewComponent
} from '../../../modules/sla_module/components/sla-hostgroup-hosts-status-overview/sla-hostgroup-hosts-status-overview.component';
import { IndexPage } from '../../../pages.interface';
import { Sort } from '@angular/material/sort';


@Component({
    selector: 'oitc-changelogs-index',
    standalone: true,
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ChangelogsEntryComponent,
        ColComponent,
        ContainerComponent,
        CoreuiComponent,
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
        PaginateOrScrollComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RowComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        NoRecordsComponent,
        NgClass,
        SlaHostgroupHostsStatusOverviewComponent
    ],
    templateUrl: './changelogs-index.component.html',
    styleUrl: './changelogs-index.component.css'
})
export class ChangelogsIndexComponent implements OnInit, OnDestroy, IndexPage {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);

    public hideFilter: boolean = true;
    public params: ChangelogsIndexParams = getDefaultChangelogsIndexParams();
    private subscriptions: Subscription = new Subscription();
    private ChangelogsService = inject(ChangelogsService)
    public readonly PermissionsService = inject(PermissionsService);

    public changes?: ChangelogIndexRoot;

    public from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
    public to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');

    public tmpFilter = {
        Models: {
            Command: true,
            Contact: true,
            Contactgroup: true,
            Host: true,
            Hostgroup: true,
            Hosttemplate: true,
            Service: true,
            Servicegroup: true,
            Servicetemplate: true,
            Servicetemplategroup: true,
            Timeperiod: true,
            Location: true,
            Tenant: true,
            Container: true,
            Export: true,
            User: true
        },
        Action: {
            add: true,
            edit: true,
            copy: true,
            delete: true,
            activate: true,
            deactivate: true,
            export: true
        }
    }

    public loadChanges() {
        this.params['filter[Changelogs.action][]'] = [];
        for (let action in this.tmpFilter.Action) {
            if (this.tmpFilter.Action[action as keyof typeof this.tmpFilter.Action]) {
                this.params['filter[Changelogs.action][]'].push(action);
            }
        }

        this.params['filter[Changelogs.model][]'] = [];
        for (let model in this.tmpFilter.Models) {
            if (this.tmpFilter.Models[model as keyof typeof this.tmpFilter.Models]) {
                this.params['filter[Changelogs.model][]'].push(model);
            }
        }

        this.params['filter[from]'] = formatDate(new Date(this.from), 'dd.MM.y HH:mm', 'en-US');
        this.params['filter[to]'] = formatDate(new Date(this.to), 'dd.MM.y HH:mm', 'en-US');

        this.subscriptions.add(this.ChangelogsService.getIndex(this.params)
            .subscribe((result: ChangelogIndexRoot) => {
                this.changes = result;
            })
        );
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadChanges();
    }

    public resetFilter() {
        this.params = getDefaultChangelogsIndexParams();
        this.from = formatDate(this.params['filter[from]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.to = formatDate(this.params['filter[to]'], 'yyyy-MM-ddTHH:mm', 'en-US');
        this.tmpFilter = {
            Models: {
                Command: true,
                Contact: true,
                Contactgroup: true,
                Host: true,
                Hostgroup: true,
                Hosttemplate: true,
                Service: true,
                Servicegroup: true,
                Servicetemplate: true,
                Servicetemplategroup: true,
                Timeperiod: true,
                Location: true,
                Tenant: true,
                Container: true,
                Export: true,
                User: true
            },
            Action: {
                add: true,
                edit: true,
                copy: true,
                delete: true,
                activate: true,
                deactivate: true,
                export: true
            }
        }
        this.loadChanges();
    }

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.loadChanges();
        }));
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadChanges();
    }

    protected readonly HostgroupExtendedTabs = HostgroupExtendedTabs;

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onMassActionComplete(success: boolean) {
    }

    public onSortChange(sort: Sort) {
    }
}

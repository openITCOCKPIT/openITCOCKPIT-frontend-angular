import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    BadgeComponent,
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
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { IndexPage } from '../../../../../pages.interface';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { CvesService } from '../cves.service';
import {
    CvesSoftwareHostsRoot,
    CvesSoftwareParams,
    CvesSoftwareRoot,
    getDefaultCvesSoftwareParams
} from '../cves.interface';
import { CveSeverityBadgeComponent } from '../../../components/cve-severity-badge/cve-severity-badge.component';
import { CvesPagesNavComponent } from '../../../components/cves-pages-nav/cves-pages-nav.component';

/**
 * Affected software across all hosts: which version runs where with how many CVEs.
 * With ?component_name=&component_version= it shows the hosts of this one version.
 */
@Component({
    selector: 'oitc-cves-software',
    imports: [
        RouterLink,
        FormsModule,
        MatSort,
        MatSortHeader,
        TranslocoDirective,
        TranslocoPipe,
        FaIconComponent,
        BadgeComponent,
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
        NavItemComponent,
        RowComponent,
        TableDirective,
        PaginateOrScrollComponent,
        TableLoaderComponent,
        NoRecordsComponent,
        DebounceDirective,
        XsButtonDirective,
        CveSeverityBadgeComponent,
        CvesPagesNavComponent
    ],
    templateUrl: './cves-software.component.html',
    styleUrl: './cves-software.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvesSoftwareComponent implements OnInit, OnDestroy, IndexPage {
    private readonly route = inject(ActivatedRoute);
    private readonly CvesService = inject(CvesService);
    private readonly cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();

    public params: CvesSoftwareParams = getDefaultCvesSoftwareParams();
    public hideFilter: boolean = true;

    // One version of a component: its hosts instead of the list of software
    public componentName: string | null = null;
    public componentVersion: string | null = null;

    public software?: CvesSoftwareRoot;
    public hosts?: CvesSoftwareHostsRoot;

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(query => {
            this.params = getDefaultCvesSoftwareParams();
            this.componentName = query['component_name'] ?? null;
            this.componentVersion = query['component_version'] ?? null;
            if (this.componentName && this.componentVersion === null) {
                // e.g. from the recommendations: all versions of one package
                this.params['filter[CveHostFindings.component_name]'] = this.componentName;
                this.hideFilter = false;
            }
            this.load();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public get showHosts(): boolean {
        return this.componentName !== null && this.componentVersion !== null;
    }

    public load(): void {
        if (this.showHosts) {
            this.hosts = undefined;
            this.subscriptions.add(this.CvesService.getSoftwareHosts({
                ...this.params,
                component_name: String(this.componentName),
                component_version: String(this.componentVersion)
            }).subscribe((result) => {
                this.hosts = result;
                this.cdr.markForCheck();
            }));
            return;
        }

        this.subscriptions.add(this.CvesService.getSoftware(this.params).subscribe((result) => {
            this.software = result;
            this.cdr.markForCheck();
        }));
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter(): void {
        this.params = getDefaultCvesSoftwareParams();
        this.load();
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.load();
    }

    public onFilterChange(event: any): void {
        this.params.page = 1;
        this.load();
    }

    public onSortChange(sort: Sort): void {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.load();
        }
    }

    public onMassActionComplete(success: boolean): void {
        if (success) {
            this.load();
        }
    }

    public toggleKernelOnly(enabled: boolean): void {
        this.params['filter[CveHostFindings.is_kernel]'] = enabled ? 1 : '';
        this.onFilterChange(null);
    }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { forkJoin, map, Observable, of, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    AlertComponent,
    BadgeComponent,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { CvesService } from '../../pages/cves/cves.service';
import {
    CveCoverage,
    CveHostComponent,
    CvesHostComponentsParams,
    CvesHostComponentsRoot,
    CvesHostRoot,
    getDefaultCvesHostComponentsParams,
    getDefaultCvesHostFindingsParams
} from '../../pages/cves/cves.interface';
import { CveHostTabs, CveViews } from '../../pages/cves/cves.enum';
import { PaginatorChangeEvent } from '../../../../layouts/coreui/paginator/paginator.interface';
import { PaginateOrScrollComponent } from '../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NoRecordsComponent } from '../../../../layouts/coreui/no-records/no-records.component';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { CveStateBadgeComponent } from '../cve-state-badge/cve-state-badge.component';
import { CveSeverityBarComponent } from '../cve-severity-bar/cve-severity-bar.component';
import { CveSeverityBadgeComponent } from '../cve-severity-badge/cve-severity-badge.component';
import { CveRecommendationLabelComponent } from '../cve-recommendation-label/cve-recommendation-label.component';
import { CveCoverageReasonLabelComponent } from '../cve-coverage-reason-label/cve-coverage-reason-label.component';
import { CvesHostFindingsComponent } from '../cves-host-findings/cves-host-findings.component';
import { CvesDecideModalComponent, CvesDecideModalMode } from '../cves-decide-modal/cves-decide-modal.component';
import { CvesTrendChartComponent } from '../cves-trend-chart/cves-trend-chart.component';

// The API decides on at most this many findings per request
const MAX_FINDINGS_PER_DECISION = 5000;

// The tabs that show findings, the coverage has none
const VIEW_OF_TAB: Partial<Record<CveHostTabs, CveViews>> = {
    [CveHostTabs.Action]: CveViews.Action,
    [CveHostTabs.Unfixed]: CveViews.Unfixed,
    [CveHostTabs.Accepted]: CveViews.Accepted,
    [CveHostTabs.NotAffected]: CveViews.NotAffected
};

/**
 * CVE details of one host: state, counters, the findings per view and the coverage.
 * Used by the page /cve_module/cves/host/:id and by the tab in the host browser.
 *
 * Findings can be selected one by one in an expanded component, or as whole components
 * (e.g. accept all CVEs of the kernel). Both get decided on together.
 */
@Component({
    selector: 'oitc-cves-host-details',
    imports: [
        RouterLink,
        AsyncPipe,
        FormsModule,
        MatSort,
        MatSortHeader,
        TranslocoDirective,
        TranslocoPipe,
        FaIconComponent,
        AlertComponent,
        BadgeComponent,
        ColComponent,
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
        TooltipDirective,
        PaginateOrScrollComponent,
        TableLoaderComponent,
        NoRecordsComponent,
        DebounceDirective,
        XsButtonDirective,
        CveStateBadgeComponent,
        CveSeverityBarComponent,
        CveSeverityBadgeComponent,
        CveRecommendationLabelComponent,
        CveCoverageReasonLabelComponent,
        CvesHostFindingsComponent,
        CvesDecideModalComponent,
        CvesTrendChartComponent
    ],
    templateUrl: './cves-host-details.component.html',
    styleUrl: './cves-host-details.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvesHostDetailsComponent implements OnDestroy {
    public hostId = input.required<number>();
    // Inside the host browser: no link to the host and no trend chart
    public embedded = input<boolean>(false);

    private readonly CvesService = inject(CvesService);
    private readonly modalService = inject(ModalService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();

    protected readonly CveHostTabs = CveHostTabs;

    public host?: CvesHostRoot;
    public selectedTab: CveHostTabs = CveHostTabs.Action;

    public params: CvesHostComponentsParams = getDefaultCvesHostComponentsParams(CveViews.Action);
    public components?: CvesHostComponentsRoot;
    public coverage?: CveCoverage;

    // Keys of the expanded components, see componentKey()
    public expanded: Set<string> = new Set<string>();
    // Whole components selected for a decision
    public selectedComponents: Map<string, CveHostComponent> = new Map<string, CveHostComponent>();
    // Single findings selected in expanded components
    public selectedFindingIds: Set<number> = new Set<number>();

    // Passed to the modal when it opens
    public modalFindingIds: number[] = [];
    public modalMode: CvesDecideModalMode = 'decide';
    public isCollecting: boolean = false;
    public tooManyFindings: boolean = false;

    public constructor() {
        effect(() => {
            this.hostId();
            this.load();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.CvesService.getHost(this.hostId()).subscribe((host) => {
            this.host = host;
            this.cdr.markForCheck();
        }));
        this.loadTab();
    }

    public changeTab(tab: CveHostTabs): void {
        this.selectedTab = tab;
        this.clearSelection();
        this.expanded = new Set<string>();
        const view = VIEW_OF_TAB[tab];
        if (view) {
            this.params = getDefaultCvesHostComponentsParams(view);
        }
        this.loadTab();
    }

    private loadTab(): void {
        if (this.selectedTab === CveHostTabs.Coverage) {
            this.subscriptions.add(this.CvesService.getHostCoverage(this.hostId()).subscribe((result) => {
                this.coverage = result.coverage;
                this.cdr.markForCheck();
            }));
            return;
        }

        this.components = undefined;
        this.subscriptions.add(this.CvesService.getHostComponents(this.hostId(), this.params).subscribe((result) => {
            this.components = result;
            this.cdr.markForCheck();
        }));
    }

    public get currentView(): CveViews {
        return this.params.view;
    }

    public get allowEdit(): boolean {
        return !!this.host?.allowEdit;
    }

    // Decisions can be ended in the views that only contain decided findings
    public get canRemoveDecisions(): boolean {
        return this.currentView === CveViews.Accepted || this.currentView === CveViews.NotAffected;
    }

    public onFilterChange(): void {
        this.params.page = 1;
        this.clearSelection();
        this.loadTab();
    }

    public onSortChange(sort: Sort): void {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadTab();
        }
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadTab();
    }

    public resetFilter(): void {
        this.params = getDefaultCvesHostComponentsParams(this.currentView);
        this.onFilterChange();
    }

    public componentKey(component: CveHostComponent): string {
        // Name and version can contain nearly anything, but never a null byte
        return component.component_name + '\u0000' + component.component_version;
    }

    public isExpanded(component: CveHostComponent): boolean {
        return this.expanded.has(this.componentKey(component));
    }

    public toggleExpand(component: CveHostComponent): void {
        const expanded = new Set(this.expanded);
        const key = this.componentKey(component);
        if (expanded.has(key)) {
            expanded.delete(key);
        } else {
            expanded.add(key);
        }
        this.expanded = expanded;
    }

    public isComponentSelected(component: CveHostComponent): boolean {
        return this.selectedComponents.has(this.componentKey(component));
    }

    public toggleComponent(component: CveHostComponent): void {
        const selected = new Map(this.selectedComponents);
        const key = this.componentKey(component);
        if (selected.has(key)) {
            selected.delete(key);
        } else {
            selected.set(key, component);
        }
        this.selectedComponents = selected;
    }

    public allComponentsSelected(): boolean {
        return !!this.components && this.components.components.length > 0 &&
            this.components.components.every(component => this.isComponentSelected(component));
    }

    public toggleAllComponents(): void {
        if (!this.components) {
            return;
        }
        const select = !this.allComponentsSelected();
        const selected = new Map(this.selectedComponents);
        for (const component of this.components.components) {
            if (select) {
                selected.set(this.componentKey(component), component);
            } else {
                selected.delete(this.componentKey(component));
            }
        }
        this.selectedComponents = selected;
    }

    public onFindingSelectionChanged(selection: Set<number>): void {
        this.selectedFindingIds = selection;
        this.cdr.markForCheck();
    }

    // Upper bound for the buttons: findings of the selected components plus the single findings
    public get selectedCount(): number {
        let count = this.selectedFindingIds.size;
        this.selectedComponents.forEach(component => count += component.cve_count);
        return count;
    }

    public clearSelection(): void {
        this.selectedComponents = new Map<string, CveHostComponent>();
        this.selectedFindingIds = new Set<number>();
        this.tooManyFindings = false;
    }

    /**
     * Collects the ids of all selected findings and opens the modal.
     * Selected components get resolved into their findings first.
     */
    public openDecideModal(mode: CvesDecideModalMode): void {
        this.isCollecting = true;
        this.tooManyFindings = false;
        this.subscriptions.add(this.collectSelectedFindingIds().subscribe((findingIds) => {
            this.isCollecting = false;
            if (findingIds.length > MAX_FINDINGS_PER_DECISION) {
                this.tooManyFindings = true;
                this.cdr.markForCheck();
                return;
            }

            this.modalFindingIds = findingIds;
            this.modalMode = mode;
            this.cdr.markForCheck();
            this.modalService.toggle({
                show: true,
                id: 'cvesDecideModal'
            });
        }));
    }

    private collectSelectedFindingIds(): Observable<number[]> {
        const requests: Observable<number[]>[] = [];
        this.selectedComponents.forEach((component) => {
            const params = getDefaultCvesHostFindingsParams(this.currentView, component.component_name, component.component_version);
            params.scroll = true;
            params.limit = MAX_FINDINGS_PER_DECISION;
            requests.push(this.CvesService.getHostFindings(this.hostId(), params).pipe(
                map(result => result.findings.map(finding => finding.id))
            ));
        });

        const single = Array.from(this.selectedFindingIds);
        if (requests.length === 0) {
            return of(single);
        }
        return forkJoin(requests).pipe(
            map(lists => Array.from(new Set<number>([...single, ...lists.flat()])))
        );
    }

    public onDecisionCompleted(success: boolean): void {
        if (success) {
            this.clearSelection();
            this.expanded = new Set<string>();
            this.load();
        }
    }

    public coverageItemTypes(coverage: CveCoverage): string[] {
        return Object.keys(coverage.items);
    }
}

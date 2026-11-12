import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, DecimalPipe } from '@angular/common';
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
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
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
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { CvesService } from '../cves.service';
import { CveFinding, CvesViewParams, CvesViewRoot, getDefaultCvesViewParams } from '../cves.interface';
import { CveStateBadgeComponent } from '../../../components/cve-state-badge/cve-state-badge.component';
import { CveSeverityBadgeComponent } from '../../../components/cve-severity-badge/cve-severity-badge.component';
import { CveRuleLabelComponent } from '../../../components/cve-rule-label/cve-rule-label.component';
import {
    CveRecommendationLabelComponent
} from '../../../components/cve-recommendation-label/cve-recommendation-label.component';
import {
    CveDecisionStateLabelComponent
} from '../../../components/cve-decision-state-label/cve-decision-state-label.component';
import {
    CvesDecideModalComponent,
    CvesDecideModalMode
} from '../../../components/cves-decide-modal/cves-decide-modal.component';
import { CvesPagesNavComponent } from '../../../components/cves-pages-nav/cves-pages-nav.component';

/**
 * One CVE and every host it affects. The findings can be decided on together,
 * e.g. "not affected" on all hosts that do not use the vulnerable function.
 */
@Component({
    selector: 'oitc-cves-view',
    imports: [
        RouterLink,
        AsyncPipe,
        DecimalPipe,
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
        FormCheckInputDirective,
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
        CveStateBadgeComponent,
        CveSeverityBadgeComponent,
        CveRuleLabelComponent,
        CveRecommendationLabelComponent,
        CveDecisionStateLabelComponent,
        CvesDecideModalComponent,
        CvesPagesNavComponent
    ],
    templateUrl: './cves-view.component.html',
    styleUrl: './cves-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvesViewComponent implements OnInit, OnDestroy, IndexPage {
    private readonly route = inject(ActivatedRoute);
    private readonly CvesService = inject(CvesService);
    private readonly modalService = inject(ModalService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();

    public cveId: string = '';
    public params: CvesViewParams = getDefaultCvesViewParams();
    public hideFilter: boolean = true;
    public result?: CvesViewRoot;

    public selectedFindingIds: Set<number> = new Set<number>();
    public modalFindingIds: number[] = [];
    public modalMode: CvesDecideModalMode = 'decide';

    public ngOnInit(): void {
        this.subscriptions.add(this.route.paramMap.subscribe(params => {
            this.cveId = String(params.get('cveId'));
            this.params = getDefaultCvesViewParams();
            this.load();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.selectedFindingIds = new Set<number>();
        this.subscriptions.add(this.CvesService.getView(this.cveId, this.params).subscribe((result) => {
            this.result = result;
            this.cdr.markForCheck();
        }));
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter(): void {
        this.params = getDefaultCvesViewParams();
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

    public toggle(finding: CveFinding): void {
        const selection = new Set(this.selectedFindingIds);
        if (selection.has(finding.id)) {
            selection.delete(finding.id);
        } else {
            selection.add(finding.id);
        }
        this.selectedFindingIds = selection;
    }

    public allSelected(): boolean {
        return !!this.result && this.result.findings.length > 0 && this.result.findings.every(finding => this.selectedFindingIds.has(finding.id));
    }

    public toggleAll(): void {
        if (!this.result) {
            return;
        }
        this.selectedFindingIds = this.allSelected() ? new Set<number>() : new Set(this.result.findings.map(finding => finding.id));
    }

    public openModal(mode: CvesDecideModalMode): void {
        this.modalFindingIds = Array.from(this.selectedFindingIds);
        this.modalMode = mode;
        this.cdr.markForCheck();
        this.modalService.toggle({
            show: true,
            id: 'cvesDecideModal'
        });
    }
}

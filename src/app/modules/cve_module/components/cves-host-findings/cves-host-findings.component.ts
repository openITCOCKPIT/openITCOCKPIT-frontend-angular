import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    EventEmitter,
    inject,
    input,
    OnDestroy,
    Output
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormCheckInputDirective, TableDirective, TooltipDirective } from '@coreui/angular';
import { DecimalPipe } from '@angular/common';
import { CvesService } from '../../pages/cves/cves.service';
import {
    CveFinding,
    CvesHostFindingsParams,
    CvesHostFindingsRoot,
    getDefaultCvesHostFindingsParams
} from '../../pages/cves/cves.interface';
import { CveViews } from '../../pages/cves/cves.enum';
import { PaginatorChangeEvent } from '../../../../layouts/coreui/paginator/paginator.interface';
import {
    PaginateOrScrollComponent
} from '../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NoRecordsComponent } from '../../../../layouts/coreui/no-records/no-records.component';
import { CveSeverityBadgeComponent } from '../cve-severity-badge/cve-severity-badge.component';
import { CveRuleLabelComponent } from '../cve-rule-label/cve-rule-label.component';
import { CveReasonBadgesComponent } from '../cve-reason-badges/cve-reason-badges.component';
import { CveRecommendationLabelComponent } from '../cve-recommendation-label/cve-recommendation-label.component';
import { CveDecisionStateLabelComponent } from '../cve-decision-state-label/cve-decision-state-label.component';
import { CveStateBadgeComponent } from '../cve-state-badge/cve-state-badge.component';

/**
 * The CVEs of one component of a host, shown when the component gets expanded.
 * They get loaded page by page, because a kernel can have thousands of CVEs.
 *
 * The selection belongs to the parent, so it survives collapsing the component and changing the page.
 * Every change emits a new Set, the same Set with other content would not update OnPush components.
 */
@Component({
    selector: 'oitc-cves-host-findings',
    imports: [
        RouterLink,
        TranslocoDirective,
        TranslocoPipe,
        FaIconComponent,
        TableDirective,
        TooltipDirective,
        FormCheckInputDirective,
        DecimalPipe,
        PaginateOrScrollComponent,
        TableLoaderComponent,
        NoRecordsComponent,
        CveSeverityBadgeComponent,
        CveRuleLabelComponent,
        CveReasonBadgesComponent,
        CveRecommendationLabelComponent,
        CveDecisionStateLabelComponent,
        CveStateBadgeComponent
    ],
    templateUrl: './cves-host-findings.component.html',
    styleUrl: './cves-host-findings.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvesHostFindingsComponent implements OnDestroy {
    public hostId = input.required<number>();
    public view = input.required<CveViews>();
    public componentName = input.required<string>();
    public componentVersion = input.required<string>();
    public allowEdit = input<boolean>(false);
    // Ids of the selected findings, owned by the parent
    public selection = input<Set<number>>(new Set<number>());

    @Output() selectionChanged = new EventEmitter<Set<number>>();

    private readonly CvesService = inject(CvesService);
    private readonly cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();

    public params?: CvesHostFindingsParams;
    public result?: CvesHostFindingsRoot;

    public constructor() {
        effect(() => {
            this.params = getDefaultCvesHostFindingsParams(this.view(), this.componentName(), this.componentVersion());
            this.load();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        if (!this.params) {
            return;
        }
        this.subscriptions.add(this.CvesService.getHostFindings(this.hostId(), this.params).subscribe((result) => {
            this.result = result;
            this.cdr.markForCheck();
        }));
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        if (!this.params) {
            return;
        }
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.load();
    }

    public isSelected(finding: CveFinding): boolean {
        return this.selection().has(finding.id);
    }

    public toggle(finding: CveFinding): void {
        const selection = new Set(this.selection());
        if (selection.has(finding.id)) {
            selection.delete(finding.id);
        } else {
            selection.add(finding.id);
        }
        this.selectionChanged.emit(selection);
    }

    public allOnPageSelected(): boolean {
        return !!this.result && this.result.findings.length > 0 && this.result.findings.every(finding => this.selection().has(finding.id));
    }

    public toggleAllOnPage(): void {
        if (!this.result) {
            return;
        }
        const select = !this.allOnPageSelected();
        const selection = new Set(this.selection());
        for (const finding of this.result.findings) {
            if (select) {
                selection.add(finding.id);
            } else {
                selection.delete(finding.id);
            }
        }
        this.selectionChanged.emit(selection);
    }
}

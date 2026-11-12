import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
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
import { PaginateOrScrollComponent } from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { CvesService } from '../cves.service';
import { CvesDecisionsParams, CvesDecisionsRoot, getDefaultCvesDecisionsParams } from '../cves.interface';
import { CveDecisionStates } from '../cves.enum';
import { CveDecisionStateLabelComponent } from '../../../components/cve-decision-state-label/cve-decision-state-label.component';
import { CveStateBadgeComponent } from '../../../components/cve-state-badge/cve-state-badge.component';
import { CvesPagesNavComponent } from '../../../components/cves-pages-nav/cves-pages-nav.component';

/**
 * All decisions of open findings, the next review date first, to work through them in time
 */
@Component({
    selector: 'oitc-cves-decisions',
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
        MultiSelectComponent,
        CveDecisionStateLabelComponent,
        CveStateBadgeComponent,
        CvesPagesNavComponent
    ],
    templateUrl: './cves-decisions.component.html',
    styleUrl: './cves-decisions.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvesDecisionsComponent implements OnInit, OnDestroy, IndexPage {
    private readonly CvesService = inject(CvesService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();

    public params: CvesDecisionsParams = getDefaultCvesDecisionsParams();
    public hideFilter: boolean = true;
    public decisions?: CvesDecisionsRoot;

    public readonly states: SelectKeyValueString[] = [
        {key: CveDecisionStates.InProgress, value: this.TranslocoService.translate('In progress')},
        {key: CveDecisionStates.Accepted, value: this.TranslocoService.translate('Risk accepted')},
        {key: CveDecisionStates.NotAffected, value: this.TranslocoService.translate('Not affected')}
    ];

    public ngOnInit(): void {
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.CvesService.getDecisions(this.params).subscribe((result) => {
            this.decisions = result;
            this.cdr.markForCheck();
        }));
    }

    public toggleFilter(): void {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter(): void {
        this.params = getDefaultCvesDecisionsParams();
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

    // Review dates are Y-m-d, so comparing the strings is enough
    public isDue(reviewAfter: string): boolean {
        const today = new Date().toISOString().substring(0, 10);
        return reviewAfter <= today;
    }
}

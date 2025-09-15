import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ColDirective,
    FormCheckInputDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TextColorDirective,
    TooltipDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StatuspagegroupsService } from '../statuspagegroups.service';
import {
    StatupagegroupProblem,
    StatupagegroupViewRoot,
    StatuspagegroupViewLocalFilter
} from '../statuspagegroups.interface';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { CumulatedStatuspagegroupStatus } from '../cumulated-statuspagegroup-status.enum';
import { PermissionsService } from '../../../permissions/permissions.service';
import {
    StatuspageIconSimpleComponent
} from '../../statuspages/statuspage-icon-simple/statuspage-icon-simple.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatuspageStatusPipe } from '../../statuspages/statuspage-status.pipe';
import { StatuspagegroupsMarqueeComponent } from '../statuspagegroups-marquee/statuspagegroups-marquee.component';
import { LocalNumberPipe } from '../../../pipes/local-number.pipe';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';

@Component({
    selector: 'oitc-statuspagegroups-viewer',
    imports: [
        RowComponent,
        ColComponent,
        CardComponent,
        FaIconComponent,
        CardBodyComponent,
        ColDirective,
        CardTitleDirective,
        TextColorDirective,
        CardHeaderComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        TableDirective,
        TableDirective,
        BadgeOutlineComponent,
        FormCheckInputDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective,
        TranslocoDirective,
        BlockLoaderComponent,
        NgClass,
        StatuspageIconSimpleComponent,
        ReactiveFormsModule,
        StatuspageStatusPipe,
        TooltipDirective,
        StatuspagegroupsMarqueeComponent,
        LocalNumberPipe,
        TranslocoPipe,
        AsyncPipe,
        RouterLink,
        NoRecordsComponent,
        FormsModule
    ],
    templateUrl: './statuspagegroups-viewer.component.html',
    styleUrl: './statuspagegroups-viewer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagegroupsViewerComponent implements OnInit, OnDestroy {

    public StatupagegroupViewRootResponse?: StatupagegroupViewRoot;
    public id: number = 0;

    public filter: StatuspagegroupViewLocalFilter = this.clearFilter();
    public problemsFilered: StatupagegroupProblem[] = [];

    private subscriptions: Subscription = new Subscription();
    public readonly PermissionsService = inject(PermissionsService);

    private readonly StatuspagegroupsService = inject(StatuspagegroupsService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadStatuspagegroup();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadStatuspagegroup() {
        if (this.id > 0) {
            this.subscriptions.add(this.StatuspagegroupsService.getStatuspagegroupView(this.id).subscribe(response => {
                this.StatupagegroupViewRootResponse = response;
                this.applyFilter();
                this.cdr.markForCheck();
            }));
        }
    }

    public clearFilter(): StatuspagegroupViewLocalFilter {
        return {
            state_1: true,
            state_2: true,
            state_3: true,
            collection: '',
            category: '',
            statuspage_name: ''
        };
    }

    public applyFilter() {
        if (!this.StatupagegroupViewRootResponse) {
            return;
        }

        const problemsFilered: StatupagegroupProblem[] = [];

        const stateFilter = [];
        if (this.filter.state_1) {
            stateFilter.push(CumulatedStatuspagegroupStatus.PERFORMANCE_ISSUES);
        }
        if (this.filter.state_2) {
            stateFilter.push(CumulatedStatuspagegroupStatus.MAJOR_OUTAGE);
        }
        if (this.filter.state_3) {
            stateFilter.push(CumulatedStatuspagegroupStatus.UNKNOWN);
        }

        for (const problem of this.StatupagegroupViewRootResponse.problems) {
            if (stateFilter.length > 0 && !stateFilter.includes(problem.cumulatedState)) {
                continue;
            }

            // check if name match
            if (this.filter.statuspage_name !== '') {
                if (!problem.statuspage.statuspage.name.toLowerCase().includes(this.filter.statuspage_name)) {
                    continue;
                }
            }

            if (this.filter.collection !== '') {
                if (!problem.collection.name.toLowerCase().includes(this.filter.collection)) {
                    continue;
                }
            }

            if (this.filter.category !== '') {
                if (!problem.category.name.toLowerCase().includes(this.filter.category)) {
                    continue;
                }
            }

            problemsFilered.push(problem);
        }

        this.problemsFilered = problemsFilered;
        this.cdr.markForCheck();
    }

    protected readonly CumulatedStatuspagegroupStatus = CumulatedStatuspagegroupStatus;
    protected readonly Number = Number;
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ColDirective,
    FormCheckComponent,
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
import { DebounceDirective } from '../../../directives/debounce.directive';
import {
    RegexHelperTooltipComponent
} from '../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StatuspagegroupsService } from '../statuspagegroups.service';
import { StatupagegroupViewRoot } from '../statuspagegroups.interface';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { CumulatedStatuspagegroupStatus } from '../cumulated-statuspagegroup-status.enum';
import { PermissionsService } from '../../../permissions/permissions.service';
import {
    StatuspageIconSimpleComponent
} from '../../statuspages/statuspage-icon-simple/statuspage-icon-simple.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StatuspageStatusPipe } from '../../statuspages/statuspage-status.pipe';

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
        DebounceDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective,
        FormCheckComponent,
        RegexHelperTooltipComponent,
        TranslocoDirective,
        BlockLoaderComponent,
        NgClass,
        AsyncPipe,
        RouterLink,
        StatuspageIconSimpleComponent,
        ReactiveFormsModule,
        StatuspageStatusPipe,
        TooltipDirective
    ],
    templateUrl: './statuspagegroups-viewer.component.html',
    styleUrl: './statuspagegroups-viewer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagegroupsViewerComponent implements OnInit, OnDestroy {

    public StatupagegroupViewRootResponse?: StatupagegroupViewRoot;

    private subscriptions: Subscription = new Subscription();
    public readonly PermissionsService = inject(PermissionsService);

    private readonly StatuspagegroupsService = inject(StatuspagegroupsService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadStatuspagegroup(id);
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadStatuspagegroup(id: number) {
        this.subscriptions.add(this.StatuspagegroupsService.getStatuspagegroupView(id).subscribe(response => {
            this.StatupagegroupViewRootResponse = response;
            this.cdr.markForCheck();
        }));
    }

    protected readonly CumulatedStatuspagegroupStatus = CumulatedStatuspagegroupStatus;
    protected readonly Number = Number;
}

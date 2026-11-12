import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { CvesService } from '../cves.service';
import { CvesFindingRoot } from '../cves.interface';
import { CveStateBadgeComponent } from '../../../components/cve-state-badge/cve-state-badge.component';
import { CveSeverityBadgeComponent } from '../../../components/cve-severity-badge/cve-severity-badge.component';
import { CveRuleLabelComponent } from '../../../components/cve-rule-label/cve-rule-label.component';
import { CveReasonBadgesComponent } from '../../../components/cve-reason-badges/cve-reason-badges.component';
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

@Component({
    selector: 'oitc-cves-finding',
    imports: [
        RouterLink,
        AsyncPipe,
        DecimalPipe,
        TranslocoDirective,
        FaIconComponent,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        NavComponent,
        NavItemComponent,
        RowComponent,
        TableDirective,
        XsButtonDirective,
        TableLoaderComponent,
        CveStateBadgeComponent,
        CveSeverityBadgeComponent,
        CveRuleLabelComponent,
        CveReasonBadgesComponent,
        CveRecommendationLabelComponent,
        CveDecisionStateLabelComponent,
        CvesDecideModalComponent
    ],
    templateUrl: './cves-finding.component.html',
    styleUrl: './cves-finding.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvesFindingComponent implements OnInit, OnDestroy {
    private readonly route = inject(ActivatedRoute);
    private readonly CvesService = inject(CvesService);
    private readonly modalService = inject(ModalService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();

    public findingId: number = 0;
    public result?: CvesFindingRoot;

    public modalFindingIds: number[] = [];
    public modalMode: CvesDecideModalMode = 'decide';

    public ngOnInit(): void {
        this.subscriptions.add(this.route.paramMap.subscribe(params => {
            this.findingId = Number(params.get('id'));
            this.load();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.CvesService.getFinding(this.findingId).subscribe((result) => {
            this.result = result;
            this.cdr.markForCheck();
        }));
    }

    public openModal(mode: CvesDecideModalMode): void {
        this.modalFindingIds = [this.findingId];
        this.modalMode = mode;
        this.cdr.markForCheck();
        this.modalService.toggle({
            show: true,
            id: 'cvesDecideModal'
        });
    }

    public onDecisionCompleted(success: boolean): void {
        if (success) {
            this.load();
        }
    }
}

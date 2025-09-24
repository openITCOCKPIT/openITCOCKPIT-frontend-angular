import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { StatuspagegroupsViewerComponent } from '../statuspagegroups-viewer/statuspagegroups-viewer.component';
import { CardBodyComponent, CardComponent, CardHeaderComponent, CardTitleDirective } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { StatupagegroupViewDetailsRoot } from '../statuspagegroups.interface';
import { StatuspagegroupsService } from '../statuspagegroups.service';

@Component({
    selector: 'oitc-statuspagegroups-view',
    imports: [
        RouterLink,
        FaIconComponent,
        PermissionDirective,
        StatuspagegroupsViewerComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        TranslocoDirective,
        CardTitleDirective
    ],
    templateUrl: './statuspagegroups-view.component.html',
    styleUrl: './statuspagegroups-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagegroupsViewComponent implements OnInit, OnDestroy {

    public statuspagegroup?: StatupagegroupViewDetailsRoot;

    private subscriptions: Subscription = new Subscription();
    private readonly StatuspagegroupsService = inject(StatuspagegroupsService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);
    public id: number = 0;

    public ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.id = id;
            this.loadStatuspagegroupDetails(id);
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadStatuspagegroupDetails(id: number) {
        this.subscriptions.add(this.StatuspagegroupsService.getStatuspagegroupGetDetails(id).subscribe(response => {
            this.statuspagegroup = response;
            this.cdr.markForCheck();
        }));
    }

}

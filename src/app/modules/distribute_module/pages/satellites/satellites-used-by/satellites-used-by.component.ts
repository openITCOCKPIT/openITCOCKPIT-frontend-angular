import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NgForOf, NgIf } from '@angular/common';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent,
    TableDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SatellitesService } from '../satellites.service';
import { Subscription } from 'rxjs';
import { SatelliteUsedByHost, SatelliteUsedBySatellite } from '../satellites.interface';
import {
    NotUsedByObjectComponent
} from '../../../../../layouts/coreui/not-used-by-object/not-used-by-object.component';

@Component({
    selector: 'oitc-satellites-used-by',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        FormLoaderComponent,
        NgIf,
        BackButtonDirective,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        NgForOf,
        TableDirective,
        NotUsedByObjectComponent
    ],
    templateUrl: './satellites-used-by.component.html',
    styleUrl: './satellites-used-by.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SatellitesUsedByComponent implements OnInit, OnDestroy {

    public satellite: SatelliteUsedBySatellite | undefined;
    public total: number = 0;
    public all_hosts: SatelliteUsedByHost[] = [];

    private SatellitesService: SatellitesService = inject(SatellitesService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private subscriptions: Subscription = new Subscription();
    private satelliteId: number = 0;
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.satelliteId = Number(this.route.snapshot.paramMap.get('satelliteId'));
            this.load();
            this.cdr.markForCheck();
        });
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    protected load() {
        this.subscriptions.add(this.SatellitesService.usedBy(this.satelliteId)
            .subscribe((result) => {
                this.satellite = result.satellite;
                this.all_hosts = result.all_hosts;
                this.total = result.total || 0;
                this.cdr.markForCheck();
            }));
    }
}


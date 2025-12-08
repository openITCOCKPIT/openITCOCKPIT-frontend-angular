import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TimeperiodsService } from '../timeperiods.service';
import { TimeperiodUsedByObjects, TimeperiodUsedByTimeperiod } from '../timeperiods.interface';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ContainerComponent,
    NavComponent,
    NavItemComponent,
    TableDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NotUsedByObjectComponent } from '../../../layouts/coreui/not-used-by-object/not-used-by-object.component';

import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { LabelLinkComponent } from "../../../layouts/coreui/label-link/label-link.component";

@Component({
    selector: 'oitc-timeperiods-used-by',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ContainerComponent,
        FaIconComponent,
        NavComponent,
        PermissionDirective,
        TableDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        NotUsedByObjectComponent,
        NavItemComponent,
        FormLoaderComponent,
        LabelLinkComponent
    ],
    templateUrl: './timeperiods-used-by.component.html',
    styleUrl: './timeperiods-used-by.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeperiodsUsedByComponent implements OnInit, OnDestroy {

    public timeperiod: TimeperiodUsedByTimeperiod | undefined;
    public total: number = 0;
    public objects: TimeperiodUsedByObjects | undefined;

    private timeperiodId: number = 0;

    private TimeperiodsService = inject(TimeperiodsService);
    private route = inject(ActivatedRoute);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.timeperiodId = Number(this.route.snapshot.paramMap.get('id'));
        this.load();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.subscriptions.add(this.TimeperiodsService.usedBy(this.timeperiodId)
            .subscribe((result) => {
                this.timeperiod = result.timeperiod;
                this.objects = result.objects;
                this.total = result.total;
                this.cdr.markForCheck();
            }));
    }

}

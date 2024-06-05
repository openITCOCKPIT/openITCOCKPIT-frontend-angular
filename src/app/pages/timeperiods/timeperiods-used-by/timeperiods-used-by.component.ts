import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
    ColComponent,
    ContainerComponent,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NotUsedByObjectComponent } from '../../../layouts/coreui/not-used-by-object/not-used-by-object.component';

@Component({
    selector: 'oitc-timeperiods-used-by',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ContainerComponent,
        CoreuiComponent,
        FaIconComponent,
        NavComponent,
        NgForOf,
        NgIf,
        PermissionDirective,
        TableDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        RowComponent,
        ColComponent,
        NotUsedByObjectComponent,
        NavItemComponent
    ],
    templateUrl: './timeperiods-used-by.component.html',
    styleUrl: './timeperiods-used-by.component.css'
})
export class TimeperiodsUsedByComponent implements OnInit, OnDestroy {

    public timeperiod: TimeperiodUsedByTimeperiod | undefined;
    public total: number = 0;
    public objects: TimeperiodUsedByObjects | undefined;

    private timeperiodId: number = 0;

    private TimeperiodsService = inject(TimeperiodsService);
    private router = inject(Router);
    private route = inject(ActivatedRoute)

    private subscriptions: Subscription = new Subscription();

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
            }));
    }

}

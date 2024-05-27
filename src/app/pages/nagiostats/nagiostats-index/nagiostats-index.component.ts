import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { interval, startWith, Subscription, switchMap } from 'rxjs';
import { NagiostatsService } from '../nagiostats.service';
import { Nagiostats } from '../nagiostats.interface';
import { NgClass, NgIf } from '@angular/common';
import { SparklineStatsComponent } from '../../../components/sparkline-stats/sparkline-stats.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-nagiostats-index',
    standalone: true,
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardBodyComponent,
        RowComponent,
        ColComponent,
        MatSort,
        TableDirective,
        NgClass,
        NgIf,
        SparklineStatsComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective
    ],
    templateUrl: './nagiostats-index.component.html',
    styleUrl: './nagiostats-index.component.css'
})
export class NagiostatsIndexComponent implements OnInit, OnDestroy {

    public stats: Nagiostats | undefined;

    public lastUpdate: Date = new Date();

    private subscriptions: Subscription = new Subscription();
    private readonly NagiostatsService = inject(NagiostatsService)


    public ngOnInit(): void {
        this.subscriptions.add(
            interval(10000) // emit every 10 seconds
                .pipe(
                    startWith(0), // start immediately when subscribed
                    switchMap(() => this.NagiostatsService.getIndex())
                )
                .subscribe((data: Nagiostats) => {
                    this.stats = data;
                    this.lastUpdate = new Date();
                })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadStats(): void {
        this.subscriptions.add(
            this.NagiostatsService.getIndex().subscribe((data: Nagiostats) => {
                this.stats = data;
                this.lastUpdate = new Date();
            }));
    }

}

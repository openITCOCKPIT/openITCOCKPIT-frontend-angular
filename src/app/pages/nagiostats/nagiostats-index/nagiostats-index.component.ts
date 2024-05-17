import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
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
        NgIf
    ],
    templateUrl: './nagiostats-index.component.html',
    styleUrl: './nagiostats-index.component.css'
})
export class NagiostatsIndexComponent implements OnInit, OnDestroy {

    public stats: Nagiostats | undefined;

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
                })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


}

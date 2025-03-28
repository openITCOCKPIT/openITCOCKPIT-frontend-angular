import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StatuspagesService } from '../statuspages.service';
import { Subscription } from 'rxjs';
import { PermissionsService } from '../../../permissions/permissions.service';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { StatuspageRoot } from '../statuspage.interface';
import { toString } from 'lodash';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';


@Component({
    selector: 'oitc-statuspages-view',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        BackButtonDirective,
        CardBodyComponent,
        NgIf,
        NgForOf,
        AsyncPipe,
        RowComponent,
        BlockLoaderComponent,
        TranslocoPipe,
    ],
    templateUrl: './statuspages-view.component.html',
    styleUrl: './statuspages-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagesViewComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();
    private StatuspagesService: StatuspagesService = inject(StatuspagesService);
    public readonly PermissionsService = inject(PermissionsService);
    private cdr = inject(ChangeDetectorRef);
    public statuspage!: StatuspageRoot;
    public id: number = 0;
    public showAcknowledgeComments: { [key: string]: boolean } = {};
    public showPlannedDowntimes: { [key: string]: boolean } = {};
    public showCurrentDowntimes: { [key: string]: boolean } = {};

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.StatuspagesService.getStatuspageViewData(this.id)
            .subscribe((result) => {
                //console.log(result);
                this.statuspage = result;
                this.cdr.detectChanges();
            }));
    }

    public toggleAcknowledgeComments(identifier: string) {
        if (!this.showAcknowledgeComments[identifier]) {
            this.showAcknowledgeComments[identifier] = true;
        } else {
            this.showAcknowledgeComments[identifier] = false;
        }
    }

    public togglePlannedDowntimes(identifier: string) {
        if (!this.showPlannedDowntimes[identifier]) {
            this.showPlannedDowntimes[identifier] = true;
        } else {
            this.showPlannedDowntimes[identifier] = false;
        }
    }

    public toggleCurrentDowntimes(identifier: string) {
        if (!this.showCurrentDowntimes[identifier]) {
            this.showCurrentDowntimes[identifier] = true;
        } else {
            this.showCurrentDowntimes[identifier] = false;
        }
    }


    protected readonly toString = toString;
}

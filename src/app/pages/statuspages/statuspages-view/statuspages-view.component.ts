import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {PermissionDirective} from '../../../permissions/permission.directive';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { StatuspagesService } from '../statuspages.service';
import { Subscription } from 'rxjs';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { NgForOf, NgIf } from '@angular/common';
import {XsButtonDirective} from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    StatuspageRoot}
    from '../statuspage.interface';

@Component({
  selector: 'oitc-statuspages-view',
  standalone: true,
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
    ],
  templateUrl: './statuspages-view.component.html',
  styleUrl: './statuspages-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagesViewComponent implements OnInit, OnDestroy {
    private id: number = 0;
    private subscriptions: Subscription = new Subscription();
    private StatuspagesService: StatuspagesService = inject(StatuspagesService);
    private cdr = inject(ChangeDetectorRef);
    public statuspage!: StatuspageRoot;

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.load();
    }

    public load(): void {
        this.subscriptions.add(this.StatuspagesService.getStatuspageViewData(this.id)
            .subscribe((result) => {
                //console.log(result);
                this.statuspage = result;
                this.cdr.detectChanges();
            }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}

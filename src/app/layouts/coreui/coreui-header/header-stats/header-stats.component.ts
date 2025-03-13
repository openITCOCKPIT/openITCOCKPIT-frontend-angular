import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ButtonDirective, TooltipDirective } from '@coreui/angular';
import { HeaderStatsService } from './header-stats.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-header-stats',
    imports: [
        TranslocoDirective,
        NgIf,
        FaIconComponent,
        ButtonDirective,
        TooltipDirective,
        RouterLink
    ],
    templateUrl: './header-stats.component.html',
    styleUrl: './header-stats.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderStatsComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private destroy$ = new Subject<void>();
    private cdr = inject(ChangeDetectorRef);
    private readonly HeaderStatsService: HeaderStatsService = inject(HeaderStatsService);

    protected showstatsinmenu: boolean = false;
    protected hoststatusCount: { [key: number]: number } = {};
    protected servicestatusCount: { [key: number]: number } = {};

    public ngOnInit() {
        timer(0, 30000).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.loadStats();
            }
        });


    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.subscriptions.unsubscribe();
    }


    protected loadStats() {
        this.subscriptions.add(this.HeaderStatsService.getMenustats().subscribe((data: any) => {
            this.showstatsinmenu = data.showstatsinmenu;
            this.hoststatusCount = data.hoststatusCount;
            this.servicestatusCount = data.servicestatusCount;
            this.cdr.markForCheck();
        }));
    }

}

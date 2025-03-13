import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TimezoneService } from '../../../../services/timezone.service';
import {TimezoneConfiguration } from '../../../../services/timezone.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ButtonDirective, ButtonGroupComponent, TooltipDirective } from '@coreui/angular';

@Component({
  selector: 'oitc-header-time',
    imports: [
        TranslocoDirective,
        NgIf,
        FaIconComponent,
        ButtonDirective,
        TooltipDirective
    ],
  templateUrl: './header-time.component.html',
  styleUrl: './header-time.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderTimeComponent implements OnInit, OnDestroy {

    private readonly subscriptions: Subscription = new Subscription();
    private readonly TimezoneService = inject(TimezoneService);
    private destroy$ = new Subject<void>();
    private cdr = inject(ChangeDetectorRef);

    protected timezoneConfig!: TimezoneConfiguration;
    protected showClientTime:boolean = false;
    protected pageLoadedTime = new Date().getTime();
    protected currentServerTime:string = '';
    protected currentClientTime: string= '';


    public ngOnInit() {
        this.loadTimezoneConfiguration();
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.subscriptions.unsubscribe();
    }

      protected getServerTime(): Date{
          return this.getCurrentTimeWithOffset(this.timezoneConfig.server_timezone_offset);
      };

    protected getClientTime(): Date {
        return this.getCurrentTimeWithOffset(this.timezoneConfig.user_offset)
    }

    protected formatTimeAsString (time: Date){
        return this.prependZero(time.getUTCHours()) + ':' + this.prependZero(time.getUTCMinutes());
    };

    protected prependZero(number: number){
        if(number < 10){
            return '0' + number;
        }
        return number.toString();
    };

    private runClocks(){
        this.currentServerTime = this.formatTimeAsString(this.getServerTime());
        if(this.showClientTime){
            this.currentClientTime = this.formatTimeAsString(this.getClientTime());
        }
        this.cdr.markForCheck();
    };
      protected getCurrentTimeWithOffset(offset:number): Date{
        let DateObject:Date =
        new Date((this.timezoneConfig.server_time_utc + (offset || 0)) * 1000 + (new Date().getTime() - this.pageLoadedTime));
          return DateObject;
      }

    private loadTimezoneConfiguration() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe((TimezoneConfiguration) => {
            this.timezoneConfig = TimezoneConfiguration;
            if(this.timezoneConfig.user_offset !== this.timezoneConfig.server_timezone_offset){
                this.showClientTime = true;
            }
            timer(0, 10000).pipe(takeUntil(this.destroy$)).subscribe({next: () => {
                this.runClocks();
            }});
            this.cdr.markForCheck();
        }));

    }

}

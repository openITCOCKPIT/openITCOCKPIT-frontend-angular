import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { HoststatusObject } from '../hosts.interface';
import { TranslocoService } from '@jsverse/transloco';
import { NgClass } from '@angular/common';
import { TooltipDirective } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-hoststatus-icon',
    imports: [
        NgClass,
        TooltipDirective,
        FaIconComponent
    ],
    templateUrl: './hoststatus-icon.component.html',
    styleUrl: './hoststatus-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoststatusIconComponent implements OnInit, OnDestroy {

    private _hoststatus?: HoststatusObject;

    private readonly TranslocoService = inject(TranslocoService);

    private cdr = inject(ChangeDetectorRef);

    @Input()
    set hoststatus(value: HoststatusObject | undefined) {
        this._hoststatus = value;
        this.onHoststatusChange();
    }

    get hoststatus(): HoststatusObject | undefined {
        return this._hoststatus;
    }

    // Set this to an empty string if you use the ng-content outlet
    @Input() statusCircleClass: string = 'status-circle';

    onHoststatusChange() {
        if (this.hoststatus) {

            this.isFlapping = Boolean(this.hoststatus.isFlapping);
            this.isHardstate = Boolean(this.hoststatus.isHardstate);
            this.inMonitoring = typeof this.hoststatus.currentState === 'number';
            this.currentState = Number(this.hoststatus.currentState);

            this.btnColor = 'btn-primary';
            this.flappingColor = 'text-primary';
            this.humanState = this.TranslocoService.translate('not in monitoring');
            this.opacity = '';

            if (this.inMonitoring) {
                switch (this.currentState) {
                    case 0:
                        this.btnColor = 'btn-success';
                        this.flappingColor = 'text-success';
                        this.humanState = this.TranslocoService.translate('up');
                        break;

                    case 1:
                        this.btnColor = 'btn-danger';
                        this.flappingColor = 'text-danger';
                        this.humanState = this.TranslocoService.translate('down');
                        break;

                    case 2:
                        this.btnColor = 'btn-secondary';
                        this.flappingColor = 'text-secondary';
                        this.humanState = this.TranslocoService.translate('unreachable');
                        break;
                }

                if (this.isHardstate) {
                    this.humanState = this.humanState + ' ' + this.TranslocoService.translate('(HARD)');
                    this.opacity = '';
                } else {
                    this.humanState = this.humanState + ' ' + this.TranslocoService.translate('(SOFT)');
                    this.opacity = 'opacity-50';
                }

                this.stopFlapping();
                if (this.isFlapping) {
                    this.startFlapping();
                }

            }
        }
    }

    public isFlapping: boolean = false;
    public isHardstate: boolean = true;
    public inMonitoring: boolean = false;
    public btnColor: string = 'btn-primary';
    public flappingColor: string = 'text-primary';
    public currentState: number = -1; //Not found in monitoring
    public humanState: string = this.TranslocoService.translate('not in monitoring');
    public opacity: string = '';

    public flappingState: number = 0;


    private interval: any;

    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {
        this.stopFlapping();
    }

    public startFlapping() {
        if (this.interval) {
            clearInterval(this.interval);
        }

        // We use a classic setInterval as it is way more constant and needs WAY LESS cpu power as the new RxJS fancy hipster stuff
        this.interval = setInterval(() => {
            this.flappingState = this.flappingState === 0 ? 1 : 0;
            this.cdr.markForCheck();
        }, 750);
    }

    public stopFlapping() {
        if (this.interval) {
            clearInterval(this.interval);
            this.cdr.markForCheck();
        }
    }

}

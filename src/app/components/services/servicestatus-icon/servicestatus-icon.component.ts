import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { TooltipDirective } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoService } from '@jsverse/transloco';
import { ServicestatusObject } from '../../../pages/services/services.interface';


@Component({
    selector: 'oitc-servicestatus-icon',
    imports: [NgClass, NgIf, TooltipDirective, FaIconComponent],
    templateUrl: './servicestatus-icon.component.html',
    styleUrl: './servicestatus-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicestatusIconComponent implements OnInit, OnDestroy {


    private _servicestatus?: ServicestatusObject;

    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    @Input()
    set servicestatus(value: ServicestatusObject | undefined) {
        this._servicestatus = value;
        this.onServicestatusChange();
    }

    get servicestatus(): ServicestatusObject | undefined {
        return this._servicestatus;
    }

    // Set this to an empty string if you use the ng-content outlet
    @Input() statusCircleClass: string = 'status-circle';

    onServicestatusChange() {
        if (this.servicestatus) {

            this.isFlapping = Boolean(this.servicestatus.isFlapping);
            this.isHardstate = Boolean(this.servicestatus.isHardstate);
            this.inMonitoring = typeof this.servicestatus.currentState === 'number';
            this.currentState = Number(this.servicestatus.currentState);

            this.btnColor = 'btn-primary';
            this.flappingColor = 'text-primary';
            this.humanState = this.TranslocoService.translate('not in monitoring');
            this.opacity = '';

            if (this.inMonitoring) {
                switch (this.currentState) {
                    case 0:
                        this.btnColor = 'btn-success';
                        this.flappingColor = 'text-success';
                        this.humanState = this.TranslocoService.translate('ok');
                        break;

                    case 1:
                        this.btnColor = 'btn-warning';
                        this.flappingColor = 'text-warning';
                        this.humanState = this.TranslocoService.translate('warning');
                        break;

                    case 2:
                        this.btnColor = 'btn-danger';
                        this.flappingColor = 'text-danger';
                        this.humanState = this.TranslocoService.translate('critical');
                        break;

                    case 3:
                        this.btnColor = 'btn-secondary';
                        this.flappingColor = 'text-secondary';
                        this.humanState = this.TranslocoService.translate('unknown');
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

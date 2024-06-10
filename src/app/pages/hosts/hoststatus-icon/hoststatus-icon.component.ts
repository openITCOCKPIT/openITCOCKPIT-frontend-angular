import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { HoststatusObject } from '../hosts.interface';
import { TranslocoService } from '@jsverse/transloco';
import { NgClass, NgIf } from '@angular/common';
import { TooltipDirective } from '@coreui/angular';
import { interval, map, Subscription } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-hoststatus-icon',
    standalone: true,
    imports: [
        NgIf,
        NgClass,
        TooltipDirective,
        FaIconComponent
    ],
    templateUrl: './hoststatus-icon.component.html',
    styleUrl: './hoststatus-icon.component.css'
})
export class HoststatusIconComponent implements OnInit, OnDestroy {

    private _hoststatus?: HoststatusObject;

    private readonly TranslocoService = inject(TranslocoService);


    @Input()
    set hoststatus(value: HoststatusObject | undefined) {
        this._hoststatus = value;
        this.onHoststatusChange();
    }

    get hoststatus(): HoststatusObject | undefined {
        return this._hoststatus;
    }

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

                if (this.isFlapping) {
                    this.startFlapping();
                } else {
                    this.stopFlapping();
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

    private flappingSubscription: Subscription = new Subscription();

    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {
        this.flappingSubscription.unsubscribe();
    }

    public startFlapping() {
        this.flappingSubscription.add(
            interval(750).pipe(
                map(() => this.flappingState = this.flappingState === 0 ? 1 : 0)
            ).subscribe()
        );
    }

    public stopFlapping() {
        this.flappingSubscription.unsubscribe();
    }

}

import { Component, inject, Input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ServicestatusObject } from '../../../../services/services.interface';
import { TranslocoService } from '@jsverse/transloco';
import { NgClass } from '@angular/common';

@Component({
    selector: 'oitc-servicestatus-icon-automap',
    standalone: true,
    imports: [
        FaIconComponent,
        NgClass
    ],
    templateUrl: './servicestatus-icon-automap.component.html',
    styleUrl: './servicestatus-icon-automap.component.css'
})
export class ServicestatusIconAutomapComponent {

    public icon: IconProp = ['fas', 'square'];
    public iconColor: string = 'text-primary';
    public isHardstate: boolean = true;
    public inMonitoring: boolean = false;
    public currentState: number = -1; //Not found in monitoring
    public opacity: string = '';


    private _servicestatus?: ServicestatusObject;

    private readonly TranslocoService = inject(TranslocoService);


    @Input()
    set servicestatus(value: ServicestatusObject | undefined) {
        this._servicestatus = value;
        this.onServicestatusChange();
    }

    get servicestatus(): ServicestatusObject | undefined {
        return this._servicestatus;
    }


    onServicestatusChange() {
        if (this.servicestatus) {

            this.icon = ['fas', 'square'];

            this.isHardstate = Boolean(this.servicestatus.isHardstate);
            this.inMonitoring = typeof this.servicestatus.currentState === 'number';
            this.currentState = Number(this.servicestatus.currentState);
            this.opacity = '';


            if (this.inMonitoring) {
                this.iconColor = String(this.servicestatus.textClass);

                if (this.isHardstate) {
                    this.opacity = '';
                } else {
                    this.opacity = 'opacity-50';
                }

                if (this.servicestatus.problemHasBeenAcknowledged) {
                    this.icon = ['fas', 'user'];
                }

                if (Number(this.servicestatus.scheduledDowntimeDepth) > 0) {
                    this.icon = ['fas', 'power-off'];
                }
            }
        }
    }

}

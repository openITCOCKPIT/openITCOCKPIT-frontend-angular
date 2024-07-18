import { Component, inject, Input } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { NgClass, NgIf } from '@angular/common';
import { TooltipDirective } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-hoststatus-simple-icon',
    standalone: true,
    imports: [
        NgIf,
        NgClass,
        TooltipDirective,
        FaIconComponent
    ],
    templateUrl: './hoststatus-simple-icon.component.html',
    styleUrl: './hoststatus-simple-icon.component.css'
})
export class HoststatusSimpleIconComponent {
    private readonly TranslocoService = inject(TranslocoService);
    public btnColor: string = 'btn-primary';
    public state?: number = -1; //Not found in monitoring
    public isHardstate: boolean = true;
    public humanState: string = this.TranslocoService.translate('not in monitoring');

    @Input()
    set hoststatus(value: number | undefined) {
        this.state = value;
        if (typeof this.state !== 'undefined' && this.state >= 0) {
            switch (this.state) {
                case 0:
                    this.btnColor = 'btn-success';
                    this.humanState = this.TranslocoService.translate('up');
                    break;

                case 1:
                    this.btnColor = 'btn-danger';
                    this.humanState = this.TranslocoService.translate('down');
                    break;

                case 2:
                    this.btnColor = 'btn-secondary';
                    this.humanState = this.TranslocoService.translate('unreachable');
                    break;
            }
        }
    }

    get hoststatus(): number | undefined {
        return this.state;
    }

    @Input()
    set hardstate(value: number | boolean | undefined) {
        this.isHardstate = false;
        if (value === 1 || value === true) {
            this.isHardstate = true;
        }
    }

    get hardstate(): boolean {
        return this.isHardstate;
    }
}

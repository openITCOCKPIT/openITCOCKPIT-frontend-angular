import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { NgClass } from '@angular/common';
import { TooltipDirective } from '@coreui/angular';


@Component({
    selector: 'oitc-servicestatus-simple-icon',
    imports: [
    NgClass,
    TooltipDirective
],
    templateUrl: './servicestatus-simple-icon.component.html',
    styleUrl: './servicestatus-simple-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicestatusSimpleIconComponent {
    private readonly TranslocoService = inject(TranslocoService);
    public btnColor: string = 'btn-primary';
    public state?: number = -1; //Not found in monitoring
    public isHardstate: boolean = true;
    public humanState: string = this.TranslocoService.translate('not in monitoring');
    private cdr = inject(ChangeDetectorRef);

    @Input()
    set servicestatus(value: number | undefined) {
        this.state = value;
        if (typeof this.state !== 'undefined' && this.state >= 0) {
            switch (this.state) {
                case 0:
                    this.btnColor = 'btn-success';
                    this.humanState = this.TranslocoService.translate('ok');
                    break;

                case 1:
                    this.btnColor = 'btn-warning';
                    this.humanState = this.TranslocoService.translate('warning');
                    break;

                case 2:
                    this.btnColor = 'btn-danger';
                    this.humanState = this.TranslocoService.translate('critical');
                    break;

                case 3:
                    this.btnColor = 'btn-secondary';
                    this.humanState = this.TranslocoService.translate('unknown');
                    break;
            }
            this.cdr.markForCheck();
        }
    }

    get servicestatus(): number | undefined {
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

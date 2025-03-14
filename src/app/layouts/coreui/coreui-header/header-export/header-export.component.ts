import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { TooltipDirective } from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ExportRunningService } from '../../../../services/export-running.service';
import { HeaderInfo } from '../header-info.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-header-export',
    imports: [
        TranslocoDirective,
        TooltipDirective,
        RouterLink,
        FaIconComponent,
        NgIf
    ],
    templateUrl: './header-export.component.html',
    styleUrl: './header-export.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderExportComponent {

    private cdr = inject(ChangeDetectorRef);


    @Input({required: true}) public headerinfo: HeaderInfo = {} as HeaderInfo;
    public isRunning: boolean = false;

    //public isRunning = signal(false) ;

    constructor(public ExportRunningService: ExportRunningService) {
        this.ExportRunningService.isRunningExport$.subscribe({
            next: newValue => {
                this.isRunning = newValue;
                this.cdr.markForCheck();
            }
        });
    }

}

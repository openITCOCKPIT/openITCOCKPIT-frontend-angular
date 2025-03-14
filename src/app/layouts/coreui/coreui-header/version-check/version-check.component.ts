import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HeaderInfo } from '../header-info.service';
import { TooltipDirective } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-version-check',
    imports: [
        TooltipDirective,
        TranslocoDirective,
        RouterLink,
        FaIconComponent,
        NgIf
    ],
    templateUrl: './version-check.component.html',
    styleUrl: './version-check.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionCheckComponent {
    @Input({required: true}) public newVersion: boolean = false;

}

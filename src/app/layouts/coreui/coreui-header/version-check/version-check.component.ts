import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TooltipDirective } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-version-check',
    imports: [
        TooltipDirective,
        TranslocoDirective,
        RouterLink,
        FaIconComponent,
    ],
    templateUrl: './version-check.component.html',
    styleUrl: './version-check.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionCheckComponent {
    @Input({required: true}) public newVersion: boolean = false;
}

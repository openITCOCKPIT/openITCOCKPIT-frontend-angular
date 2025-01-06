import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
    selector: 'oitc-required-icon',
    imports: [
        FaIconComponent
    ],
    templateUrl: './required-icon.component.html',
    styleUrl: './required-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequiredIconComponent {
}

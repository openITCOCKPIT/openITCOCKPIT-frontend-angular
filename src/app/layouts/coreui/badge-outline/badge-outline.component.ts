import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'oitc-badge-outline',
    imports: [
        NgClass
    ],
    templateUrl: './badge-outline.component.html',
    styleUrl: './badge-outline.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeOutlineComponent {
    public color = input<'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');
}

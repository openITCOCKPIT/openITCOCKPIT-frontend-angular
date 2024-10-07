import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'oitc-badge-outline',
    standalone: true,
    imports: [
        NgClass
    ],
    templateUrl: './badge-outline.component.html',
    styleUrl: './badge-outline.component.css'
})
export class BadgeOutlineComponent {
    @Input() public color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' = 'primary';
}

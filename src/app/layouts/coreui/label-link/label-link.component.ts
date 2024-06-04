import { Component, inject, Input } from '@angular/core';
import { PermissionsService } from '../../../permissions/permissions.service';
import { RouterLink } from '@angular/router';
import { NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'oitc-label-link',
    standalone: true,
    imports: [
        RouterLink,
        NgTemplateOutlet,
        NgIf
    ],
    templateUrl: './label-link.component.html',
    styleUrl: './label-link.component.css'
})
export class LabelLinkComponent {

    @Input() public objectId: number | null | undefined = null;
    @Input() public permissions: string[] | string = [];
    @Input() public route: string = '';

    public PermissionService: PermissionsService = inject(PermissionsService);

    public hasPermission(): boolean {
        return this.PermissionService.hasPermission(this.permissions);
    }
}

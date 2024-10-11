import { Component, inject, input } from '@angular/core';
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

    public objectId = input<number | null | undefined>(null);
    public permissions = input<string[] | string>([]);
    public route = input<string>('');

    public PermissionService: PermissionsService = inject(PermissionsService);

    public hasPermission(): boolean {
        return this.PermissionService.hasPermission(this.permissions());
    }
}

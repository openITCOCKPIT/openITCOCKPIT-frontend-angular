import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { PermissionsService } from '../../../permissions/permissions.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
    selector: 'oitc-label-link',
    standalone: true,
    imports: [
        RouterLink,
        NgTemplateOutlet,
        NgIf,
        AsyncPipe
    ],
    templateUrl: './label-link.component.html',
    styleUrl: './label-link.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelLinkComponent {

    public objectId = input<number | null | undefined>(null);
    public permissions = input<string[] | string>([]);
    public route = input<string>('');

    public hasPermission$: Observable<boolean> = new Observable<boolean>();

    public PermissionService: PermissionsService = inject(PermissionsService);
    private cdr = inject(ChangeDetectorRef);

    public constructor() {
        effect(() => {
            this.hasPermission$ = this.PermissionService.hasPermissionObservable(this.permissions());
            this.cdr.markForCheck();
        });
    }

}

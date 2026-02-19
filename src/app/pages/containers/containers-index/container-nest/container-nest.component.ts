import { ChangeDetectionStrategy, Component, inject, input, TemplateRef } from '@angular/core';
import { ContainersIndexNested } from '../../containers.interface';
import { CommonModule } from '@angular/common';


import { TranslocoDirective } from '@jsverse/transloco';
import { PermissionsService } from '../../../../permissions/permissions.service';


import { ContainersService } from '../../containers.service';

@Component({
    selector: 'oitc-container-nest',
    imports: [
        TranslocoDirective,
        CommonModule
    ],
    templateUrl: './container-nest.component.html',
    styleUrl: './container-nest.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerNestComponent {

    //@Input() public collapsed: boolean[] = [];
    public collapsed = input<boolean[]>([]);

    //@Input() public nestedContainers: ContainersIndexNested[] = [];
    public nestedContainers = input<ContainersIndexNested[]>([]);

    //@Input() public level: number = 0;
    public level = input(0);

    //@Input() containerTemplate!: TemplateRef<any>
    containerTemplate = input<TemplateRef<any> | null>(null);

    public readonly PermissionsService = inject(PermissionsService);
    public readonly ContainersService = inject(ContainersService);

    public toggleCollapsed(index: number): void {
        this.collapsed()[index] = !this.collapsed()[index];
    }

}

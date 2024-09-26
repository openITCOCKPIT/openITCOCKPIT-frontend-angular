import { Component, inject, Input, TemplateRef } from '@angular/core';
import { ContainersIndexNested } from '../../containers.interface';
import { CommonModule, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { LabelLinkComponent } from '../../../../layouts/coreui/label-link/label-link.component';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { RouterLink } from '@angular/router';
import { TooltipDirective } from '@coreui/angular';
import { DeleteAllModalComponent } from '../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DisableModalComponent } from '../../../../layouts/coreui/disable-modal/disable-modal.component';
import { ContainersService } from '../../containers.service';

@Component({
    selector: 'oitc-container-nest',
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        FaIconComponent,
        XsButtonDirective,
        TranslocoDirective,
        NgSwitchCase,
        LabelLinkComponent,
        RequiredIconComponent,
        NgSwitch,
        NgSwitchDefault,
        RouterLink,
        TooltipDirective,
        TranslocoPipe,
        DeleteAllModalComponent,
        DisableModalComponent,
        CommonModule
    ],
    templateUrl: './container-nest.component.html',
    styleUrl: './container-nest.component.css'
})
export class ContainerNestComponent {

    @Input() public nestedContainers: ContainersIndexNested[] = [];
    @Input() public level: number = 0;
    @Input() public collapsed: boolean[] = [];

    @Input() containerTemplate!: TemplateRef<any>

    public readonly PermissionsService = inject(PermissionsService);
    public readonly ContainersService = inject(ContainersService);

    public toggleCollapsed(index: number): void {
        this.collapsed[index] = !this.collapsed[index];
    }

}

import { Component, inject, Input } from '@angular/core';
import { ContainersIndexNested } from '../../containers.interface';
import { NgForOf, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ContainerTypesEnum } from '../../../changelogs/object-types.enum';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TranslocoDirective } from '@jsverse/transloco';
import { PermissionsService } from '../../../../permissions/permissions.service';

@Component({
    selector: 'oitc-container-nest',
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        FaIconComponent,
        XsButtonDirective,
        TranslocoDirective
    ],
    templateUrl: './container-nest.component.html',
    styleUrl: './container-nest.component.css'
})
export class ContainerNestComponent {

    @Input() public nestedContainers: ContainersIndexNested[] = [];
    @Input() public level: number = 0;

    public collapsed: boolean[] = [];
    public readonly PermissionsService = inject(PermissionsService);


    public toggleCollapsed(index: number): void {
        this.collapsed[index] = !this.collapsed[index];
    }

    public getIconByContainerType(containerType: number): IconProp {
        switch (containerType) {
            case ContainerTypesEnum.CT_GLOBAL:
                return ['fas', 'globe'];

            case ContainerTypesEnum.CT_TENANT:
                return ['fas', 'home'];

            case ContainerTypesEnum.CT_LOCATION:
                return ['fas', 'location-arrow'];

            case ContainerTypesEnum.CT_NODE:
                return ['fas', 'link'];

            case ContainerTypesEnum.CT_CONTACTGROUP:
                return ['fas', 'users'];

            case ContainerTypesEnum.CT_HOSTGROUP:
                return ['fas', 'server'];

            case ContainerTypesEnum.CT_SERVICEGROUP:
                return ['fas', 'cogs'];

            case ContainerTypesEnum.CT_SERVICETEMPLATEGROUP:
                return ['fas', 'pen-to-square'];

            default:
                return ['fas', 'question'];
        }
    }

}

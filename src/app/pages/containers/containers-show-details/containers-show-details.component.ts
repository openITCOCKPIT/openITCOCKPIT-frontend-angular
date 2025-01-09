import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  BorderDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleDirective,
  ColComponent,
  InputGroupComponent,
  InputGroupTextDirective,
  ModalService,
  NavComponent,
  NavItemComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../directives/back-button.directive';

import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { ContainersService } from '../containers.service';
import {
    ContainerChildElements,
    ContainerDetailsWithChilds,
    ContainerShowDetailsObjectDetails,
    ContainerShowDetailsObjectTypesEnum
} from '../containers.interface';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { ContainerTypesEnum, ROOT_CONTAINER } from '../../changelogs/object-types.enum';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { GenericKeyValue } from '../../../generic.interfaces';

@Component({
    selector: 'oitc-containers-show-details',
    imports: [
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    PermissionDirective,
    TranslocoDirective,
    RouterLink,
    BackButtonDirective,
    NavComponent,
    NavItemComponent,
    XsButtonDirective,
    ColComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    SelectComponent,
    BlockLoaderComponent,
    NgIf,
    BorderDirective,
    NgForOf,
    TableDirective,
    AsyncPipe
],
    templateUrl: './containers-show-details.component.html',
    styleUrl: './containers-show-details.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainersShowDetailsComponent implements OnInit, OnDestroy {

    public selectedContainerId: number = 0;
    public objectDetails: ContainerShowDetailsObjectDetails[] = [];
    public containers?: SelectKeyValue[] = [];
    public containerDetails?: ContainerDetailsWithChilds[];


    private subscriptions: Subscription = new Subscription();
    public readonly PermissionsService = inject(PermissionsService);
    private readonly ContainersService = inject(ContainersService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.objectDetails = this.getObjectDetails();
        this.loadContainersForSelect();

        this.subscriptions.add(this.route.params.subscribe(
            params => {
                if (params.hasOwnProperty('id')) {
                    const id = Number(params['id']);
                    if (id) {
                        this.selectedContainerId = id;
                        this.loadContainerDetails();
                    }
                }
            }
        ));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private loadContainersForSelect(): void {
        this.subscriptions.add(this.ContainersService.loadAllContainers().subscribe(containers => {
            // Filter the ROOT_CONTAINER as it has to many dependencies to display
            this.containers = containers.filter(c => c.key !== ROOT_CONTAINER);
            this.loadContainerDetails();
        }));
    }

    public onContainerChange() {
        // Update the URL with the new container ID
        // The reload will be done by the subscription to the route params
        // see ngOnInit method for details
        this.router.navigate(['/', 'containers', 'showDetails', this.selectedContainerId], {
            queryParamsHandling: 'merge'
        });
    }

    public loadContainerDetails() {
        this.subscriptions.add(this.ContainersService.loadShowDetails(this.selectedContainerId).subscribe(containerDetails => {
            this.containerDetails = containerDetails.containersWithChilds;
            this.cdr.markForCheck();
        }));
    }

    public hasChildElementsForObjectDetails(childElements: ContainerChildElements, objectDetails: ContainerShowDetailsObjectDetails): boolean {
        if (childElements[objectDetails.objectType]) {
            return Object.values(childElements[objectDetails.objectType]).length > 0;
        }

        return false
    }

    public getChildElementsByTypeAsIterator(childElements: ContainerChildElements, objectDetails: ContainerShowDetailsObjectDetails): GenericKeyValue[] {
        let elements: GenericKeyValue[] = [];

        if (childElements[objectDetails.objectType]) {
            elements = Object.entries(childElements[objectDetails.objectType]).map(([key, value]) => {
                return {
                    key,
                    value
                };
            });
        }

        return elements;
    }

    private getObjectDetails(): ContainerShowDetailsObjectDetails[] {
        const details: ContainerShowDetailsObjectDetails[] = [
            {
                objectType: ContainerShowDetailsObjectTypesEnum.hosts,
                label: this.TranslocoService.translate('Hosts'),
                icon: ['fas', 'desktop'],
                rights: ['hosts', 'edit'],
                baseRoute: '/hosts/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.hosttemplates,
                label: this.TranslocoService.translate('Host templates'),
                icon: ['fas', 'pen-to-square'],
                rights: ['hosttemplates', 'edit'],
                baseRoute: '/hosttemplates/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.hostgroups,
                label: this.TranslocoService.translate('Host groups'),
                icon: ['fas', 'server'],
                rights: ['hostgroups', 'edit'],
                baseRoute: '/hostgroups/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.servicetemplates,
                label: this.TranslocoService.translate('Service templates'),
                icon: ['fas', 'pen-to-square'],
                rights: ['servicetemplates', 'edit'],
                baseRoute: '/servicetemplates/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.servicetemplategroups,
                label: this.TranslocoService.translate('Service template groups'),
                icon: ['fas', 'pen-to-square'],
                rights: ['servicetemplategroups', 'edit'],
                baseRoute: '/servicetemplategroups/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.servicegroups,
                label: this.TranslocoService.translate('Service groups'),
                icon: ['fas', 'cogs'],
                rights: ['servicegroups', 'edit'],
                baseRoute: '/servicegroups/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.timeperiods,
                label: this.TranslocoService.translate('Time periods'),
                icon: ['fas', 'clock'],
                rights: ['timeperiods', 'edit'],
                baseRoute: '/timeperiods/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.contacts,
                label: this.TranslocoService.translate('Contacts'),
                icon: ['fas', 'user'],
                rights: ['contacts', 'edit'],
                baseRoute: '/contacts/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.contactgroups,
                label: this.TranslocoService.translate('Contact groups'),
                icon: ['fas', 'users'],
                rights: ['contactgroups', 'edit'],
                baseRoute: '/contactgroups/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.users,
                label: this.TranslocoService.translate('Users'),
                icon: ['fas', 'user'],
                rights: ['users', 'edit'],
                baseRoute: '/users/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.usercontainerroles,
                label: this.TranslocoService.translate('User container roles'),
                icon: ['fas', 'users'],
                rights: ['usercontainerroles', 'edit'],
                baseRoute: '/usercontainerroles/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.hostdependencies,
                label: this.TranslocoService.translate('Host dependencies'),
                icon: ['fas', 'sitemap'],
                rights: ['hostdependencies', 'edit'],
                baseRoute: '/hostdependencies/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.hostescalations,
                label: this.TranslocoService.translate('Host escalations'),
                icon: ['fas', 'bomb'],
                rights: ['hostescalations', 'edit'],
                baseRoute: '/hostescalations/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.servicedependencies,
                label: this.TranslocoService.translate('Service dependencies'),
                icon: ['fas', 'sitemap'],
                rights: ['servicedependencies', 'edit'],
                baseRoute: '/servicedependencies/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.serviceescalations,
                label: this.TranslocoService.translate('Service escalations'),
                icon: ['fas', 'bomb'],
                rights: ['serviceescalations', 'edit'],
                baseRoute: '/serviceescalations/edit/'
            },
            {
                objectType: ContainerShowDetailsObjectTypesEnum.instantreports,
                label: this.TranslocoService.translate('Instant reports'),
                icon: ['fas', 'file-invoice'],
                rights: ['instantreports', 'edit'],
                baseRoute: '/instantreports/edit/'
            },
        ];

        this.PermissionsService.hasModuleObservable('AutoreportModule').subscribe(hasModule => {
            if (hasModule) {
                details.push({
                    objectType: ContainerShowDetailsObjectTypesEnum.autoreports,
                    label: this.TranslocoService.translate('Auto reports'),
                    icon: ['fas', 'file-invoice'],
                    rights: ['AutoreportModule', 'autoreports', 'edit'],
                    baseRoute: '/autoreport_module/instantreports/EditStepOne/'
                });
            }
        });

        this.PermissionsService.hasModuleObservable('DistributeModule').subscribe(hasModule => {
            if (hasModule) {
                details.push({
                    objectType: ContainerShowDetailsObjectTypesEnum.satellites,
                    label: this.TranslocoService.translate('Satellites'),
                    icon: ['fas', 'satellite'],
                    rights: ['DistributeModule', 'satellites', 'edit'],
                    baseRoute: '/distribute_module/satellites/edit/'
                });
            }
        });

        this.PermissionsService.hasModuleObservable('MapModule').subscribe(hasModule => {
            if (hasModule) {
                details.push({
                    objectType: ContainerShowDetailsObjectTypesEnum.maps,
                    label: this.TranslocoService.translate('Maps'),
                    icon: ['fas', 'map-marker'],
                    rights: ['MapModule', 'maps', 'edit'],
                    baseRoute: '/map_module/maps/edit/'
                });
            }
        });

        this.PermissionsService.hasModuleObservable('GrafanaModule').subscribe(hasModule => {
            if (hasModule) {
                details.push({
                    objectType: ContainerShowDetailsObjectTypesEnum.grafana_userdashboards,
                    label: this.TranslocoService.translate('Grafana User dashboards'),
                    icon: ['fas', 'area-chart'],
                    rights: ['GrafanaModule', 'GrafanaUserdashboards', 'edit'],
                    baseRoute: '/grafana_module/grafana_userdashboards/edit/'
                });
            }
        });

        return details;

    }

    protected readonly ContainerTypesEnum = ContainerTypesEnum;
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormLabelDirective,
    ModalService,
    RowComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ContainersService } from '../containers.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { ROOT_CONTAINER } from '../../changelogs/object-types.enum';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { JsonPipe, NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { ContainersIndexNested } from '../containers.interface';
import { NestLoaderComponent } from '../../../layouts/primeng/loading/nest-loader/nest-loader.component';
import { ContainerNestComponent } from './container-nest/container-nest.component';

@Component({
    selector: 'oitc-containers-index',
    standalone: true,
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardBodyComponent,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NgIf,
        RequiredIconComponent,
        SelectComponent,
        RowComponent,
        ColComponent,
        JsonPipe,
        NestLoaderComponent,
        ContainerNestComponent
    ],
    templateUrl: './containers-index.component.html',
    styleUrl: './containers-index.component.css'
})
export class ContainersIndexComponent implements OnInit, OnDestroy {

    public containers?: SelectKeyValue[] = [];

    public selectedContainerId: number = 0;
    public nestedContainers: ContainersIndexNested[] = [];
    public isLoading: boolean = false;


    private subscriptions: Subscription = new Subscription();
    private readonly ContainersService = inject(ContainersService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    public ngOnInit(): void {

        this.loadContainersForSelect();

        // This subscription is used to reload the container tree, when the ID in the URL changes.
        // This will happen in the following cases:
        // - The user navigates to /containers/index and select a ID form the dropdown
        // - The user navigates to /containers/index/ID directly
        // - The user click on a CT_NODE link the tree
        this.subscriptions.add(this.route.params.subscribe(
            params => {
                if (params.hasOwnProperty('id')) {
                    const id = Number(params['id']);
                    if (id) {
                        this.selectedContainerId = id;
                        this.loadContainers(id);
                    }
                }
            }
        ));

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onContainerChange(event: any) {
        // Clear the current container tree
        this.nestedContainers = [];

        // Update the URL with the new container ID
        this.router.navigate(['/', 'containers', 'index', this.selectedContainerId], {
            queryParamsHandling: 'merge'
        });

        // Load new container tree
        //this.loadContainers(this.selectedContainerId);
        // The reload will be done by the subscription to the route params
        // see ngOnInit method for details
    }
    
    public loadContainers(id: number) {
        this.isLoading = true;
        this.subscriptions.add(this.ContainersService.loadContainersByContainerId(id).subscribe(containers => {
            this.nestedContainers = containers;
            this.isLoading = false;
        }));
    }

    public loadContainersForSelect(): void {
        this.subscriptions.add(this.ContainersService.loadAllContainers().subscribe(containers => {
            this.containers = containers;
        }));
    }

    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
}

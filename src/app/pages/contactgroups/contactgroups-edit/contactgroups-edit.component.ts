import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective, FormDirective, FormLabelDirective, NavComponent, NavItemComponent, TooltipDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { MacrosComponent } from '../../../components/macros/macros.component';
import { NgForOf, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Container } from '../../containers/containers.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { LoadUsersByContainerIdRoot, UserByContainer } from '../../users/users.interface';
import { ContainersService } from '../../containers/containers.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { ContactgroupsService } from '../contactgroups.service';
import { Contactgroup, ContactgroupsEditRoot, GetContactsByContainerIdRootContact } from '../contactgroups.interface';
import { ContactsService } from '../../contacts/contacts.service';

@Component({
    selector: 'oitc-contactgroups-edit',
    standalone: true,
    imports: [
        BackButtonDirective,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        MacrosComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NgSelectModule,
        PermissionDirective,
        RequiredIconComponent,
        TooltipDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        ObjectUuidComponent
    ],
    templateUrl: './contactgroups-edit.component.html',
    styleUrl: './contactgroups-edit.component.css'
})
export class ContactgroupsEditComponent implements OnInit, OnDestroy {

    private containersService: ContainersService = inject(ContainersService);
    private subscriptions: Subscription = new Subscription();
    private ContactgroupsService: ContactgroupsService = inject(ContactgroupsService);
    protected contacts: UserByContainer[] = [];
    private router: Router = inject(Router);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError = {} as GenericValidationError;

    public post: Contactgroup = {
        contacts: {
            _ids: []
        },
        container: {
            containertype_id: 0,
            id: 0,
            lft: 0,
            name: '',
            parent_id: 0,
            rght: 0
        },
        container_id: 0,
        description: '',
        id: 0,
        uuid: ''
    };
    protected containers: Container[] = [];
    private route = inject(ActivatedRoute)

    public ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        //First, load shit into the component.
        this.loadContainers();
        this.subscriptions.add(this.ContactgroupsService.getEdit(id)
            .subscribe((result: ContactgroupsEditRoot) => {

                // Then put post where it belongs. Also unpack that bullshit
                this.post = result.contactgroup.Contactgroup;

                // Then force containerChange!
                this.onContainerChange();
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public updateContactgroup(): void {

        this.subscriptions.add(this.ContactgroupsService.updateContactgroup(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Contactgroup');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['contactgroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.router.navigate(['/contactgroups/index']);

                    return;
                }

                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

    private loadContainers(): void {
        this.subscriptions.add(this.containersService.loadContainers()
            .subscribe((result) => {
                this.containers = result.containers;
            }))
    }

    private loadContacts() {
        if (this.post.container.parent_id === 0) {
            this.contacts = [];
            return;
        }
        this.subscriptions.add(this.ContactgroupsService.getContactsByContainerId(this.post.container.parent_id)
            .subscribe((result: GetContactsByContainerIdRootContact[]) => {
                this.contacts = result;
            }))
    }


    public onContainerChange(): void {
        if (this.post.container.parent_id === 0) {
            this.contacts = [];
            return;
        }
        this.loadContacts();
    }
}

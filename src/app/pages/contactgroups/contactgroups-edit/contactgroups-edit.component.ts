import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  NavComponent,
  NavItemComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';

import { NgForOf, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { ContactgroupsService } from '../contactgroups.service';
import {
    ContactgroupEditPostContactgroup,
    ContactgroupsEditRoot,
    LoadContainersRoot
} from '../contactgroups.interface';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { HistoryService } from '../../../history.service';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';

@Component({
    selector: 'oitc-contactgroups-edit',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormControlDirective,
    FormDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    NavComponent,
    NavItemComponent,
    NgForOf,
    NgIf,
    NgSelectModule,
    PermissionDirective,
    RequiredIconComponent,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    ObjectUuidComponent,
    FormLoaderComponent,
    MultiSelectComponent
],
    templateUrl: './contactgroups-edit.component.html',
    styleUrl: './contactgroups-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactgroupsEditComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();
    private readonly ContactgroupsService: ContactgroupsService = inject(ContactgroupsService);
    protected contacts: SelectKeyValue[] = [];
    private router: Router = inject(Router);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError = {} as GenericValidationError;

    public post!: ContactgroupEditPostContactgroup;
    protected containers: SelectKeyValue[] = [];
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

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
                this.cdr.markForCheck();
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public updateContactgroup(): void {

        this.subscriptions.add(this.ContactgroupsService.updateContactgroup(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Contactgroup');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['contactgroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/contactgroups/index']);

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
        this.subscriptions.add(this.ContactgroupsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
    }

    private loadContacts() {
        if (this.post.container.parent_id === 0) {
            this.contacts = [];
            this.cdr.markForCheck();
            return;
        }
        this.subscriptions.add(this.ContactgroupsService.getContactsByContainerId(this.post.container.parent_id)
            .subscribe((result: SelectKeyValue[]) => {
                this.contacts = result;
                this.cdr.markForCheck();
            }))
    }


    public onContainerChange(): void {
        if (this.post.container.parent_id === 0) {
            this.contacts = [];
            this.cdr.markForCheck();
            return;
        }
        this.loadContacts();
    }
}

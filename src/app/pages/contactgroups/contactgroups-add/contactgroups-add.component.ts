import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  FormCheckInputDirective,
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

import { NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';

import { ContactgroupsService } from '../contactgroups.service';
import { ContactgroupAddPostContactgroup, LoadContainersRoot } from '../contactgroups.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { HistoryService } from '../../../history.service';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';

@Component({
    selector: 'oitc-contactgroups-add',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    NavComponent,
    NavItemComponent,
    NgIf,
    NgSelectModule,
    PermissionDirective,
    RequiredIconComponent,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    MultiSelectComponent,
    SelectComponent
],
    templateUrl: './contactgroups-add.component.html',
    styleUrl: './contactgroups-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactgroupsAddComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();
    private ContactgroupsService: ContactgroupsService = inject(ContactgroupsService);
    protected contacts: SelectKeyValue[] = [];
    private router: Router = inject(Router);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError | null = null;
    public createAnother: boolean = false;

    public post: ContactgroupAddPostContactgroup = {} as ContactgroupAddPostContactgroup;
    protected containers: SelectKeyValue[] = [];
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.post = this.getDefaultPost();
        this.cdr.markForCheck();
    }

    public ngOnInit() {
        //First, load shit into the component.
        this.loadContainers();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public addContactgroup(): void {

        this.subscriptions.add(this.ContactgroupsService.add(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Contactgroup');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    const url: (string | number)[] = ['contactgroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/contactgroups/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.errors = null;
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();

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

    private getDefaultPost(): ContactgroupAddPostContactgroup {
        return {
            contacts: {
                _ids: []
            },
            container: {
                name: '',
                parent_id: 0
            },
            description: '',
        }
    }

    private loadContacts() {
        if (!this.post.container.parent_id) {
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
        if (!this.post.container.parent_id) {
            this.contacts = [];
            this.cdr.markForCheck();
            return;
        }
        this.loadContacts();
    }
}

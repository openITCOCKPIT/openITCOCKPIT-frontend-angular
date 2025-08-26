import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ContainersLoadContainersByStringParams } from '../../../../../pages/containers/containers.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { Router, RouterLink } from '@angular/router';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { MailinglistsService } from '../mailinglists.service';
import { ROOT_CONTAINER } from '../../../../../pages/changelogs/object-types.enum';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { HistoryService } from '../../../../../history.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
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
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { MailinglistPost } from '../mailinglists.interface';


@Component({
    selector: 'oitc-mailinglists-add',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
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
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        CardFooterComponent,
        FormCheckInputDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe
    ],
    templateUrl: './mailinglists-add.component.html',
    styleUrl: './mailinglists-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailinglistsAddComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly ContainersService = inject(ContainersService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    public post = this.getClearForm();
    public createAnother: boolean = false;
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private MailinglistsService = inject(MailinglistsService);
    public containers: SelectKeyValue[] = [];

    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
    private router: Router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    public errors: GenericValidationError | null = null;
    public recipientErrors: { [key: number]: GenericValidationError } = {};

    public ngOnInit(): void {
        this.loadContainers();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    public getClearForm(): MailinglistPost {
        return {
            container_id: null,
            name: '',
            description: '',
            department: '',
            mailinglist_recipients: []
        }
    }

    public removeRecipient(index: number): void {
        // instead of splice, array filter returns a new array and does not mutate the source array which will trigger
        // the Angular change detection
        this.post.mailinglist_recipients = this.post.mailinglist_recipients.filter((_, i) => i !== index);

        // Reset any errors as if a recipient is removed, the errors index will be off
        this.recipientErrors = {};

        this.cdr.markForCheck();
    }

    public addRecipient() {
        this.post.mailinglist_recipients.push({
            name: '',
            email: ''
        });
    }

    public submit() {
        this.subscriptions.add(this.MailinglistsService.createMailinglist(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Mailing list');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['scm_module', 'mailinglists', 'edit', response.id];
                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/scm_module/mailinglists/index']);
                        this.notyService.scrollContentDivToTop();
                        return;
                    }

                    this.post = this.getClearForm();
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();
                    this.errors = null;
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;

                    this.recipientErrors = {};
                    if (errorResponse.hasOwnProperty('mailinglist_recipients')) {
                        for (let i in errorResponse['mailinglist_recipients']) {
                            const k = Number(i);
                            this.recipientErrors[k] = (errorResponse['mailinglist_recipients'][i] as any as GenericValidationError);
                        }
                    }

                }
            }));

    }
}

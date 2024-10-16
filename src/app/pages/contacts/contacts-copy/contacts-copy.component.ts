import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective,
    NavComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactCopyPost } from '../contacts.interface';
import { GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ContactsService } from '../contacts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-contacts-copy',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,

        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NavComponent,
        NgForOf,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormsModule,
        FormLoaderComponent,
        NgIf
    ],
    templateUrl: './contacts-copy.component.html',
    styleUrl: './contacts-copy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsCopyComponent implements OnInit, OnDestroy {
    public contacts: ContactCopyPost[] = [];
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription()
    private ContactsService: ContactsService = inject(ContactsService);
    private readonly notyService: NotyService = inject(NotyService);
    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);
        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'contacts', 'index']);
            return;
        }

        this.subscriptions.add(this.ContactsService.getContactsCopy(ids).subscribe(contacts => {
            for (let contact of contacts) {
                this.contacts.push(<ContactCopyPost>{
                    Source: {
                        id: contact.Contact.id,
                        name: contact.Contact.name,
                    },

                    Contact: {
                        name: contact.Contact.name,
                        description: contact.Contact.description,
                        email: contact.Contact.email,
                        phone: contact.Contact.phone
                    },
                    Error: null
                })
            }
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe()
    }

    protected copyContacts() {
        this.subscriptions.add(
            this.ContactsService.saveContactsCopy(this.contacts).subscribe({
                next: (value: any) => {
                    this.notyService.genericSuccess();
                    this.HistoryService.navigateWithFallback(['/', 'contacts', 'index']);
                },
                error: (error: HttpErrorResponse) => {
                    this.notyService.genericError();
                    this.contacts = error.error.result as ContactCopyPost[];
                    this.cdr.markForCheck();
                }
            })
        );
    }
}

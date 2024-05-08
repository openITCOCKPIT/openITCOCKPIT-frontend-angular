import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ContainerComponent, NavComponent, TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommandUsedByCommand, CommandUsedByObjects } from '../../commands/commands.interface';
import { ContactUsedByContact, ContactUsedByObjects } from '../contacts.interface';
import { ContactsService } from '../contacts.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'oitc-contacts-used-by',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ContainerComponent,
        CoreuiComponent,
        FaIconComponent,
        NavComponent,
        NgForOf,
        NgIf,
        PermissionDirective,
        TableDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink
    ],
    templateUrl: './contacts-used-by.component.html',
    styleUrl: './contacts-used-by.component.css'
})
export class ContactsUsedByComponent implements OnInit, OnDestroy {
    public contact?: ContactUsedByContact | null;
    public total: number = 0;
    public objects: ContactUsedByObjects | undefined;

    private ContactsService = inject(ContactsService);


    private router = inject(Router);
    private route = inject(ActivatedRoute)

    private subscriptions: Subscription = new Subscription();

    public ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.ContactsService.usedBy(id)
            .subscribe((result) => {
                this.contact = result.contact;
                this.objects = result.objects;
                this.total = result.total;
            }));
    }


    public ngOnDestroy() {
        this.subscriptions.unsubscribe()

    }

}

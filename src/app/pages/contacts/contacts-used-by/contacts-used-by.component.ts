import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ContainerComponent,
    NavComponent,
    NavItemComponent,
    TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactUsedByContact, ContactUsedByObjects } from '../contacts.interface';
import { ContactsService } from '../contacts.service';
import { Subscription } from 'rxjs';
import { NotUsedByObjectComponent } from '../../../layouts/coreui/not-used-by-object/not-used-by-object.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';

@Component({
    selector: 'oitc-contacts-used-by',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ContainerComponent,
        FaIconComponent,
        NavComponent,
        NgForOf,
        NgIf,
        PermissionDirective,
        TableDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FaStackComponent,
        FaStackItemSizeDirective,
        NotUsedByObjectComponent,
        NavItemComponent,
        TableLoaderComponent,
        FormLoaderComponent
    ],
    templateUrl: './contacts-used-by.component.html',
    styleUrl: './contacts-used-by.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsUsedByComponent implements OnInit, OnDestroy {
    public contact?: ContactUsedByContact | null;
    public total: number = 0;
    public objects: ContactUsedByObjects | undefined;
    private ContactsService = inject(ContactsService);
    private route = inject(ActivatedRoute);

    private subscriptions: Subscription = new Subscription();
    private contactId: number = 0;
    protected containerIds: number[] = [];
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.contactId = Number(this.route.snapshot.paramMap.get('id'));
        this.containerIds = this.route.snapshot.queryParamMap.getAll('containerIds').map(Number);

        let myContainerIds = this.route.snapshot.paramMap.get('containerIds') as string;
        if (myContainerIds !== null) {
            this.containerIds = myContainerIds.split(',').map(Number);
        }
        this.cdr.markForCheck();
        this.load();
    }


    public ngOnDestroy() {
        this.subscriptions.unsubscribe()
    }

    public load() {
        this.subscriptions.add(this.ContactsService.usedBy(this.contactId)
            .subscribe((result) => {
                this.contact = result.contact;
                this.objects = result.objects;
                this.total = result.total;
                this.cdr.markForCheck();
            }));
    }

}

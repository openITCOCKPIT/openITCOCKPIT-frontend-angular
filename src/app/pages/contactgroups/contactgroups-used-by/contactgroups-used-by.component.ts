import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import {
    ContactgroupsUsedByRoot,
    ContactgroupsUsedByRootContainer,
    ContactgroupUsedByObjects
} from '../contactgroups.interface';
import { ContactUsedByObjects } from '../../contacts/contacts.interface';
import { ContactgroupsService } from '../contactgroups.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'oitc-contactgroups-used-by',
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
  templateUrl: './contactgroups-used-by.component.html',
  styleUrl: './contactgroups-used-by.component.css'
})
export class ContactgroupsUsedByComponent implements OnInit, OnDestroy{
    public contactgroup?: ContactgroupsUsedByRootContainer | null;
    public total: number = 0;
    public objects: ContactgroupUsedByObjects | undefined;

    private ContactgroupsService: ContactgroupsService = inject(ContactgroupsService);

    private router = inject(Router);
    private route = inject(ActivatedRoute)

    private subscriptions: Subscription = new Subscription();

    public ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.ContactgroupsService.usedBy(id)
            .subscribe((result: ContactgroupsUsedByRoot) => {
                this.contactgroup = {
                    name: result.contactgroupWithRelations.container.name
                }
                this.objects = result.contactgroupWithRelations;
                this.total = result.total;
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe()

    }

}

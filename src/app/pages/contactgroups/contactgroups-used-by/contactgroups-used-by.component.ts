import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { ContactgroupsService } from '../contactgroups.service';
import { Subscription } from 'rxjs';
import { NotUsedByObjectComponent } from '../../../layouts/coreui/not-used-by-object/not-used-by-object.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';

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
        RouterLink,
        NavItemComponent,
        NotUsedByObjectComponent,
        TableLoaderComponent,
        FormLoaderComponent
    ],
    templateUrl: './contactgroups-used-by.component.html',
    styleUrl: './contactgroups-used-by.component.css'
})
export class ContactgroupsUsedByComponent implements OnInit, OnDestroy {
    public contactgroup?: ContactgroupsUsedByRootContainer | null;
    public total: number = 0;
    public objects: ContactgroupUsedByObjects | undefined;

    private ContactgroupsService: ContactgroupsService = inject(ContactgroupsService);

    private router = inject(Router);
    private route = inject(ActivatedRoute)
    private contactgroupId: number = 0;

    private subscriptions: Subscription = new Subscription();

    public ngOnInit() {
        this.contactgroupId = Number(this.route.snapshot.paramMap.get('id'));
        this.load();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe()
    }

    public load() {
        this.subscriptions.add(this.ContactgroupsService.usedBy(this.contactgroupId)
            .subscribe((result: ContactgroupsUsedByRoot) => {
                this.contactgroup = {
                    name: result.contactgroupWithRelations.container.name
                }
                this.objects = result.contactgroupWithRelations;
                this.total = result.total;
            }));
    }

}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective } from '@jsverse/transloco';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ResourcegroupsService } from '../resourcegroups.service';
import { ResourcegroupWithRelations } from '../resourcegroups.interface';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';

@Component({
    selector: 'oitc-resourcegroups-used-by',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        TranslocoDirective,
        RouterLink,
        NgIf,
        NavItemComponent,
        ContainerComponent,
        NgForOf,
        TableDirective,
        AsyncPipe,
        BackButtonDirective,
        FormLoaderComponent,
        PermissionDirective,
        XsButtonDirective,
        NoRecordsComponent
    ],
    templateUrl: './resourcegroups-used-by.component.html',
    styleUrl: './resourcegroups-used-by.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcegroupsUsedByComponent implements OnInit, OnDestroy {

    public resourcegroupWithRelations!: ResourcegroupWithRelations;
    public total: number = 0;

    private resourcegroupId: number = 0;
    private subscriptions: Subscription = new Subscription();
    private ResourcegroupsService = inject(ResourcegroupsService);
    protected PermissionsService = inject(PermissionsService);

    private route = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.resourcegroupId = Number(this.route.snapshot.paramMap.get('id'));
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.subscriptions.add(this.ResourcegroupsService.usedBy(this.resourcegroupId)
            .subscribe((result) => {
                this.resourcegroupWithRelations = result;
                this.total = this.resourcegroupWithRelations.resources.length;
                this.cdr.markForCheck();
            }));
    }
}

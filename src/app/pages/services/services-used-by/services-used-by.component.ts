import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NotUsedByObjectComponent } from '../../../layouts/coreui/not-used-by-object/not-used-by-object.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServicesService } from '../services.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { ServiceEntity, ServiceUsedByObjects } from '../services.interface';

@Component({
    selector: 'oitc-services-used-by',
    imports: [
    AsyncPipe,
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ContainerComponent,
    FaIconComponent,
    FormLoaderComponent,
    NavComponent,
    NavItemComponent,
    NotUsedByObjectComponent,
    PermissionDirective,
    TableDirective,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink
],
    templateUrl: './services-used-by.component.html',
    styleUrl: './services-used-by.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesUsedByComponent implements OnInit, OnDestroy {

    public service?: ServiceEntity;
    public total: number = 0;
    public objects?: ServiceUsedByObjects;

    private serviceId: number = 0;

    private ServicesService = inject(ServicesService);
    public PermissionsService = inject(PermissionsService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit(): void {
        this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
        this.load();
        this.cdr.markForCheck();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.subscriptions.add(this.ServicesService.usedBy(this.serviceId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.service = result.service;
                this.objects = result.objects;
                this.total = result.total;
            }));
    }

}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
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
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { NotUsedByObjectComponent } from '../../../layouts/coreui/not-used-by-object/not-used-by-object.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { Subscription } from 'rxjs';
import { HostEntity, HostUsedByObjects } from '../hosts.interface';
import { HostsService } from '../hosts.service';
import { PermissionsService } from '../../../permissions/permissions.service';

@Component({
    selector: 'oitc-hosts-used-by',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ContainerComponent,

        FaIconComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NotUsedByObjectComponent,
        PermissionDirective,
        TableDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        TableLoaderComponent,
        FormLoaderComponent,
        AsyncPipe
    ],
    templateUrl: './hosts-used-by.component.html',
    styleUrl: './hosts-used-by.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsUsedByComponent {

    public host?: HostEntity;
    public total: number = 0;
    public objects?: HostUsedByObjects;

    private hostId: number = 0;

    private HostsService = inject(HostsService);
    public PermissionsService = inject(PermissionsService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.hostId = Number(this.route.snapshot.paramMap.get('id'));
        this.load();
        this.cdr.markForCheck();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.subscriptions.add(this.HostsService.usedBy(this.hostId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.host = result.host;
                this.objects = result.objects;
                this.total = result.total;
            }));
    }

}

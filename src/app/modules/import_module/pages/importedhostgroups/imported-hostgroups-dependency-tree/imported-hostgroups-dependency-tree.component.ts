import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../../../layouts/coreui/coreui.component';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { NgIf } from '@angular/common';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { Subscription } from 'rxjs';
import { DependencyTreeComponent } from '../../../components/dependency-tree/dependency-tree.component';
import { ImportedhostgroupsService } from '../importedhostgroups.service';
import { Importedhostgroup } from '../importedhostgroups.interface';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    OnlineOfflineComponent
} from '../../../components/additional-host-information/online-offline/online-offline.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';


@Component({
    selector: 'oitc-imported-hostgroups-dependency-tree',
    standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective,
        CardComponent,
        CardHeaderComponent,
        NgIf,
        TableLoaderComponent,
        FormLoaderComponent,
        BlockLoaderComponent,
        CardBodyComponent,
        DependencyTreeComponent,
        CardTitleDirective,
        BackButtonDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        ColComponent,
        OnlineOfflineComponent,
        RowComponent,
        PermissionDirective,
        RouterLink
    ],
    templateUrl: './imported-hostgroups-dependency-tree.component.html',
    styleUrl: './imported-hostgroups-dependency-tree.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportedHostgroupsDependencyTreeComponent implements OnInit, OnDestroy {
    private readonly ImportedhostgroupsService = inject(ImportedhostgroupsService);

    protected hostgroupId: number = 0;
    public importedHostgroup!: Importedhostgroup;
    private route = inject(ActivatedRoute);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly subscriptions: Subscription = new Subscription();
    public isConnected: boolean = false;
    private cdr = inject(ChangeDetectorRef);

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngOnInit(): void {
        // Fetch the id from the URL
        this.hostgroupId = Number(this.route.snapshot.paramMap.get('id'));
        // Load additional information
        this.load();
    }

    private load(): void {
        this.subscriptions.add(this.ImportedhostgroupsService.getDependencyTree(this.hostgroupId)
            .subscribe((result: Importedhostgroup) => {
                this.importedHostgroup = result;
                this.cdr.markForCheck();
            }));
    }

    public onExternalSystemConnected($event: boolean) {
        this.isConnected = $event;
    }
}

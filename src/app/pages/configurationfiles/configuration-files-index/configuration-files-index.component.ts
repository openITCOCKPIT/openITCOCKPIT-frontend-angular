import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfigurationFilesService } from '../configuration-files.service';
import { ConfigurationFilesIndexRoot } from '../configuration-files.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { AsyncPipe } from '@angular/common';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { PermissionsService } from '../../../permissions/permissions.service';

@Component({
    selector: 'oitc-configuration-files-index',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        TableLoaderComponent,
        TableDirective,
        NoRecordsComponent,
        CardFooterComponent,
        ProgressBarModule,
        RowComponent,
        ColComponent,
        AsyncPipe
    ],
    templateUrl: './configuration-files-index.component.html',
    styleUrl: './configuration-files-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationFilesIndexComponent implements OnInit, OnDestroy {

    public configFileCategories?: ConfigurationFilesIndexRoot;
    public IS_CONTAINER: boolean = false;

    private subscriptions: Subscription = new Subscription();
    private readonly ConfigurationFilesService = inject(ConfigurationFilesService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.loadConfigurationFiles();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadConfigurationFiles(): void {
        this.subscriptions.add(
            this.ConfigurationFilesService.getIndex().subscribe((result) => {
                this.configFileCategories = result;
                this.IS_CONTAINER = result.IS_CONTAINER;
                this.cdr.markForCheck();
            })
        );
    }

}

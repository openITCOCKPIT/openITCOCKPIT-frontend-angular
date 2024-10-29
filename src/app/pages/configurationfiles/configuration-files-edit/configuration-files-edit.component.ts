import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfigurationFilesService } from '../configuration-files.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { ConfigurationFilesDbKeys } from '../configuration-files.enum';
import {
    AlertComponent,
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckInputDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    NavComponent,
    NavItemComponent,
    ProgressComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ConfigurationFileInformation } from '../configuration-files.interface';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NgForOf, NgIf } from '@angular/common';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { PaginatorModule } from 'primeng/paginator';

@Component({
    selector: 'oitc-configuration-files-edit',
    standalone: true,
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormLoaderComponent,
        NgIf,
        BackButtonDirective,
        ButtonCloseDirective,
        ColComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgForOf,
        ProgressComponent,
        RowComponent,
        CardBodyComponent,
        CardFooterComponent,
        FormCheckInputDirective,
        PaginatorModule,
        AlertComponent
    ],
    templateUrl: './configuration-files-edit.component.html',
    styleUrl: './configuration-files-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationFilesEditComponent implements OnInit, OnDestroy {

    public dbKey?: ConfigurationFilesDbKeys;
    public ConfigFile?: ConfigurationFileInformation;

    public isRestoring: boolean = false;

    private subscriptions: Subscription = new Subscription();
    private readonly ConfigurationFilesService = inject(ConfigurationFilesService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly route = inject(ActivatedRoute);
    private readonly modalService = inject(ModalService);
    private readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            const dbKey = String(this.route.snapshot.paramMap.get('dbKey'));
            this.dbKey = dbKey as ConfigurationFilesDbKeys;
            this.loadConfigurationFile();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadConfigurationFile(): void {
        if (this.dbKey) {
            this.subscriptions.add(this.ConfigurationFilesService.getConfigFileForEdit(this.dbKey).subscribe(data => {
                this.ConfigFile = data;
                this.cdr.markForCheck();
            }));
        }
    }

    public onRestoreDefault(): void {
        this.cdr.markForCheck();
        this.modalService.toggle({
            show: true,
            id: 'angularConfirmRestoreDefault'
        });
    }

    public submit(): void {
        // todo
        console.log('implement submit');
    }

    // Modal functions
    public hideModal(): void {
        this.cdr.markForCheck();
        this.modalService.toggle({
            show: false,
            id: 'angularConfirmRestoreDefault'
        });
    }

    public restore() {
        this.isRestoring = true;

        // todo
        console.log('implement restore default via Signal or so??');
    }

    protected readonly ConfigurationFilesDbKeys = ConfigurationFilesDbKeys;
}

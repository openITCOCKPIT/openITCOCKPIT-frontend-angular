import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
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
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ConfigurationFileInformation } from '../configuration-files.interface';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NgForOf, NgIf } from '@angular/common';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { PaginatorModule } from 'primeng/paginator';
import {
    DynamicConfigurationFileComponent
} from './configuration-files/dynamic-configuration-file/dynamic-configuration-file.component';
import { NotyService } from '../../../layouts/coreui/noty.service';
import {
    ConfigurationFileDbBackendComponent
} from './configuration-files/static/configuration-file-db-backend/configuration-file-db-backend.component';
import {
    ConfigurationFilePerfdataBackendComponent
} from './configuration-files/static/configuration-file-perfdata-backend/configuration-file-perfdata-backend.component';
import {
    ConfigurationFileNagiosCfgComponent
} from './configuration-files/static/configuration-file-nagios-cfg/configuration-file-nagios-cfg.component';
import {
    ConfigurationFileModGearmanModuleComponent
} from './configuration-files/static/configuration-file-mod-gearman-module/configuration-file-mod-gearman-module.component';
import {
    ConfigurationFileNstaMasterComponent
} from './configuration-files/static/configuration-file-nsta-master/configuration-file-nsta-master.component';
import {
    ConfigurationFileGraphingDockerComponent
} from './configuration-files/static/configuration-file-graphing-docker/configuration-file-graphing-docker.component';

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
        AlertComponent,
        DynamicConfigurationFileComponent,
        ConfigurationFileDbBackendComponent,
        ConfigurationFilePerfdataBackendComponent,
        ConfigurationFileNagiosCfgComponent,
        ConfigurationFileModGearmanModuleComponent,
        ConfigurationFileNstaMasterComponent,
        ConfigurationFileGraphingDockerComponent
    ],
    templateUrl: './configuration-files-edit.component.html',
    styleUrl: './configuration-files-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationFilesEditComponent implements OnInit, OnDestroy {

    public dbKey?: ConfigurationFilesDbKeys;
    public ConfigFile?: ConfigurationFileInformation;

    public isRestoring: boolean = false;

    // The submit button is in this component, but each configuration file has its own child component.
    // The submit action is implemented in the child component.
    // The child will subscribe to this observable to know when to submit.
    private readonly submit$$: Subject<void> = new Subject<void>();
    public readonly submit$ = this.submit$$.asObservable();

    private subscriptions: Subscription = new Subscription();
    private readonly ConfigurationFilesService = inject(ConfigurationFilesService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly route = inject(ActivatedRoute);
    private readonly modalService = inject(ModalService);
    private readonly notyService = inject(NotyService);
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
        // We do not submit the form by our self. The child component will do this.
        // We just tell the child component that submit was clicked.
        this.submit$$.next();
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
        if (this.dbKey && this.ConfigFile) {
            this.ConfigurationFilesService.restoreDefault(this.dbKey, this.ConfigFile.moduleUrl).subscribe((response) => {
                this.cdr.markForCheck();
                this.isRestoring = false;

                if (response.success) {
                    this.notyService.genericSuccess(this.TranslocoService.translate('Config successfully restored to default'));
                    this.hideModal();
                    this.router.navigate(['/', 'ConfigurationFiles', 'index']);
                    return;
                }

                this.notyService.genericError();
                return;

            });
        }
    }

    protected readonly ConfigurationFilesDbKeys = ConfigurationFilesDbKeys;
}

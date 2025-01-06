import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    OnDestroy,
    OnInit
} from '@angular/core';
import { ConfigurationFilesDbKeys, ConfigurationFilesFieldTypes } from '../../../../configuration-files.enum';
import { Observable, Subscription } from 'rxjs';
import { GenericValidationError } from '../../../../../../generic-responses';
import { ConfigurationEditorConfig, ConfigurationEditorField } from '../../../../configuration-files.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NotyService } from '../../../../../../layouts/coreui/noty.service';
import { ConfigurationFilesService } from '../../../../configuration-files.service';
import { FormControlDirective, FormLabelDirective, FormSelectDirective } from '@coreui/angular';
import { FormErrorDirective } from '../../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../../../../../../components/required-icon/required-icon.component';
import { NgIf } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-configuration-file-db-backend',
    imports: [
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        PaginatorModule,
        RequiredIconComponent,
        NgIf,
        FormSelectDirective,
        TranslocoDirective,
        FormsModule
    ],
    templateUrl: './configuration-file-db-backend.component.html',
    styleUrl: './configuration-file-db-backend.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationFileDbBackendComponent implements OnInit, OnDestroy {

    public dbKey = input.required<ConfigurationFilesDbKeys>();
    public submit$ = input.required<Observable<void>>();

    public errors: GenericValidationError | null = null;
    public fields: ConfigurationEditorField[] = [];

    /**
     * The server returns the current configuration.
     * Instead of dealing with the configuration object directly, we use the "fields" array which provides the
     * configuration in an Angular friendly way.
     *
     * However, when we submit the new configuration, we have to copy the values from "fields" back into "config".
     *
     * @public
     */
    public config?: ConfigurationEditorConfig;

    private subscriptions: Subscription = new Subscription();
    private readonly ConfigurationFilesService = inject(ConfigurationFilesService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            this.loadConfigFile();
        });
    }

    public ngOnInit(): void {
        const submit$ = this.submit$();

        this.subscriptions.add(submit$.subscribe(() => {
            this.submit();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadConfigFile(): void {
        const dbKey = this.dbKey()
        if (dbKey) {
            this.subscriptions.add(this.ConfigurationFilesService.getConfigFileForEditor(dbKey, null).subscribe((result) => {
                this.cdr.markForCheck();
                this.config = result.config;
                this.fields = result.fields;
            }));

        }
    }

    private submit() {
        if (this.config && this.fields) {

            // Copy the values from the fields array back into the config object.
            for (const field of this.fields) {
                const fieldName = field.field;

                if (this.config[field.type]) {
                    if (this.config[field.type]?.hasOwnProperty(fieldName)) {
                        //@ts-ignore
                        this.config[field.type][fieldName] = field.value;
                    }
                }
            }

            this.subscriptions.add(this.ConfigurationFilesService.saveConfigFileFromEditor(this.dbKey(), null, this.config)
                .subscribe((result) => {
                    this.cdr.markForCheck();

                    if (result.success) {
                        this.notyService.genericSuccess();
                        this.router.navigate(['/', 'ConfigurationFiles', 'index']);

                        return;
                    }

                    // Error
                    const errorResponse = result.data as GenericValidationError;
                    this.notyService.genericError();
                    if (result) {
                        this.errors = errorResponse;
                    }
                }));
        }

    }

    protected readonly ConfigurationFilesFieldTypes = ConfigurationFilesFieldTypes;
}

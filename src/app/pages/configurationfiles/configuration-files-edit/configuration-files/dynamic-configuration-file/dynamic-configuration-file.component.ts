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
import { Observable, Subscription } from 'rxjs';
import { ConfigurationFilesDbKeys, ConfigurationFilesFieldTypes } from '../../../configuration-files.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationFilesService } from '../../../configuration-files.service';
import {
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective
} from '@coreui/angular';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { ConfigurationEditorConfig, ConfigurationEditorField } from '../../../configuration-files.interface';
import { NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { GenericValidationError } from '../../../../../generic-responses';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { FormsModule } from '@angular/forms';

/**
 * This component will just loop through all configuration fields and will create an input according to the field type.
 * A "string" will be an <input type="text"> and "bool" will become a checkbox for example.
 *
 * If you need to build a complex form with select elements or enable / disable different parts of the form depending on
 * the value of another field, you should create a new component for that configuration file.
 */
@Component({
    selector: 'oitc-dynamic-configuration-file',
    imports: [
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        PaginatorModule,
        RequiredIconComponent,
        NgIf,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        PermissionDirective,
        TrueFalseDirective,
        FormsModule
    ],
    templateUrl: './dynamic-configuration-file.component.html',
    styleUrl: './dynamic-configuration-file.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicConfigurationFileComponent implements OnInit, OnDestroy {

    public dbKey = input.required<ConfigurationFilesDbKeys>();
    public moduleUrl = input.required<null | string>();
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
     * @private
     */
    private config?: ConfigurationEditorConfig;

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
            this.subscriptions.add(this.ConfigurationFilesService.getConfigFileForEditor(dbKey, this.moduleUrl()).subscribe((result) => {
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

            this.subscriptions.add(this.ConfigurationFilesService.saveConfigFileFromEditor(this.dbKey(), this.moduleUrl(), this.config)
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

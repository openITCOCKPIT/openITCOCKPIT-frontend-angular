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
import {
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective
} from '@coreui/angular';
import { FormErrorDirective } from '../../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../../../../../../components/required-icon/required-icon.component';

import { TranslocoDirective } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../../../../directives/true-false.directive';
import { UserTimezonesSelect } from '../../../../../users/users.interface';
import { UsersService } from '../../../../../users/users.service';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { TimezoneConfiguration, TimezoneService } from '../../../../../../services/timezone.service';
import { FormsModule } from '@angular/forms';

// This view defines each input manually to keep an order that makes sense for the user.
// To not have to work against TypeScript, we define all possible fields in the interface.
export interface GraphingDockerConfig extends ConfigurationEditorConfig {
    [ConfigurationFilesFieldTypes.string]: {
        carbon_path: string
        carbon_storage_schema: string
        timezone: string
        USE_AUTO_NETWORKING: string
        docker_compose_subnet: string
        victoria_metrics_storage_path: string
    }
    [ConfigurationFilesFieldTypes.int]: {
        number_of_carbon_cache_instances: number
        number_of_carbon_c_relay_workers: number
        local_graphite_http_port: number
        local_graphite_plaintext_port: number
        victoria_metrics_retention_period: number
        local_victoria_metrics_http_port: number
    }
    [ConfigurationFilesFieldTypes.float]: {
        default_average_x_files_factor: number

    }
    [ConfigurationFilesFieldTypes.bool]: {
        WHISPER_FALLOCATE_CREATE: number
        enable_docker_userland_proxy: number
    }
}

@Component({
    selector: 'oitc-configuration-file-graphing-docker',
    imports: [
    FormControlDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    PaginatorModule,
    RequiredIconComponent,
    FormSelectDirective,
    TranslocoDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    TrueFalseDirective,
    NgOptionTemplateDirective,
    NgSelectComponent,
    NgOptionHighlightDirective,
    FormsModule
],
    templateUrl: './configuration-file-graphing-docker.component.html',
    styleUrl: './configuration-file-graphing-docker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationFileGraphingDockerComponent implements OnInit, OnDestroy {

    public dbKey = input.required<ConfigurationFilesDbKeys>();
    public submit$ = input.required<Observable<void>>();

    public timezones: UserTimezonesSelect[] = [];
    public serverTimezone: TimezoneConfiguration | null = null;

    public errors: GenericValidationError | null = null;
    public fields: ConfigurationEditorField[] = []; // Not used!

    public fieldInfo: { [key: string]: { field: string, help: string, placeholder: string | number } } = {};

    /**
     * The server returns the current configuration.
     * Due to the view defines every field manually, we don't need to use the "fields" array in this case.
     *
     * THIS VIEW PATCHES DIRECTLY THE CONFIGURATION OBJECT !
     *
     * @public
     */
    public config?: GraphingDockerConfig;

    private subscriptions: Subscription = new Subscription();
    private readonly ConfigurationFilesService = inject(ConfigurationFilesService);
    private readonly UsersService = inject(UsersService);
    private readonly TimezoneService = inject(TimezoneService);
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

        this.loadTimezones();

        this.subscriptions.add(submit$.subscribe(() => {
            this.submit();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadTimezones(): void {
        this.subscriptions.add(this.UsersService.getDateformats().subscribe(data => {
            this.timezones = data.timezones;
            this.cdr.markForCheck();
        }));

        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.serverTimezone = data;
            this.cdr.markForCheck();
        }));
    }

    public loadConfigFile(): void {
        const dbKey = this.dbKey()
        if (dbKey) {
            this.subscriptions.add(this.ConfigurationFilesService.getConfigFileForEditor(dbKey, null).subscribe((result) => {
                this.cdr.markForCheck();
                this.config = result.config as GraphingDockerConfig;

                result.fields.forEach((field) => {
                    this.fieldInfo[field.field] = {
                        field: field.field,
                        help: field.help,
                        placeholder: field.placeholder
                    }
                });
            }));

        }
    }

    private submit() {
        if (this.config) {
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

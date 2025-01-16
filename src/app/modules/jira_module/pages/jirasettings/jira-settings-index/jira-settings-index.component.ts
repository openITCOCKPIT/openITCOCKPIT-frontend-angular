import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { ApikeyDocModalComponent } from '../../../../../layouts/coreui/apikey-doc-modal/apikey-doc-modal.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent
} from '@coreui/angular';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { JiraSettingsPost, LoadJiraProjectParams } from '../jira-settings.interface';
import { GenericValidationError } from '../../../../../generic-responses';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { JiraType } from '../jira.enums';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { Subscription } from 'rxjs';
import { JiraSettingsService } from '../jira-settings.service';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NotyService } from '../../../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-jira-settings-index',
    imports: [
        FaIconComponent,
        FormLoaderComponent,
        NgIf,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        ApikeyDocModalComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        RequiredIconComponent,
        XsButtonDirective,
        SelectComponent,
        MultiSelectComponent,
        InputGroupComponent
    ],
    templateUrl: './jira-settings-index.component.html',
    styleUrl: './jira-settings-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JiraSettingsIndexComponent implements OnInit, OnDestroy {

    private TranslocoService: TranslocoService = inject(TranslocoService);


    public post?: JiraSettingsPost;
    public errors: GenericValidationError | null = null;
    public webhook_url: string = '';
    public jiraProjectsForSelect: SelectKeyValueString[] = [];

    public isLoadingJiraProjects: boolean = false;
    public loadProjectsError: string | null = null;

    public jiraTypes: SelectKeyValueString[] = [
        {key: JiraType.Cloud, value: this.TranslocoService.translate('Jira Cloud')},
        {key: JiraType.DataCenter, value: 'Jira Data Center'}
    ];

    private subscriptions: Subscription = new Subscription();
    private readonly JiraSettingsService: JiraSettingsService = inject(JiraSettingsService);
    private readonly notyService: NotyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit(): void {

        this.subscriptions.add(
            this.JiraSettingsService.getJiraSettings().subscribe((settings: JiraSettingsPost): void => {
                    this.post = settings;

                    if (this.post.jira_url && this.post.api_key) {
                        this.loadJiraProjects();
                    }

                    this.cdr.markForCheck();
                }
            )
        );
        const API_KEY_TRANSLATION = this.TranslocoService.translate('YOUR_API_KEY_HERE');
        this.webhook_url = `https://${window.location.hostname}/jira_module/webhook/submit.json?apikey=${API_KEY_TRANSLATION}`;
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadJiraProjects(): void {
        if (!this.post) {
            return;
        }

        this.isLoadingJiraProjects = true;

        const params: LoadJiraProjectParams = {
            jira_url: this.post.jira_url,
            api_key: this.post.api_key,
            jira_type: this.post.jira_type,
            ignore_ssl_certificate: this.post.ignore_ssl_certificate,
            use_proxy: this.post.use_proxy
        };

        this.subscriptions.add(
            this.JiraSettingsService.loadProjects(params).subscribe((result): void => {
                    result.projects.forEach((project): void => {
                        this.jiraProjectsForSelect.push({key: project.key, value: project.value});
                    });

                    if (result.error) {
                        this.notyService.genericError(result.error);
                    }
                    this.loadProjectsError = result.error;


                    this.isLoadingJiraProjects = false;
                    this.cdr.markForCheck();
                }
            )
        );
    }

    public onJiraProjectsSelectChange = (event: any): void => {
  
    }

    public updateJiraSettings(): void {

    }

}

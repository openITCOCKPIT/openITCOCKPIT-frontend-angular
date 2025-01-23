import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { ApikeyDocModalComponent } from '../../../../../layouts/coreui/apikey-doc-modal/apikey-doc-modal.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTextDirective,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    RowComponent
} from '@coreui/angular';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { JiraProject, JiraSettingsPost, LoadJiraProjectParams, ProjectDetails } from '../jira-settings.interface';
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
        InputGroupComponent,
        RowComponent,
        ColComponent,
        NgForOf,
        CardTextDirective,
        TranslocoPipe
    ],
    templateUrl: './jira-settings-index.component.html',
    styleUrl: './jira-settings-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JiraSettingsIndexComponent implements OnInit, OnDestroy {

    private TranslocoService: TranslocoService = inject(TranslocoService);


    public post?: JiraSettingsPost;
    public errors: GenericValidationError | null = null;
    public webhook_url_acknowledgements: string = '';
    public webhook_url_closed: string = '';
    public selectedJiraProjects: string[] = [];
    public jiraProjectsForSelect: SelectKeyValueString[] = [];

    public isLoadingJiraProjects: boolean = false;
    public loadProjectsError: string | null = null;

    public jiraTypes: SelectKeyValueString[] = [
        {key: JiraType.Cloud, value: this.TranslocoService.translate('Jira Cloud')},
        {key: JiraType.DataCenter, value: 'Jira Data Center'}
    ];

    private projectKeyToIdMap: { [key: string]: string } = {};

    private subscriptions: Subscription = new Subscription();
    private readonly JiraSettingsService: JiraSettingsService = inject(JiraSettingsService);
    private readonly notyService: NotyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    public projectDetails: ProjectDetails = {};


    public ngOnInit(): void {

        this.subscriptions.add(
            this.JiraSettingsService.getJiraSettings().subscribe((settings: JiraSettingsPost): void => {
                    this.post = settings;

                    if (this.post.jira_url && this.post.api_key) {
                        this.loadJiraProjects();
                    }

                    if (this.post.jira_projects.length > 0) {
                        // The POST data from the server contains pre-selected projects
                        this.selectedJiraProjects = this.post.jira_projects.map((project): string => {
                            return project.project_key;
                        });

                        // Also load project details from Jira
                        const params: LoadJiraProjectParams = {
                            jira_url: this.post.jira_url,
                            api_key: this.post.api_key,
                            jira_type: this.post.jira_type,
                            ignore_ssl_certificate: this.post.ignore_ssl_certificate,
                            use_proxy: this.post.use_proxy
                        };

                        for (const i in this.post.jira_projects) {
                            this.projectDetails[this.post.jira_projects[i].project_key] = {
                                issueTypes: []
                            };


                            this.subscriptions.add(
                                this.JiraSettingsService.loadProjectDetails(params, this.post.jira_projects[i].project_key).subscribe((result): void => {
                                    if (this.post && this.post.jira_projects[i]) {
                                        this.projectDetails[this.post.jira_projects[i].project_key]['issueTypes'] = result.details.issueTypes;
                                        this.cdr.markForCheck();
                                    }
                                })
                            );
                        }
                    }

                    this.cdr.markForCheck();
                }
            )
        );
        const API_KEY_TRANSLATION = this.TranslocoService.translate('YOUR_API_KEY_HERE');
        this.webhook_url_acknowledgements = `https://${window.location.hostname}/jira_module/webhooks/acknowledge.json?apikey=${API_KEY_TRANSLATION}`;
        this.webhook_url_closed = `https://${window.location.hostname}/jira_module/webhooks/close.json?apikey=${API_KEY_TRANSLATION}`;
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
                    this.jiraProjectsForSelect = [];
                    this.projectKeyToIdMap = {};

                    result.projects.forEach((project): void => {
                        this.jiraProjectsForSelect.push({
                            key: project.key,           // PX
                            value: project.value        // Project X (PX)
                        });

                        this.projectKeyToIdMap[project.key] = project.id;
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
        if (this.post) {

            // Remove projects from post if they are not selected anymore
            for (const i in this.post.jira_projects) {
                const projectKey = this.post.jira_projects[i].project_key;
                console.log(this.selectedJiraProjects);
                if (!this.selectedJiraProjects.includes(projectKey)) {
                    // Project is not selected anymore - remove it
                    this.post.jira_projects.splice(parseInt(i), 1);
                }
            }

            // Add new selected projects to post
            for (const projectKey of this.selectedJiraProjects) {
                let existsInPost: boolean = false;

                for (const i in this.post.jira_projects) {
                    if (this.post.jira_projects[i].project_key === projectKey) {
                        existsInPost = true;
                        break;
                    }
                }

                if (!existsInPost) {
                    // Project is not in post - add it
                    // Find ID for project key
                    if (this.projectKeyToIdMap[projectKey]) {
                        this.post.jira_projects.push(this.getProjectSkeleton(projectKey, this.projectKeyToIdMap[projectKey]));
                    }
                }
            }

            if (this.post.jira_projects.length > 0) {
                const params: LoadJiraProjectParams = {
                    jira_url: this.post.jira_url,
                    api_key: this.post.api_key,
                    jira_type: this.post.jira_type,
                    ignore_ssl_certificate: this.post.ignore_ssl_certificate,
                    use_proxy: this.post.use_proxy
                };

                for (const i in this.post.jira_projects) {
                    this.projectDetails[this.post.jira_projects[i].project_key] = {
                        issueTypes: []
                    };


                    this.subscriptions.add(
                        this.JiraSettingsService.loadProjectDetails(params, this.post.jira_projects[i].project_key).subscribe((result): void => {
                            if (this.post && this.post.jira_projects[i]) {
                                this.projectDetails[this.post.jira_projects[i].project_key]['issueTypes'] = result.details.issueTypes;
                                this.cdr.markForCheck();
                            }
                        })
                    );
                }
            }

        }
    }

    public updateJiraSettings(): void {
        if (!this.post) {
            return;
        }

        this.subscriptions.add(this.JiraSettingsService.updateJiraSettings(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as JiraSettingsPost;
                    console.log(response);
                    this.errors = null;
                    this.notyService.genericSuccess();
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

    private getProjectSkeleton(projectKey: string, projectId: string): JiraProject {
        return {
            project_key: projectKey,
            project_id: projectId,
            is_default: false,
            issue_type_name: '',
            issue_type_id: '',
            close_transition_name: '',
            close_transition_id: ''
        };
    }

    public ensureOnlyOneDefaultProjectsIsSelected(project_key: string, is_default: boolean): void {
        if (!is_default) {
            return;
        }
        if (this.post) {
            for (const i in this.post.jira_projects) {
                this.post.jira_projects[i].is_default = false;
                if (this.post.jira_projects[i].project_key === project_key) {
                    this.post.jira_projects[i].is_default = true;
                }
            }
        }
    }

    public findIssueTypeNameById(projectIndex: number, selectedIssueTypeKey: string, selectedProjectKey: string) {
        if (!this.post) {
            return;
        }

        if (!this.post.jira_projects[projectIndex]) {
            return;
        }

        if (this.projectDetails[selectedProjectKey].issueTypes) {
            for (const i in this.projectDetails[selectedProjectKey].issueTypes) {
                const issueType = this.projectDetails[selectedProjectKey].issueTypes[i];
                if (issueType.key === selectedIssueTypeKey) {
                    this.post.jira_projects[projectIndex].issue_type_name = issueType.value;
                }
            }
        }
    }

    // Returns validation errors of one or multiple Jira Projects are selected
    public getJiraProjectErrors(projectIndex: number): GenericValidationError | null {
        if (this.errors) {
            if (this.errors['jira_projects']) {
                if (Array.isArray(this.errors['jira_projects'])) {
                    // Server returns an array of errors - so one or more projects have errors
                    if (this.errors['jira_projects'][projectIndex]) {
                        return this.errors['jira_projects'][projectIndex];
                    }
                }

                // We do NOT get an array from the server, so no projects are selected, or multiple projects are selected
                // but the one with an error has an index > 0 - so we end up with an objects instead of an array.


                // If we have non-numeric keys, we are a "general" project error (no project was selected, or no default project was selected)
                const keys = Object.keys(this.errors['jira_projects']);
                let allKeysAreNumeric = true;
                for (const key of keys) {
                    if (isNaN(Number(key))) {
                        allKeysAreNumeric = false;
                        break;
                    }
                }

                if (allKeysAreNumeric) {
                    // All keys are numeric, so we have an error for a specific project
                    if (this.errors['jira_projects'][projectIndex]) {
                        // @ts-ignore
                        return this.errors['jira_projects'][projectIndex];
                    }
                }
            }
        }

        return null;
    }

    // Returns the validation errors, of no Jira Projects are selected
    public getJiraProjectGeneralErrors(): GenericValidationError | null {
        if (this.errors) {
            if (this.errors['jira_projects']) {
                if (!Array.isArray(this.errors['jira_projects'])) {
                    // We do NOT get an array from the server, so no projects are selected, or multiple projects are selected
                    // but the one with an error has an index > 0 - so we end up with an objects instead of an array.

                    // If we have non-numeric keys, we are a "general" project error (no project was selected, or no default project was selected)
                    const keys = Object.keys(this.errors['jira_projects']);
                    let allKeysAreNumeric = true;
                    for (const key of keys) {
                        if (isNaN(Number(key))) {
                            allKeysAreNumeric = false;
                            break;
                        }
                    }

                    if (!allKeysAreNumeric) {
                        // Non-numeric keys, no project or no default project selected
                        return this.errors;
                    }

                }
            }
        }

        return null;
    }
}

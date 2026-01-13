import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
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
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';

import { NgSelectComponent } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import {
    RegexHelperTooltipComponent
} from '../../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { CustomalertRulesService } from '../customalert-rules.service';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { CustomAlertRulesIndex, EditableCustomAlertRule } from '../customalert-rules.interface';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { ContainersLoadContainersByStringParams } from '../../../../../pages/containers/containers.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../../../history.service';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';

@Component({
    selector: 'oitc-customalert-rules-edit',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    NgSelectComponent,
    PermissionDirective,
    RegexHelperTooltipComponent,
    RequiredIconComponent,
    SelectComponent,
    TranslocoDirective,
    TrueFalseDirective,
    XsButtonDirective,
    FormLoaderComponent,
    RouterLink
],
    templateUrl: './customalert-rules-edit.component.html',
    styleUrl: './customalert-rules-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertRulesEditComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly CustomAlertRulesService: CustomalertRulesService = inject(CustomalertRulesService);
    private readonly ContainersService: ContainersService = inject(ContainersService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly NotyService: NotyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly route = inject(ActivatedRoute);

    protected hostTags: string[] = [];
    protected hostTagsExcluded: string[] = [];
    protected serviceTags: string[] = [];
    protected serviceTagsExcluded: string[] = [];
    protected containers: SelectKeyValue[] = [];
    protected createAnother: boolean = false;
    protected result?: CustomAlertRulesIndex;
    protected hideFilter: boolean = true;
    protected selectedItems: DeleteAllItem[] = [];
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected post?: EditableCustomAlertRule;


    public ngOnInit() {
        let customAlertRuleId: number = Number(this.route.snapshot.paramMap.get('id'));

        this.loadContainers();

        this.subscriptions.add(this.CustomAlertRulesService.getEdit(customAlertRuleId)
            .subscribe((result: EditableCustomAlertRule) => {
                this.post = result;
                // Split the tags

                // Split the tags, remove empty strings from array.
                this.hostTags = this.post.host_keywords.trim().split(',').filter((tag: string) => tag.length > 0);
                this.hostTagsExcluded = this.post.host_not_keywords.trim().split(',').filter((tag: string) => tag.length > 0);
                this.serviceTags = this.post.service_keywords.trim().split(',').filter((tag: string) => tag.length > 0);
                this.serviceTagsExcluded = this.post.service_not_keywords.trim().split(',').filter((tag: string) => tag.length > 0);

                this.cdr.markForCheck();
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }


    protected updateCustomAlertRule(): void {
        if (!this.post) {
            return;
        }
        // Join together the data.
        this.post.host_keywords = this.hostTags.join(',');
        this.post.host_not_keywords = this.hostTagsExcluded.join(',');
        this.post.service_keywords = this.serviceTags.join(',');
        this.post.service_not_keywords = this.serviceTagsExcluded.join(',');

        this.subscriptions.add(this.CustomAlertRulesService.update(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    this.cdr.markForCheck();

                    const title: string = this.TranslocoService.translate('Custom alert rule');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['customalert_module', 'customalert_rules', 'edit', result.data.customalertRule.id];

                    this.NotyService.genericSuccess(msg, title, url);

                    this.HistoryService.navigateWithFallback(['/customalert_module/customalert_rules/index']);
                    return;
                }

                // Error
                this.NotyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

}

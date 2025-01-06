import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    AlertComponent,
    AlertHeadingDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { UserMacrosModalComponent } from '../../../../../pages/commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { PaginatorModule } from 'primeng/paginator';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { MkagentPost } from '../mkagents.interface';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { MkagentsService } from '../mkagents.service';
import { HistoryService } from '../../../../../history.service';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import {
    CodeMirrorContainerComponent
} from '../../../../../components/code-mirror-container/code-mirror-container.component';
import { ROOT_CONTAINER } from '../../../../../pages/changelogs/object-types.enum';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-mkagents-add',
    imports: [
        RouterLink,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        BackButtonDirective,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        UserMacrosModalComponent,
        XsButtonDirective,
        TranslocoDirective,
        CardBodyComponent,
        CardFooterComponent,
        FormCheckInputDirective,
        PaginatorModule,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NgIf,
        RequiredIconComponent,
        SelectComponent,
        FormControlDirective,
        CodeMirrorContainerComponent,
        AlertComponent,
        AlertHeadingDirective,
        FormDirective,
        FormsModule
    ],
    templateUrl: './mkagents-add.component.html',
    styleUrl: './mkagents-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MkagentsAddComponent implements OnInit, OnDestroy {

    public createAnother: boolean = false;
    public post: MkagentPost = this.getDefaultPost();
    public errors: GenericValidationError | null = null;
    public containers: SelectKeyValue[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly MkagentsService = inject(MkagentsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    private getDefaultPost(): MkagentPost {
        return {
            container_id: 0,
            name: "",
            description: "",
            command_line: ""
        }
    }

    public ngOnInit(): void {
        this.loadContainers();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadContainers() {
        this.subscriptions.add(
            this.MkagentsService.loadContainers().subscribe(containers => {
                this.containers = containers;
                this.cdr.detectChanges();
            })
        );
    }

    public submit() {
        this.subscriptions.add(this.MkagentsService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Checkmk agent');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['checkmk_module', 'mkagents', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/checkmk_module/mkagents/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.notyService.scrollContentDivToTop();
                    this.errors = null;
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

    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    DropdownDividerDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { CreditsComponent } from '../../registers/credits/credits.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { CronjobsService } from '../cronjobs.service';
import { Cronjob, CronjobPost, CronjobsIndex } from '../cronjob.interface';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-cronjobs-index',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        CreditsComponent,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgIf,
        PermissionDirective,
        RequiredIconComponent,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        NgForOf,
        TableDirective,
        NoRecordsComponent,
        ButtonCloseDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgSelectModule,
        TrueFalseDirective,
        ModalToggleDirective,
        NgOptionHighlightModule
    ],
    templateUrl: './cronjobs-index.component.html',
    styleUrl: './cronjobs-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CronjobsIndexComponent implements OnInit, OnDestroy {
    public cronjobs: CronjobsIndex | null = null
    public CronjobPost: CronjobPost = this.initNewCronjobs();
    public errors: GenericValidationError | null = null;

    public plugins: string[] = [];
    public tasks: string[] = [];

    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private CronjobsService = inject(CronjobsService)
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.loadCronjobs();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public initNewCronjobs(): CronjobPost {
        let c: CronjobPost = {
            enabled: 0,
            interval: 0,
            plugin: '',
            task: ''
        };
        return c;
    }

    public loadCronjobs() {
        this.subscriptions.add(this.CronjobsService.getIndex()
            .subscribe((result) => {
                this.cronjobs = result;
                this.cdr.markForCheck();
            })
        );
    }

    public loadTasks(pluginName: string) {
        this.CronjobPost.task = ''; // Undo current selection
        this.subscriptions.add(this.CronjobsService.getTasks(pluginName, '')
            .subscribe((result) => {
                this.tasks = result;
                this.cdr.markForCheck();
            })
        );
    }

    public triggerAddModal() {
        this.CronjobPost = this.initNewCronjobs();
        this.errors = null;
        this.tasks = [];
        this.plugins = [];
        this.cdr.markForCheck();

        this.subscriptions.add(this.CronjobsService.getPlugins('')
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.plugins = result;

                this.modalService.toggle({
                    show: true,
                    id: 'addCronjobModal',
                });
            })
        );
    }

    public createCronjob() {
        this.subscriptions.add(this.CronjobsService.createConjob(this.CronjobPost)
            .subscribe((result) => {
                this.cdr.markForCheck();

                if (result.success) {
                    this.notyService.genericSuccess();

                    this.modalService.toggle({
                        show: false,
                        id: 'addCronjobModal',
                    });

                    this.loadCronjobs();
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

    public triggerEditModal(cronjob: Cronjob) {
        this.cdr.markForCheck();

        this.CronjobPost = {
            id: cronjob.id,
            enabled: cronjob.enabled ? 1 : 0,
            interval: cronjob.interval,
            plugin: cronjob.plugin,
            task: cronjob.task

        };
        this.errors = null;
        this.tasks = [];
        this.plugins = [];

        this.subscriptions.add(this.CronjobsService.getPlugins(cronjob.plugin)
            .subscribe((result) => {
                this.cdr.markForCheck();

                this.plugins = result;

                this.subscriptions.add(this.CronjobsService.getTasks(cronjob.plugin, cronjob.task)
                    .subscribe((result) => {
                        this.cdr.markForCheck();

                        this.tasks = result;

                        this.modalService.toggle({
                            show: true,
                            id: 'editCronjobModal',
                        });
                    })
                );

            })
        );
    }

    public updateCronjob() {
        this.subscriptions.add(this.CronjobsService.updateConjob(this.CronjobPost)
            .subscribe((result) => {
                this.cdr.markForCheck();

                if (result.success) {
                    this.notyService.genericSuccess();

                    this.modalService.toggle({
                        show: false,
                        id: 'editCronjobModal',
                    });

                    this.loadCronjobs();
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

    public deleteCronjob() {
        const id = Number(this.CronjobPost.id);
        this.subscriptions.add(this.CronjobsService.deleteCronjob(id)
            .subscribe((result) => {
                this.cdr.markForCheck();

                if (result.success) {
                    this.notyService.genericSuccess();

                    this.modalService.toggle({
                        show: false,
                        id: 'editCronjobModal',
                    });

                    this.loadCronjobs();
                    return;
                }

                // Error
                this.notyService.genericError();
            })
        );
    }

}

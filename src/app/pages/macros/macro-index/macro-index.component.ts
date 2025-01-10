import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';


import {
  AlertHeadingDirective,
  ButtonCloseDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  ColComponent,
  ContainerComponent,
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


import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgClass, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';

import { PermissionDirective } from '../../../permissions/permission.directive';

import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { AvailableMacroNamesParams, MacroIndex, MacroPost } from '../macros.interface';
import { Subscription } from 'rxjs';
import { MacrosService } from '../macros.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericValidationError } from '../../../generic-responses';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

@Component({
    selector: 'oitc-macro-index',
    imports: [
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FaIconComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormsModule,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    NgForOf,
    NgIf,
    NoRecordsComponent,
    PermissionDirective,
    ReactiveFormsModule,
    RowComponent,
    TableDirective,
    TranslocoDirective,
    TranslocoPipe,
    XsButtonDirective,
    RouterLink,
    NgClass,
    AlertHeadingDirective,
    ModalToggleDirective,
    ModalHeaderComponent,
    ModalComponent,
    ModalBodyComponent,
    ButtonCloseDirective,
    ModalTitleDirective,
    ModalFooterComponent,
    NgSelectModule,
    FormLabelDirective,
    RequiredIconComponent,
    TrueFalseDirective,
    FormFeedbackComponent,
    FormErrorDirective,
    FormFeedbackComponent,
    NgOptionHighlightModule
],
    templateUrl: './macro-index.component.html',
    styleUrl: './macro-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacroIndexComponent implements OnInit, OnDestroy {

    public macros: MacroIndex[] = [];
    public currentMacro: MacroPost | null = null;
    public availableMacroNames: string[] = [];
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription();
    private MacrosService = inject(MacrosService)
    private readonly modalService = inject(ModalService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.loadMacros();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadMacros() {
        this.subscriptions.add(this.MacrosService.getIndex()
            .subscribe((result) => {
                this.macros = result;
                this.cdr.markForCheck();
            })
        );
    }

    public createMacro() {
        const params: AvailableMacroNamesParams = {
            include: '', // Return all available macro names
            angular: true
        }

        this.currentMacro = {
            Macro: {
                name: null,
                value: '',
                description: '',
                password: 0
            }
        };

        this.subscriptions.add(this.MacrosService.getAvailableMacroNames(params)
            .subscribe((result) => {
                this.cdr.markForCheck();

                this.availableMacroNames = result;

                this.modalService.toggle({
                    show: true,
                    id: 'macroAddModal',
                });
            })
        );
    }

    public editMacro(macro: MacroIndex) {
        const params: AvailableMacroNamesParams = {
            include: macro.name,
            angular: true
        }

        this.currentMacro = {
            Macro: {
                id: macro.id,
                name: macro.name,
                value: macro.value,
                description: macro.description,
                password: macro.password
            }
        };

        this.subscriptions.add(this.MacrosService.getAvailableMacroNames(params)
            .subscribe((result) => {
                this.cdr.markForCheck();

                this.availableMacroNames = result;

                this.modalService.toggle({
                    show: true,
                    id: 'macroEditModal',
                });
            })
        );
    }

    public saveMacro() {
        if (this.currentMacro) {
            if (this.currentMacro.Macro.id && this.currentMacro.Macro.id > 0) {
                // Edit existing macro
                this.subscriptions.add(this.MacrosService.editMacro(this.currentMacro)
                    .subscribe((result) => {
                        this.cdr.markForCheck();

                        if (result === true) {
                            this.notyService.genericSuccess();
                            this.modalService.toggle({
                                show: false,
                                id: 'macroEditModal',
                            });
                            this.loadMacros();
                            return;
                        }

                        // Error
                        this.notyService.genericError();
                        if (result) {
                            this.errors = result;
                        }
                    })
                );
                return;
            }

            // Create new macro
            this.subscriptions.add(this.MacrosService.addMacro(this.currentMacro)
                .subscribe((result) => {
                    this.cdr.markForCheck();

                    if (result === true) {
                        this.notyService.genericSuccess();
                        this.modalService.toggle({
                            show: false,
                            id: 'macroAddModal',
                        });
                        this.loadMacros();
                        return;
                    }

                    // Error
                    this.notyService.genericError();
                    if (result) {
                        this.errors = result;
                    }
                })
            );
        }
    }

    public deleteMacro() {
        if (this.currentMacro) {
            if (this.currentMacro.Macro.id && this.currentMacro.Macro.id > 0) {
                this.subscriptions.add(this.MacrosService.deleteMacro(this.currentMacro.Macro.id)
                    .subscribe((result) => {
                        this.cdr.markForCheck();

                        if (result.success) {
                            this.notyService.genericSuccess(
                                this.TranslocoService.translate('Record deleted successfully')
                            );
                            this.modalService.toggle({
                                show: false,
                                id: 'macroEditModal',
                            });
                            this.loadMacros();
                            return;
                        }

                        // Error
                        this.notyService.genericError();
                    })
                );
            }
        }
    }

}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import {
    AlertComponent,
    AlertHeadingDirective,
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
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
import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
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

@Component({
    selector: 'oitc-macro-index',
    standalone: true,
    imports: [
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        CoreuiComponent,
        DebounceDirective,
        DeleteAllModalComponent,
        DropdownDividerDirective,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        ItemSelectComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        NgClass,
        AlertComponent,
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
        KeyValuePipe,
        FormErrorDirective,
        FormFeedbackComponent,
    ],
    templateUrl: './macro-index.component.html',
    styleUrl: './macro-index.component.css'
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
                this.availableMacroNames = result;

                this.modalService.toggle({
                    show: true,
                    id: 'macroAddEditModal',
                });
            })
        );
    }

    public saveMacro() {
        if (this.currentMacro) {
            this.subscriptions.add(this.MacrosService.addMacro(this.currentMacro)
                .subscribe((result) => {
                    if (result === true) {
                        this.notyService.genericSuccess();
                        this.modalService.toggle({
                            show: false,
                            id: 'macroAddEditModal',
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

}

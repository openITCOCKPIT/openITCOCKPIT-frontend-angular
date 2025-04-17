import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    AlertComponent,
    AlertHeadingDirective,
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective,
    NavComponent,
    NavItemComponent
} from "@coreui/angular";
import { XsButtonDirective } from "../../../layouts/coreui/xsbutton-directive/xsbutton.directive";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NgForOf, NgIf } from '@angular/common';

import { RequiredIconComponent } from "../../../components/required-icon/required-icon.component";
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PermissionDirective } from "../../../permissions/permission.directive";


import { MatCheckboxModule } from '@angular/material/checkbox';


import { CommandTypesEnum } from '../command-types.enum';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { UserMacrosModalComponent } from '../user-macros-modal/user-macros-modal.component';
import { ArgumentsMissmatch, CommandPost } from '../commands.interface';
import { Subscription } from 'rxjs';
import { CommandsService } from '../commands.service';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import {
    CodeMirrorContainerComponent
} from "../../../components/code-mirror-container/code-mirror-container.component";
import { DefaultMacros } from "../../../components/code-mirror-container/code-mirror-container.interface";
import { MacrosService } from '../../macros/macros.service';
import { MacroIndex } from "../../macros/macros.interface";
import { HistoryService } from '../../../history.service';
import { DefaultMacrosModalComponent } from '../default-macros-modal/default-macros-modal.component';

@Component({
    selector: 'oitc-commands-add',
    imports: [
        TranslocoDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        FaIconComponent,
        NgIf,
        FormDirective,
        FormControlDirective,
        FormLabelDirective,
        RequiredIconComponent,
        FormCheckComponent,
        TranslocoPipe,
        RouterLink,
        FormsModule,
        NgForOf,
        PermissionDirective,
        MatCheckboxModule,
        FormSelectDirective,
        FormTextDirective,
        AlertComponent,
        AlertHeadingDirective,
        BackButtonDirective,
        UserMacrosModalComponent,
        FormFeedbackComponent,
        FormErrorDirective,
        NgSelectModule,
        ButtonCloseDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ModalToggleDirective,
        CodeMirrorContainerComponent,
        DefaultMacrosModalComponent
    ],
    templateUrl: './commands-add.component.html',
    styleUrl: './commands-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandsAddComponent implements OnInit, OnDestroy {

    public post: CommandPost = {
        name: "",
        command_type: CommandTypesEnum.CHECK_COMMAND,
        command_line: "",
        description: "",
        commandarguments: []
    }
    public defaultMacros: DefaultMacros[] = [];
    public macros: MacroIndex[] = [];
    public errors: GenericValidationError | null = null;

    public argumentMissmatch: ArgumentsMissmatch = {
        hasMissmatch: false,
        usedCommandLineArgs: [],
        definedCommandArguments: [],
        missingArgumentDefenitions: [],
        missingArgumentUsageInCommandLine: []
    }

    private CommandsService = inject(CommandsService);
    private readonly modalService = inject(ModalService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private MacrosService = inject(MacrosService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit() {
        this.subscriptions.add(this.CommandsService.getAdd()
            .subscribe((result) => {
                this.defaultMacros = result;
                this.cdr.markForCheck();
            }));
        this.loadMacros();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public trackByIndex(index: number, item: any): number {
        return index;
    }

    public loadMacros() {
        this.subscriptions.add(this.MacrosService.getIndex()
            .subscribe((result) => {
                this.macros = result;
                this.cdr.markForCheck();
            })
        );
    }

    public addArgument() {
        let argsCount = 1;
        let allArgNumbersInUse: number[] = [];
        for (let i in this.post.commandarguments) {
            const arg = this.post.commandarguments[i];
            const argNumber = arg.name.match(/\d+/g);
            if (argNumber) {
                allArgNumbersInUse.push(parseInt(argNumber[0], 10));
            }
        }

        while (allArgNumbersInUse.includes(argsCount)) {
            argsCount++;
        }

        this.post.commandarguments.push({
            name: '$ARG' + argsCount + '$',
            human_name: ''
        });

        // Sortcommand arguemnts by name
        this.sortArgumentsByName();
        this.cdr.markForCheck();
    }

    public removeArgument(index: number) {
        this.post.commandarguments.splice(index, 1);
        this.cdr.markForCheck();
    }

    public checkForMisingArguments() {
        this.cdr.markForCheck();
        const commandLine = this.post.command_line;
        const usedCommandLineArgs: string[] = commandLine.match(/(\$ARG\d+\$)/g) ?? [];
        const definedCommandArguments = this.post.commandarguments.map(arg => arg.name);

        let missingArgumentDefenitions = usedCommandLineArgs.filter(arg => !definedCommandArguments.includes(arg));
        let missingArgumentUsageInCommandLine = definedCommandArguments.filter(arg => !usedCommandLineArgs.includes(arg));

        if (missingArgumentUsageInCommandLine.length === 0 && missingArgumentDefenitions.length === 0) {
            this.argumentMissmatch.hasMissmatch = false;
            this.saveCommand();
            return;
        }

        this.argumentMissmatch.hasMissmatch = true;
        this.argumentMissmatch.usedCommandLineArgs = usedCommandLineArgs;
        this.argumentMissmatch.definedCommandArguments = definedCommandArguments;
        this.argumentMissmatch.missingArgumentDefenitions = missingArgumentDefenitions;
        this.argumentMissmatch.missingArgumentUsageInCommandLine = missingArgumentUsageInCommandLine;

        this.modalService.toggle({
            show: true,
            id: 'commandArgumentMissmatchModal',
        });

    }

    public saveCommand() {
        // Remove empty args
        for (let i in this.post.commandarguments) {
            if (!/\S/.test(this.post.commandarguments[i].human_name)) {
                this.removeArgument(Number(i));
            }
        }

        this.subscriptions.add(this.CommandsService.createCommand(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();

                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Command');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['commands', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.modalService.toggle({
                        show: false,
                        id: 'macroAddModal',
                    });
                    this.HistoryService.navigateWithFallback(['/commands/index']);

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

    private sortArgumentsByName() {
        this.post.commandarguments = this.post.commandarguments.sort(function (a, b) {
            return a.name.localeCompare(b.name, undefined, {
                numeric: true,
                sensitivity: 'base'
            });
        });
        this.cdr.markForCheck();
    }

    protected readonly CommandTypesEnum = CommandTypesEnum;
}

import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CoreuiComponent} from '../../../layouts/coreui/coreui.component';
import {TranslocoDirective, TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {
    AlertComponent,
    AlertHeadingDirective,
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardSubtitleDirective,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ListGroupDirective,
    ListGroupItemDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective,
    NavComponent,
    NavItemComponent,
    PlaceholderDirective,
    RowComponent,
    TableColorDirective,
    TableDirective
} from "@coreui/angular";
import {XsButtonDirective} from "../../../layouts/coreui/xsbutton-directive/xsbutton.directive";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgForOf, NgIf} from '@angular/common';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import {RequiredIconComponent} from "../../../components/required-icon/required-icon.component";
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DebounceDirective} from '../../../directives/debounce.directive';
import {PermissionDirective} from "../../../permissions/permission.directive";
import {TrueFalseDirective} from '../../../directives/true-false.directive';
import {NoRecordsComponent} from '../../../layouts/coreui/no-records/no-records.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SelectAllComponent} from '../../../layouts/coreui/select-all/select-all.component';
import {ItemSelectComponent} from '../../../layouts/coreui/select-all/item-select/item-select.component';
import {DeleteAllModalComponent} from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import {CommandTypesEnum} from '../command-types.enum';
import {BackButtonDirective} from '../../../directives/back-button.directive';
import {UserMacrosModalComponent} from '../user-macros-modal/user-macros-modal.component';
import {ArgumentsMissmatch, CommandPost} from '../commands.interface';
import {Subscription} from 'rxjs';
import {CommandsService} from '../commands.service';
import {FormFeedbackComponent} from '../../../layouts/coreui/form-feedback/form-feedback.component';
import {FormErrorDirective} from '../../../layouts/coreui/form-error.directive';
import {NgSelectModule} from '@ng-select/ng-select';
import {GenericIdResponse, GenericValidationError} from '../../../generic-responses';
import {NotyService} from '../../../layouts/coreui/noty.service';
import {CodeMirrorContainerComponent} from "../../../components/code-mirror-container/code-mirror-container.component";
import {DefaultMacros} from "../../../components/code-mirror-container/code-mirror-container.interface";
import {MacrosService} from '../../macros/macros.service';
import {MacroIndex} from "../../macros/macros.interface";

@Component({
    selector: 'oitc-commands-add',
    standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardSubtitleDirective,
        CardTitleDirective,
        ListGroupDirective,
        ListGroupItemDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        FaIconComponent,
        PaginateOrScrollComponent,
        NgIf,
        TableDirective,
        TableColorDirective,
        ContainerComponent,
        RowComponent,
        ColComponent,
        FormDirective,
        FormControlDirective,
        FormLabelDirective,
        RequiredIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        PlaceholderDirective,
        TranslocoPipe,
        RouterLink,
        FormsModule,
        DebounceDirective,
        NgForOf,
        PermissionDirective,
        TrueFalseDirective,
        NoRecordsComponent,
        MatCheckboxModule,
        SelectAllComponent,
        ItemSelectComponent,
        DeleteAllModalComponent,
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
    ],
    templateUrl: './commands-add.component.html',
    styleUrl: './commands-add.component.css'
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
    private router = inject(Router);

    private subscriptions: Subscription = new Subscription();


    public ngOnInit() {
        this.subscriptions.add(this.CommandsService.getAdd()
            .subscribe((result) => {
                this.defaultMacros = result;
            }));
        this.loadMacros();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    trackByIndex(index: number, item: any): number {
        return index;
    }

    public loadMacros() {
        this.subscriptions.add(this.MacrosService.getIndex()
            .subscribe((result) => {
                this.macros = result;
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
    }

    public removeArgument(index: number) {
        this.post.commandarguments.splice(index, 1);
    }

    public checkForMisingArguments() {
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
                    this.router.navigate(['/commands/index']);

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
    }

    protected readonly CommandTypesEnum = CommandTypesEnum;
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommandsService } from '../commands.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericValidationError } from '../../../generic-responses';
import { CommandCopyPost } from '../commands.interface';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective,
    NavComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { TranslocoDirective } from '@jsverse/transloco';

import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { HttpErrorResponse } from '@angular/common/http';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-commands-copy',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        PermissionDirective,
        XsButtonDirective,
        BackButtonDirective,
        RouterLink,
        TranslocoDirective,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        RequiredIconComponent,
        CardFooterComponent,
        FormLoaderComponent
    ],
    templateUrl: './commands-copy.component.html',
    styleUrl: './commands-copy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandsCopyComponent implements OnInit, OnDestroy {

    public commands: CommandCopyPost[] = [];
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription()
    private CommandsService = inject(CommandsService);
    private readonly notyService = inject(NotyService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);
        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'commands', 'index']);
        }

        if (ids) {
            this.subscriptions.add(this.CommandsService.getCommandsCopy(ids).subscribe(commands => {
                for (let command of commands) {
                    this.commands.push(<CommandCopyPost>{
                        Source: {
                            id: command.Command.id,
                            name: command.Command.name,
                        },

                        Command: {
                            name: command.Command.name,
                            command_line: command.Command.command_line,
                            description: command.Command.description,
                        },
                        Error: null
                    })
                }
                this.cdr.markForCheck();
            }));
        }
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe()
    }

    public copy() {
        const sub = this.CommandsService.saveCommandsCopy(this.commands).subscribe({
            next: (value: any) => {
                //console.log(value); // Serve result with the new copied commands
                // 200 ok
                this.notyService.genericSuccess();
                this.HistoryService.navigateWithFallback(['/', 'commands', 'index']);
            },
            error: (error: HttpErrorResponse) => {
                // We run into a validation error.
                // Some commands maybe already got created. For example when the user copied 3 commands, and the first
                // two commands where copied successfully, but the third one failed due to a validation error.
                //
                // The Server returns everything as the frontend expect it

                this.cdr.markForCheck();
                this.notyService.genericError();
                this.commands = error.error.result as CommandCopyPost[];
            }
        });
        this.subscriptions.add(sub);
    }

}

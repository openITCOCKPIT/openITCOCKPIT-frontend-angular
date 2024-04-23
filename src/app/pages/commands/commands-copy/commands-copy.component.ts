import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgForOf } from '@angular/common';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'oitc-commands-copy',
    standalone: true,
    imports: [
        CoreuiComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        XsButtonDirective,
        BackButtonDirective,
        RouterLink,
        TranslocoDirective,
        NgForOf,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        RequiredIconComponent,
        CardFooterComponent
    ],
    templateUrl: './commands-copy.component.html',
    styleUrl: './commands-copy.component.css'
})
export class CommandsCopyComponent implements OnInit, OnDestroy {

    public commands: CommandCopyPost[] = [];
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription()
    private CommandsService = inject(CommandsService);
    private readonly notyService = inject(NotyService);
    private router = inject(Router);
    private route = inject(ActivatedRoute)

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);
        console.log(ids);
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
            }));
        }
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe()
    }
    
    public copy() {
        const sub = this.CommandsService.saveCommandsCopy(this.commands).subscribe({
            next: (value: any) => {
                console.log(value); // Serve result with the new copied commands
                // 200 ok
                this.notyService.genericSuccess();
                this.router.navigate(['/', 'commands', 'index']);
            },
            error: (error: HttpErrorResponse) => {
                // We run into a validation error.
                // Some commands maybe already got created. For example when the user copied 3 commands, and the first
                // two commands where copied successfully, but the third one failed due to a validation error.
                //
                // The Server returns everything as the frontend expect it

                this.commands = error.error.result as CommandCopyPost[];
            }
        });

        this.subscriptions.add(sub);
    }

}

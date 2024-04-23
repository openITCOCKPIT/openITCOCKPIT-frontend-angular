import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandsService } from '../commands.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericValidationError } from '../../../generic-responses';
import { CommandCopyPost } from '../commands.interface';

@Component({
    selector: 'oitc-commands-copy',
    standalone: true,
    imports: [
        CoreuiComponent
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
        const ids = this.route.snapshot.paramMap.get('ids')?.split(',').map(Number);
        if (!ids) {
            // No ids given
            this.router.navigate(['/commands/index'])
        }

        if (ids) {
            this.subscriptions.add(this.CommandsService.getCommandsCopy(ids).subscribe(commands => {
                // todo implement me
                for (let command of commands) {
                    /*
                    this.commands.push({
                        Source: {
                            id: command.id,
                            name: command.name,
                        },

                        Command: {
                            name: command.name,
                            command_line: command.command_line,
                            command_type: command..command_type,
                            human_args: command.Command.human_args,
                            description: command.Command.description,
                            type: command.Command.type
                        }
                    })*/
                }
            }));
        }
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe()
    }


}

import { Component, inject } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { CommandsService } from '../commands.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommandIndexRoot, CommandsIndexParams } from '../commands.interface';
import { CommandTypesEnum } from '../command-types.enum';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'oitc-commands-index',
  standalone: true,
  imports: [
    CoreuiComponent,
    TranslocoDirective,
    JsonPipe
  ],
  templateUrl: './commands-index.component.html',
  styleUrl: './commands-index.component.css'
})
export class CommandsIndexComponent {

  public params: CommandsIndexParams = {
    angular: true,
    scroll: true,
    page: 1,
    direction: 'asc',
    sort: 'Commands.name',
    'filter[Commands.id][]': [],
    'filter[Commands.name]': "",
    'filter[Commands.command_type][]': [
      CommandTypesEnum.CHECK_COMMAND,
      CommandTypesEnum.HOSTCHECK_COMMAND,
      CommandTypesEnum.NOTIFICATION_COMMAND,
      CommandTypesEnum.EVENTHANDLER_COMMAND
    ]
  }

  public commands?: CommandIndexRoot


  private subscriptions: Subscription = new Subscription();
  private CommandsService = inject(CommandsService)

  constructor(private _liveAnnouncer: LiveAnnouncer) {
    this.loadCommands();
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public loadCommands() {
    this.subscriptions.add(this.CommandsService.getIndex(this.params)
      .subscribe((result) => {
        this.commands = result;
      })
    );
  }

}

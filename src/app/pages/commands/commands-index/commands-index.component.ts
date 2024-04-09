import { Component, inject } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective } from '@jsverse/transloco';
import {
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardSubtitleDirective,
  CardTitleDirective,
  ColComponent,
  ContainerComponent,
  FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective, InputGroupComponent, InputGroupTextDirective,
  ListGroupDirective,
  ListGroupItemDirective,
  NavComponent,
  NavItemComponent,
  RowComponent,
  TableColorDirective,
  TableDirective
} from "@coreui/angular";
import {XsButtonDirective} from "../../../layouts/coreui/xsbutton-directive/xsbutton.directive";
import {faArrowsRotate, faCircleInfo, faFilter, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import { Subscription } from 'rxjs';
import { CommandsService } from '../commands.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommandIndexRoot, CommandsIndexParams } from '../commands.interface';
import { CommandTypesEnum } from '../command-types.enum';
import { JsonPipe } from '@angular/common';
import {RequiredIconComponent} from "../../../components/required-icon/required-icon.component";

@Component({
  selector: 'oitc-commands-index',
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
    JsonPipe,
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
    InputGroupTextDirective
  ],
  templateUrl: './commands-index.component.html',
  styleUrl: './commands-index.component.css'
})
export class CommandsIndexComponent {

  protected readonly faCircleInfo = faCircleInfo;
  protected readonly faArrowsRotate = faArrowsRotate;
  protected readonly faPlus = faPlus;
  protected readonly faFilter = faFilter;
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

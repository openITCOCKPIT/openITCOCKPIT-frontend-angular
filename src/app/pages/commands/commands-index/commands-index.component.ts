import {Component, inject, NgIterable, OnDestroy, OnInit} from '@angular/core';
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
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ListGroupDirective,
  ListGroupItemDirective,
  NavComponent,
  NavItemComponent,
  RowComponent,
  TableColorDirective,
  TableDirective
} from "@coreui/angular";
import { XsButtonDirective } from "../../../layouts/coreui/xsbutton-directive/xsbutton.directive";
import {faArrowsRotate, faCircleInfo, faFilter, faGear, faPlus, faSquareCheck} from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Subscription } from 'rxjs';
import { CommandsService } from '../commands.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommandIndexRoot, CommandsIndexParams } from '../commands.interface';
import { CommandTypesEnum } from '../command-types.enum';
import {JsonPipe, NgForOf, NgIf} from '@angular/common';
import {
  PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { RequiredIconComponent } from "../../../components/required-icon/required-icon.component";
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';

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
    NgForOf
  ],
  templateUrl: './commands-index.component.html',
  styleUrl: './commands-index.component.css'
})
export class CommandsIndexComponent implements OnInit, OnDestroy {

  protected readonly faCircleInfo = faCircleInfo;
  protected readonly faArrowsRotate = faArrowsRotate;
  protected readonly faPlus = faPlus;
  protected readonly faFilter = faFilter;

  public params?: CommandsIndexParams;
  public commands?: CommandIndexRoot;


  private subscriptions: Subscription = new Subscription();
  private CommandsService = inject(CommandsService)

  constructor(private _liveAnnouncer: LiveAnnouncer) {
  }

  public ngOnInit() {
    this.resetFilter();
    this.loadCommands();
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public loadCommands() {
    if (this.params) {
      this.subscriptions.add(this.CommandsService.getIndex(this.params)
        .subscribe((result) => {
          this.commands = result;
        })
      );
    }
  }

  public resetFilter() {
    this.params = {
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
  }

  // Callback for Paginator or Scroll Index Component
  public onPaginatorChange(change: PaginatorChangeEvent): void {
    if (this.params) {
      this.params.page = change.page;
      this.params.scroll = change.scroll;
      this.loadCommands();
    }
  }

  protected readonly faSquareCheck = faSquareCheck;
  protected readonly faGear = faGear;
}

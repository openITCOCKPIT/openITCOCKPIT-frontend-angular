import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
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
  PlaceholderDirective,
  RowComponent,
  TableColorDirective,
  TableDirective
} from "@coreui/angular";
import { XsButtonDirective } from "../../../layouts/coreui/xsbutton-directive/xsbutton.directive";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Subscription } from 'rxjs';
import { CommandsService } from '../commands.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommandIndexRoot, CommandsIndexParams, getDefaultCommandsIndexParams } from '../commands.interface';
import { NgForOf, NgIf } from '@angular/common';
import {
  PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { RequiredIconComponent } from "../../../components/required-icon/required-icon.component";
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { PermissionDirective } from "../../../permissions/permission.directive";
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { CommandTypesEnum } from '../command-types.enum';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatCheckboxModule
  ],
  templateUrl: './commands-index.component.html',
  styleUrl: './commands-index.component.css'
})
export class CommandsIndexComponent implements OnInit, OnDestroy {

  public readonly route = inject(ActivatedRoute);
  public readonly router = inject(Router);

  public params: CommandsIndexParams = getDefaultCommandsIndexParams()
  public commands?: CommandIndexRoot;
  public hideFilter: boolean = false;

  public tmpFilter = {
    service_commands: true,
    hostcheck_commands: true,
    notification_commands: true,
    eventhandler_commands: true
  }

  private subscriptions: Subscription = new Subscription();
  private CommandsService = inject(CommandsService)

  constructor(private _liveAnnouncer: LiveAnnouncer) {

  }

  public ngOnInit() {
    this.subscriptions.add(this.route.queryParams.subscribe(params => {
      // Here, params is an object containing the current query parameters.
      // You can do something with these parameters here.
      console.log(params);
      this.loadCommands();
    }));
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public loadCommands() {
    this.params['filter[Commands.command_type][]'] = [];
    if (this.tmpFilter.service_commands) {
      this.params['filter[Commands.command_type][]'].push(CommandTypesEnum.CHECK_COMMAND);
    }
    if (this.tmpFilter.hostcheck_commands) {
      this.params['filter[Commands.command_type][]'].push(CommandTypesEnum.HOSTCHECK_COMMAND);
    }
    if (this.tmpFilter.notification_commands) {
      this.params['filter[Commands.command_type][]'].push(CommandTypesEnum.NOTIFICATION_COMMAND);
    }
    if (this.tmpFilter.eventhandler_commands) {
      this.params['filter[Commands.command_type][]'].push(CommandTypesEnum.EVENTHANDLER_COMMAND);
    }

    this.subscriptions.add(this.CommandsService.getIndex(this.params)
      .subscribe((result) => {
        this.commands = result;
      })
    );
  }

  // Show or hide the filter
  public toggleFilter() {
    this.hideFilter = !this.hideFilter;
  }

  public resetFilter() {
    this.params = getDefaultCommandsIndexParams();
    this.tmpFilter = {
      service_commands: true,
      hostcheck_commands: true,
      notification_commands: true,
      eventhandler_commands: true
    }
  }

  // Callback for Paginator or Scroll Index Component
  public onPaginatorChange(change: PaginatorChangeEvent): void {
    this.params.page = change.page;
    this.params.scroll = change.scroll;
    this.loadCommands();
  }


  // Callback when a filter has changed
  public onFilterChange(event: Event) {
    this.params.page = 1;
    this.loadCommands();
  }
}

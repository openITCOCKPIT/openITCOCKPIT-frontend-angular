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
  FormLabelDirective, FormSelectDirective, FormTextDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ListGroupDirective,
  ListGroupItemDirective,
  ModalService,
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
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';

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
  ],
  templateUrl: './commands-add.component.html',
  styleUrl: './commands-add.component.css'
})
export class CommandsAddComponent {

}

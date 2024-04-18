import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
  ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import {
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  ColComponent,
  ContainerComponent,
  DropdownDividerDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  NavComponent,
  NavItemComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
  PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { MacroIndex } from '../macros.interface';
import { Subscription } from 'rxjs';
import { MacrosService } from '../macros.service';

@Component({
  selector: 'oitc-macro-index',
  standalone: true,
  imports: [
    ActionsButtonComponent,
    ActionsButtonElementComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    CoreuiComponent,
    DebounceDirective,
    DeleteAllModalComponent,
    DropdownDividerDirective,
    FaIconComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormsModule,
    InputGroupComponent,
    InputGroupTextDirective,
    ItemSelectComponent,
    NavComponent,
    NavItemComponent,
    NgForOf,
    NgIf,
    NoRecordsComponent,
    PaginateOrScrollComponent,
    PermissionDirective,
    ReactiveFormsModule,
    RowComponent,
    SelectAllComponent,
    TableDirective,
    TranslocoDirective,
    TranslocoPipe,
    XsButtonDirective,
    RouterLink
  ],
  templateUrl: './macro-index.component.html',
  styleUrl: './macro-index.component.css'
})
export class MacroIndexComponent implements OnInit, OnDestroy {

  public macros: MacroIndex[] = [];

  private subscriptions: Subscription = new Subscription();
  private MacrosService = inject(MacrosService)


  public ngOnInit() {
    this.loadMacros();
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public loadMacros() {
    this.subscriptions.add(this.MacrosService.getIndex()
      .subscribe((result) => {
        this.macros = result;
      })
    );
  }


}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import {
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    TableDirective
} from '@coreui/angular';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MacroIndex } from '../../macros/macros.interface';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MacrosService } from '../../macros/macros.service';

@Component({
    selector: 'oitc-user-macros-modal',
    standalone: true,
    imports: [
        ModalToggleDirective,
        ModalComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ModalBodyComponent,
        BackButtonDirective,
        FaIconComponent,
        XsButtonDirective,
        ButtonCloseDirective,
        TranslocoDirective,
        MatSort,
        MatSortHeader,
        TableDirective,
        NgIf,
        TranslocoPipe,
        NgFor,
        NgClass,
        ModalFooterComponent
    ],
    templateUrl: './user-macros-modal.component.html',
    styleUrl: './user-macros-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMacrosModalComponent implements OnDestroy {

    public macros: MacroIndex[] = [];

    private subscriptions: Subscription = new Subscription();
    private MacrosService = inject(MacrosService);
    private cdr = inject(ChangeDetectorRef);

    public construct() {
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadMacros() {
        this.subscriptions.add(this.MacrosService.getIndex()
            .subscribe((result) => {
                this.macros = result;
                this.cdr.markForCheck();
            })
        );
    }

}

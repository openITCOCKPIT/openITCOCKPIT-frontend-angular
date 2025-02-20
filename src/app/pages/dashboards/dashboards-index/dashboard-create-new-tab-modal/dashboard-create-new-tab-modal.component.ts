import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, output } from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { DashboardsService } from '../../dashboards.service';

@Component({
    selector: 'oitc-dashboard-create-new-tab-modal',
    imports: [
        ButtonCloseDirective,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ReactiveFormsModule,
        TranslocoDirective,
        XsButtonDirective,
        ModalToggleDirective,
        RowComponent,
        ColComponent,
        FormControlDirective,
        FormLabelDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        RequiredIconComponent,
        TranslocoPipe,
        FormsModule,
        SelectComponent
    ],
    templateUrl: './dashboard-create-new-tab-modal.component.html',
    styleUrl: './dashboard-create-new-tab-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardCreateNewTabModalComponent implements OnDestroy {

    newTabCreated = output<number>()

    private readonly DashboardsService = inject(DashboardsService);

    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly subscriptions: Subscription = new Subscription();

    private cdr = inject(ChangeDetectorRef);

    public newTabName: string = '';
    public selectedSharedTabId: number = 0;
    public sharedTabs: SelectKeyValue[] = [];

    constructor() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.id === 'dashboardCreateNewTabModal' && state.show === true) {
                this.loadSharedTabs();
                this.newTabName = '';
                this.selectedSharedTabId = 0;
                this.sharedTabs = [];

                this.cdr.markForCheck();
            }
        }));

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private loadSharedTabs() {
        const tabs: SelectKeyValue[] = [];


        this.subscriptions.add(this.DashboardsService.getSharedTabs().subscribe((tabResponse) => {
            tabResponse.forEach((tab) => {
                tabs.push({
                    key: tab.id,
                    value: tab.name
                });
            });


            // For some reason, the tabs constant fixes, that if a user select a "shared tab" and close the modal
            // and open the modal again, and select another shared tab, the select box will not show any selected tab.
            // but the value is selected in ngmodel.
            // For some unknown reason, the tabs constant fixes this issue.
            // or so I don't know.
            this.sharedTabs = tabs;
            this.cdr.markForCheck();
        }));
    }

    public createNewTab() {
        if (this.newTabName === '') {
            return;
        }

        this.subscriptions.add(this.DashboardsService.addNewTab(this.newTabName).subscribe((response) => {
            if (response.success) {
                const data = response.data as unknown as { id: number };
                this.newTabCreated.emit(data.id);
                this.notyService.genericSuccess();


                // close modal
                this.modalService.toggle({
                    show: false,
                    id: 'dashboardCreateNewTabModal',
                });

                return;
            }

            this.notyService.genericError();
        }));
    }

    public createNewFromSharedTab() {
        if (this.selectedSharedTabId === 0) {
            return;
        }

        this.subscriptions.add(this.DashboardsService.createFromSharedTab(this.selectedSharedTabId).subscribe((response) => {
            if (response.success) {
                const data = response.data as unknown as { id: number };
                this.newTabCreated.emit(data.id);
                this.notyService.genericSuccess();


                // close modal
                this.modalService.toggle({
                    show: false,
                    id: 'dashboardCreateNewTabModal',
                });

                return;
            }

            this.notyService.genericError();
        }));
    }

}

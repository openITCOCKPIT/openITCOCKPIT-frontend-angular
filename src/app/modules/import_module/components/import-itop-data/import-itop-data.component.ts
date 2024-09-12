import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    AlertComponent,
    AlertHeadingDirective,
    ButtonCloseDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ProgressComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { LabelLinkComponent } from '../../../../layouts/coreui/label-link/label-link.component';
import { PermissionDirective } from '../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { Application, Applications, ExternalSystemEntity } from '../../external-systems.interface';
import { ExternalSystemsService } from '../../external-systems.service';
import { GenericMessageResponse, GenericResponseWrapper } from '../../../../generic-responses';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-import-itop-data',
    standalone: true,
    imports: [
        ButtonCloseDirective,
        ColComponent,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgForOf,
        NgIf,
        ProgressComponent,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective,
        FaStackComponent,
        FaStackItemSizeDirective,
        TranslocoPipe,
        LabelLinkComponent,
        PermissionDirective,
        RouterLink,
        JsonPipe,
        AlertComponent,
        AlertHeadingDirective,
        TableLoaderComponent,
        TableDirective,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormsModule
    ],
    templateUrl: './import-itop-data.component.html',
    styleUrl: './import-itop-data.component.css'
})
export class ImportITopDataComponent implements OnInit, OnDestroy {
    @ViewChild('modal') private modal!: ModalComponent;
    private subscriptions: Subscription = new Subscription();
    private readonly modalService = inject(ModalService);
    private readonly ExternalSystemService = inject(ExternalSystemsService);

    public externalSystem?: ExternalSystemEntity;
    protected iTopData: { success: boolean; data: Applications | GenericMessageResponse; } | undefined;
    public applications: Application[] = [];
    public ignoreExternalSystem: boolean = false;
    public showSynchronizingSpinner: boolean = false;
    public showSpinner: boolean = false;
    public errors: GenericResponseWrapper | null = null;

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngOnInit() {
        this.ExternalSystemService.modalExternalSystem$.subscribe((externalSystem: ExternalSystemEntity) => {
            this.externalSystem = externalSystem;
        });


        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.show === true && state.id === 'importITopData') {
                if (!this.externalSystem) {
                    return;
                }

                switch (this.externalSystem.system_type) {
                    case 'itop':
                        this.ExternalSystemService.loadDataFromITop(this.externalSystem).subscribe(data => {
                            this.iTopData = data;
                            if (this.iTopData.success) {
                                // @ts-ignore
                                for (let application of this.iTopData.data<Application>) {
                                    this.applications.push(application);
                                }
                            }
                        });
                        break;

                    default:
                        console.log('External System not supported yet')
                        return;
                }
            }
        }));

    }

    public hideModal() {
        this.modalService.toggle({
            show: false,
            id: 'importITopData'
        });
    }


    public startDataImport() {
        if (this.externalSystem && !this.externalSystem.id) {
            return;
        }
        if (this.externalSystem) {
            this.showSpinner = true;
            this.showSynchronizingSpinner = true;
            this.errors = null;
            this.ExternalSystemService.startDataImport(this.externalSystem, this.ignoreExternalSystem).subscribe(data => {
                this.showSynchronizingSpinner = false;
                this.showSpinner = false;
                if (data.success) {
                    this.hideModal();
                } else {
                    this.errors = data;
                }
            });
        }

    }
}

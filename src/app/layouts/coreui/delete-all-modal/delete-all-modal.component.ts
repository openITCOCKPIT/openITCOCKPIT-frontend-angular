import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ProgressComponent,
    RowComponent,
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { DeleteAllItem, DeleteAllResponse } from './delete-all.interface';
import { KeyValuePipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { HttpErrorResponse } from '@angular/common/http';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-delete-all-modal',
    imports: [
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalTitleDirective,
    ButtonCloseDirective,
    ModalFooterComponent,
    TranslocoDirective,
    RowComponent,
    ColComponent,
    FaIconComponent,
    ProgressComponent,
    XsButtonDirective,
    RouterLink,
    KeyValuePipe
],
    templateUrl: './delete-all-modal.component.html',
    styleUrl: './delete-all-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteAllModalComponent implements OnInit, OnDestroy {

    @Input({required: true}) public items: DeleteAllItem[] = [];
    @Input({required: false}) public deleteMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Input({required: false}) public overrideDeleteService: any = undefined;
    @Output() completed = new EventEmitter<boolean>();


    public isDeleting: boolean = false;
    public percentage: number = 0;
    public hasErrors: boolean = false;
    public errors: DeleteAllResponse[] = [];

    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);
    @ViewChild('modal') private modal!: ModalComponent;


    constructor(@Inject(DELETE_SERVICE_TOKEN) private deleteService: any) {
    }

    ngOnInit() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            //console.log(state);
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public hideModal() {
        this.isDeleting = false;
        this.percentage = 0;
        this.hasErrors = false;
        this.errors = [];
        this.cdr.markForCheck();

        this.modalService.toggle({
            show: false,
            id: 'deleteAllModal'
        });
    }

    public delete() {
        if (this.items.length === 0) {
            return;
        }

        this.isDeleting = true;
        this.percentage = 0;
        let count = this.items.length;
        let responseCount: number = 0
        let issueCount: number = 0;

        // Delete any old errors
        this.errors = [];

        let deleteService: any = this.deleteService;

        // If you have multiple delete modals on one page, you may want to pass overrideDeleteService to the component.
        if (this.overrideDeleteService) {
            deleteService = this.overrideDeleteService;
        }

        for (let i in this.items) {
            const item = this.items[i];

            deleteService.delete(item).subscribe({
                next: (value: any) => {
                    responseCount++
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount === 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            // All records have been deleted successfully. Reset the modal
                            this.isDeleting = false;
                            this.percentage = 0;
                            this.hasErrors = false;
                            this.errors = [];

                            this.hideModal();
                        }, 250);
                        this.completed.emit(true);
                    }

                },
                error: (error: HttpErrorResponse) => {
                    this.cdr.markForCheck();
                    const responseError = error.error as DeleteAllResponse;
                    issueCount++
                    this.hasErrors = true;
                    this.errors.push(responseError);

                    responseCount++;
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount > 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            this.isDeleting = false;
                            this.percentage = 0;
                        }, 250);
                        this.completed.emit(false);
                    }
                }
            });
        }
    }

    public currentItemHasErrors(item: DeleteAllItem): boolean {
        return this.errors.some((error) => error.id == item.id);
    }

    public getErrorsForItem(item: DeleteAllItem): DeleteAllResponse[] {
        return this.errors.filter((error) => error.id == item.id);
    }


    public createURL(uisref: string, id: number): (string | number)[] {
        switch (uisref) {
            case 'EventcorrelationsHostUsedBy':
                return ['/', 'eventcorrelation_module', 'eventcorrelations', 'hostUsedBy', id];
            case 'EventcorrelationsServiceUsedBy':
                return ['/', 'eventcorrelation_module', 'eventcorrelations', 'serviceUsedBy', id];
            case 'AutoreportsHostUsedBy':
                return ['/', 'autoreport_module', 'autoreports', 'hostUsedBy', id];
            case 'AutoreportsServiceUsedBy':
                return ['/', 'autoreport_module', 'autoreports', 'serviceUsedBy', id];
            case 'ContactsUsedBy':
                return ['/', 'contacts', 'usedBy', id];
            case 'ContactgroupsUsedBy':
                return ['/', 'contactgroups', 'usedBy', id];
            case 'CommandsUsedBy':
                return ['/', 'commands', 'usedBy', id];
            case 'HosttemplatesUsedBy':
                return ['/', 'hosttemplates', 'usedBy', id];
            case 'ServicetemplatesUsedBy':
                return ['/', 'servicetemplates', 'usedBy', id];
            case 'TimeperiodsUsedBy':
                return ['/', 'timeperiods', 'usedBy', id];
            case 'ContainersShowDetails':
                return ['/', 'containers', 'showDetails', id];
            case 'ImportersEdit':
                return ['/', 'import_module', 'importers', 'edit', id];
            case 'ResourcegroupsUsedBy':
                return ['/', 'scm_module', 'resourcegroups', 'usedBy', id];

            default:
                return ['/', 'error', 404];
        }
    }

    protected readonly Number = Number;
}

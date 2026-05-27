import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { PermissionsService } from '../../../permissions/permissions.service';
import { FilterBookmarkAllocateModalService } from './filter-bookmark-allocate-modal.service';
import {
    ButtonCloseDirective,
     FormControlDirective, FormLabelDirective, ModalBodyComponent, ModalComponent,
    ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ModalToggleDirective, ModalService
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericValidationError } from '../../../generic-responses';
import { BookmarksObject ,allocatedFilterbookmark } from '../bookmarks.interface';
import { ContainersLoadContainersByStringParams } from '../../../pages/containers/containers.interface';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { AsyncPipe } from '@angular/common';


@Component({
    selector: 'oitc-filter-bookmark-allocation-modal',
    imports: [
        ButtonCloseDirective,
        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        FormsModule,
        MultiSelectComponent,
        ReactiveFormsModule,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        ModalToggleDirective,
        AsyncPipe
    ],
    templateUrl: './filter-bookmark-allocation-modal.component.html',
    styleUrl: './filter-bookmark-allocation-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBookmarkAllocationModalComponent implements OnChanges, OnDestroy {

    @Input({required: true}) public plugin: string = '';
    @Input({required: true}) public controller: string = '';
    @Input({required: true}) public action: string = '';
    @Input({required: true}) public bookmark!: BookmarksObject;

    public containers: SelectKeyValue[] = [];
    public users: SelectKeyValue[] = [];
    public usergroups: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;
    private readonly modalService = inject(ModalService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    public FilterBookmarkAllocateModalService: FilterBookmarkAllocateModalService = inject(FilterBookmarkAllocateModalService);
    private readonly subscriptions: Subscription = new Subscription();

    public filterBookmarkAllocation: allocatedFilterbookmark | undefined;
    public originalFilterBookmarkAllocation: allocatedFilterbookmark | undefined;
    public selectedBookmark!: BookmarksObject;

    public mode: 'add' | 'edit' = 'add';

    private cdr = inject(ChangeDetectorRef);

    ngOnChanges(changes: SimpleChanges) {
        if (changes['bookmark']?.currentValue) {

            const bm = changes['bookmark'].currentValue;
            this.selectedBookmark = bm;
            if(!bm.ownership) {
                return;
            }

            if(this.selectedBookmark?.filter_bookmark_allocation && this.selectedBookmark.filter_bookmark_allocation.id) {
                this.mode = 'edit';
                //console.log('edit mode - allocation:', bm.Filter_bookmark_allocation);

                this.filterBookmarkAllocation = {
                    id: this.selectedBookmark.filter_bookmark_allocation.id,
                    container_id: this.selectedBookmark.filter_bookmark_allocation.container_id,
                    filter_bookmark_id: this.bookmark.id,
                    name: this.selectedBookmark.name,
                    users: {
                        _ids: this.selectedBookmark.filter_bookmark_allocation.users._ids
                    },
                    usergroups: {
                        _ids: this.selectedBookmark.filter_bookmark_allocation.usergroups._ids
                    }
                }
                this.loadElements();
            }


            if(!this.selectedBookmark.filter_bookmark_allocation ) {
                this.mode = 'add';
                this.filterBookmarkAllocation = {
                    container_id: 0,
                    filter_bookmark_id:this.selectedBookmark.id,
                    name: this.selectedBookmark.name,
                    users: {
                        _ids: []
                    },
                    usergroups: {
                        _ids: [],
                    }
                };
            }
            this.originalFilterBookmarkAllocation = JSON.parse(JSON.stringify(this.filterBookmarkAllocation)) as allocatedFilterbookmark;

            if (this.containers.length === 0) {
                this.loadContainers();
            }

        }
        this.cdr.markForCheck();
    }

    private loadContainers() {
        this.containers = [];
        this.cdr.markForCheck();

        const params: ContainersLoadContainersByStringParams = {
            angular: true,
            'filter[Containers.name]': '',
        };

        this.subscriptions.add(this.FilterBookmarkAllocateModalService.loadContainersByString(params).subscribe((response) => {
            this.containers = response.containers;
            this.cdr.markForCheck();
        }));
    }

    public hideModal() {
        this.modalService.toggle({
            show: false,
            id: 'bookmarkAllocateModal'
        });
        this.cleanup();
    }

    protected loadElements(): void {
        if (!this.bookmark || !this.filterBookmarkAllocation) {
            return;
        }

        if (this.filterBookmarkAllocation.container_id < 1) {
            return;
        }

        this.subscriptions.add(this.FilterBookmarkAllocateModalService.loadElementsByContainerId(this.filterBookmarkAllocation.container_id, this.plugin, this.controller, this.action).subscribe((response) => {
            this.users = response.users;
            this.usergroups = response.usergroups;

            this.cdr.markForCheck();
        }));
    }

    protected createAllocation() {
        if (!this.filterBookmarkAllocation) {
            return;
        }
        //console.log(this.filterBookmarkAllocation);

        this.subscriptions.add(this.FilterBookmarkAllocateModalService.addBookmarkAllocation(this.filterBookmarkAllocation).subscribe((response) => {
            this.cdr.markForCheck();
            //console.log(response);

            if (response.success) {
                const data = response.data.allocation as allocatedFilterbookmark;
                if(this.filterBookmarkAllocation && data) {
                    this.filterBookmarkAllocation.id = data.id;
                }

                const title = this.TranslocoService.translate('Filter bookmark allocation');
                const msg = this.TranslocoService.translate('created successfully');
                const url = ['FilterBookmarkAllocations', 'edit', data.id];

                this.notyService.genericSuccess(msg, title, url);
                this.errors = null;
                this.mode = 'edit';

                this.modalService.toggle({
                    show: false,
                    id: 'bookmarkAllocateModal'
                });
                return;
            }

            // Error
            this.notyService.genericError();
            const errorResponse: GenericValidationError = response.data as GenericValidationError;
            if (response) {
                this.errors = errorResponse;
            }
        }));
    }
    protected deleteAllocation() {
        if (!this.filterBookmarkAllocation) {
            return;
        }

        if (!this.filterBookmarkAllocation.id) {
            return;
        }

        this.subscriptions.add(this.FilterBookmarkAllocateModalService.deleteBookmarkAllocation(this.filterBookmarkAllocation.id).subscribe((response) => {
            this.cdr.markForCheck();

            const title = this.TranslocoService.translate('Bookmark allocation');
            const msg = this.TranslocoService.translate('deleted successfully');

            this.notyService.genericSuccess(msg, title);
            this.filterBookmarkAllocation = undefined;


            this.modalService.toggle({
                show: false,
                id: 'bookmarkAllocateModal'
            });
            this.mode = 'add';
            this.filterBookmarkAllocation = {
                container_id: 0,
                filter_bookmark_id: this.bookmark.id,
                name: this.bookmark.name,
                users: {
                    _ids: []
                },
                usergroups: {
                    _ids: [],
                }
            };

           // this.triggerReloadEvent.emit(true);
        }));
    }

    public updateAllocation() {
        if (!this.bookmark || !this.bookmark.filter_bookmark_allocation || !this.filterBookmarkAllocation) {
            return;
        }

        this.subscriptions.add(this.FilterBookmarkAllocateModalService.editBookmarkAllocation(this.filterBookmarkAllocation).subscribe((response) => {
            this.cdr.markForCheck();

            if (response.success) {
                const data = response.data.allocation as allocatedFilterbookmark;

                const title = this.TranslocoService.translate('Bookmark allocation');
                const msg = this.TranslocoService.translate('updated successfully');
                this.notyService.genericSuccess(msg, title);
                this.errors = null;

                this.modalService.toggle({
                    show: false,
                    id: 'bookmarkAllocateModal'
                });

                return;
            }

            // Error
            this.notyService.genericError();
            const errorResponse: GenericValidationError = response.data as GenericValidationError;
            if (response) {
                this.errors = errorResponse;
            }
        }));
    }

    protected cleanup() {
        if (!this.filterBookmarkAllocation || !this.originalFilterBookmarkAllocation) {
            return;
        }
        this.filterBookmarkAllocation = this.originalFilterBookmarkAllocation;
        this.cdr.markForCheck();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}

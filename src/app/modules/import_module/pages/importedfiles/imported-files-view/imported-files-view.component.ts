import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    DropdownItemDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ImportedFilesViewRoot } from '../imported-files.interface';
import { Subscription } from 'rxjs';
import { ImportedFilesService } from '../imported-files.service';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { AgentHttpClientErrors } from '../../../../../pages/agentconnector/agentconnector.enums';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'oitc-imported-files-view',
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
        DebounceDirective,
        DeleteAllModalComponent,
        DropdownDividerDirective,
        DropdownItemDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        ItemSelectComponent,
        LabelLinkComponent,
        MatSort,
        MatSortHeader,
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
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        BlockLoaderComponent,
        BackButtonDirective
    ],
    templateUrl: './imported-files-view.component.html',
    styleUrl: './imported-files-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportedFilesViewComponent implements OnInit, OnDestroy {
    public importedfile?: ImportedFilesViewRoot;
    public isLoading: boolean = true;
    public fileNotFound: boolean = false;
    public fileIsEmpty: boolean = false;

    private subscriptions: Subscription = new Subscription();
    private readonly ImportedFilesService = inject(ImportedFilesService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            const id = Number(this.route.snapshot.paramMap.get('id'));

            this.loadImportedFile(id);
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadImportedFile(id: number) {

        const sub = this.ImportedFilesService.getView(id).subscribe({
            next: (response: ImportedFilesViewRoot) => {
                //console.log(value); // Serve result with the new copied commands
                // 200 ok
                this.isLoading = false;
                this.importedfile = response;

                if (response.filecontent === false) {
                    this.fileNotFound = true;
                }

                if (Array.isArray(response.filecontent) && response.filecontent.length === 0) {
                    this.fileIsEmpty = true;
                }

                this.cdr.markForCheck();
            },
            error: (error: HttpErrorResponse) => {

                this.isLoading = false;
                this.fileNotFound = error.error.filecontent === false;

                if (Array.isArray(error.error.filecontent) && error.error.filecontent.length === 0) {
                    this.fileIsEmpty = true;
                }

                this.cdr.markForCheck();
            }
        });
        this.subscriptions.add(sub);
    }

    protected readonly AgentHttpClientErrors = AgentHttpClientErrors;
}

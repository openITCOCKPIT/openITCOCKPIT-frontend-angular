import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';


import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleDirective,
  NavComponent,
  NavItemComponent,
  TableDirective
} from '@coreui/angular';


import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';






import { PermissionDirective } from '../../../../../permissions/permission.directive';


import { TranslocoDirective } from '@jsverse/transloco';
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
    imports: [
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormsModule,
    NavComponent,
    NavItemComponent,
    PermissionDirective,
    ReactiveFormsModule,
    TableDirective,
    TranslocoDirective,
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

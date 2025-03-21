import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTextDirective,
    CardTitleDirective,
    ColComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective,
    RowComponent
} from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import { Subscription } from 'rxjs';
import { DocumentationWikiRecord, DocumentationWikiRecordResponse } from '../documentations.interface';
import { DocumentationsService } from '../documentations.service';
import { NgIf } from '@angular/common';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';

@Component({
    selector: 'oitc-documentations-wiki',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        RouterLink,
        CardBodyComponent,
        RowComponent,
        ColComponent,
        CardTextDirective,
        XsButtonDirective,
        BlockLoaderComponent,
        NgIf,
        ButtonCloseDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ModalToggleDirective,
        TrustAsHtmlPipe
    ],
    templateUrl: './documentations-wiki.component.html',
    styleUrl: './documentations-wiki.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentationsWikiComponent implements OnInit, OnDestroy {

    public records: DocumentationWikiRecord[] = [];
    public modalRecord?: DocumentationWikiRecordResponse;

    private readonly subscriptions: Subscription = new Subscription();
    private readonly DocumentationsService: DocumentationsService = inject(DocumentationsService);
    private readonly modalService: ModalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.DocumentationsService.getWiki().subscribe(response => {
            for (const key in response.documentations.additional_help.children) {
                this.records.push({
                    name: response.documentations.additional_help.children[key].name,
                    description: response.documentations.additional_help.children[key].description,
                    file: response.documentations.additional_help.children[key].file,
                    icon: response.documentations.additional_help.children[key].icon
                });
            }

            this.cdr.markForCheck();

        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public showDocumentation(categoryName: string, documentationKey: string) {
        this.subscriptions.add(this.DocumentationsService.getWikiRecord(categoryName, documentationKey).subscribe(response => {
            this.modalRecord = response;

            this.modalService.toggle({
                show: true,
                id: 'wikiModalRecord'
            });

            this.cdr.markForCheck();
        }));
    }

}

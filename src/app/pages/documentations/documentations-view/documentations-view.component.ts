import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { DocumentationsService } from '../documentations.service';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DocumentationView } from '../documentations.interface';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { BbCodeParserService } from '../../../services/bb-code-parser.service';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';


@Component({
    selector: 'oitc-documentations-view',
    standalone: true,
    imports: [
        CoreuiComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormDirective,
        FormsModule,
        NavComponent,
        ObjectUuidComponent,
        PermissionDirective,
        ReactiveFormsModule,
        TranslocoDirective,
        RouterLink,
        BackButtonDirective,
        XsButtonDirective,
        NgIf,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        CardBodyComponent,
        RowComponent,
        ColComponent,
        NavItemComponent,
        TrustAsHtmlPipe,
        FormLoaderComponent
    ],
    templateUrl: './documentations-view.component.html',
    styleUrl: './documentations-view.component.css'
})
export class DocumentationsViewComponent implements OnInit, OnDestroy {

    public documentation: DocumentationView | undefined;
    public uuid: string = '';
    public type: string = 'unknown';
    public html: string | undefined;

    private DocumentationsService = inject(DocumentationsService);
    private BbCodeParserService = inject(BbCodeParserService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private subscriptions: Subscription = new Subscription();


    public ngOnInit() {
        this.uuid = String(this.route.snapshot.paramMap.get('uuid'));
        this.type = String(this.route.snapshot.paramMap.get('type'));
        this.subscriptions.add(this.DocumentationsService.getView(this.uuid, this.type)
            .subscribe((result) => {
                this.documentation = result;

                if (this.documentation.docuExists) {
                    this.html = this.BbCodeParserService.parse(this.documentation.bbcode);
                }

            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}

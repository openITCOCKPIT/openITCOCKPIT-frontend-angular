import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DocumentationView } from '../documentations.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BbCodeParserService } from '../../../services/bb-code-parser.service';
import { DocumentationsService } from '../documentations.service';
import { DropdownColorpickerComponent } from '../dropdown-colorpicker/dropdown-colorpicker.component';
import { BbCodeEditorComponent } from '../bb-code-editor/bb-code-editor.component';


@Component({
    selector: 'oitc-documentations-edit',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        NgSwitchCase,
        RowComponent,
        TranslocoDirective,
        TrustAsHtmlPipe,
        XsButtonDirective,
        NgSwitch,
        RouterLink,
        DropdownComponent,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownItemDirective,
        NgForOf,
        NgStyle,
        DropdownColorpickerComponent,
        BbCodeEditorComponent,
        NgSwitchDefault
    ],
    templateUrl: './documentations-edit.component.html',
    styleUrl: './documentations-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentationsEditComponent implements OnInit, OnDestroy {

    public documentation: DocumentationView | undefined;
    public type: string = 'unknown';
    public uuid: string = '';
    public html: string | undefined;


    private DocumentationsService = inject(DocumentationsService);
    private BbCodeParserService = inject(BbCodeParserService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit() {
        this.uuid = String(this.route.snapshot.paramMap.get('uuid'));
        this.type = String(this.route.snapshot.paramMap.get('type'));

        this.cdr.markForCheck();

        this.subscriptions.add(this.DocumentationsService.getView(this.uuid, this.type)
            .subscribe((result) => {
                this.cdr.markForCheck();

                this.documentation = result;

                if (this.documentation.docuExists) {
                    this.html = this.BbCodeParserService.parse(this.documentation.bbcode);
                }

            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public saveDocumentation() {
        if (this.documentation) {
            this.subscriptions.add(this.DocumentationsService.save(this.uuid, this.type, this.documentation.bbcode)
                .subscribe((result) => {
                    this.cdr.markForCheck();
                    if (result) {
                        this.notyService.genericSuccess();
                        this.router.navigate(['/', 'documentations', 'view', this.uuid, this.type]);
                    }
                }));
        }
    }
}

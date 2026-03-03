import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DocumentationView } from '../documentations.interface';

import { BbCodeParserService } from '../../../services/bb-code-parser.service';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import {
    HostBrowserMenuConfig,
    HostsBrowserMenuComponent
} from '../../hosts/hosts-browser-menu/hosts-browser-menu.component';
import {
    ServiceBrowserMenuConfig,
    ServicesBrowserMenuComponent
} from '../../services/services-browser-menu/services-browser-menu.component';


@Component({
    selector: 'oitc-documentations-view',
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormsModule,
        NavComponent,
        ReactiveFormsModule,
        TranslocoDirective,
        RouterLink,
        BackButtonDirective,
        XsButtonDirective,
        CardBodyComponent,
        RowComponent,
        ColComponent,
        NavItemComponent,
        TrustAsHtmlPipe,
        FormLoaderComponent,
        HostsBrowserMenuComponent,
        ServicesBrowserMenuComponent
    ],
    templateUrl: './documentations-view.component.html',
    styleUrl: './documentations-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentationsViewComponent implements OnInit, OnDestroy {

    public documentation: DocumentationView | undefined;
    public uuid: string = '';
    public type: string = 'unknown';
    public html: string | undefined;

    public hostBrowserConfig?: HostBrowserMenuConfig;
    public serviceBrowserConfig?: ServiceBrowserMenuConfig;


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

                if (this.type === 'host') {
                    this.hostBrowserConfig = {
                        hostId: result.objectId,
                        showReschedulingButton: false,
                        showBackButton: true
                    };
                }

                if (this.type === 'service') {
                    this.serviceBrowserConfig = {
                        serviceId: result.objectId,
                        showReschedulingButton: false,
                        showBackButton: true
                    };
                }

                if (this.documentation.docuExists) {
                    this.html = this.BbCodeParserService.parse(this.documentation.bbcode);
                }

            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}

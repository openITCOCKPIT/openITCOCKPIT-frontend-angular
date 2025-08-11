import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    ColComponent,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TemplateIdDirective
} from '@coreui/angular';
import { WizardsService } from '../wizards.service';
import { DeprecatedWizards, WizardsIndex } from '../wizards.interface';
import { KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';


import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';

import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';

@Component({
    selector: 'oitc-wizards-index',
    imports: [
        RowComponent,
        ColComponent,
        NgIf,
        NgForOf,
        KeyValuePipe,
        CardComponent,
        CardBodyComponent,
        CardFooterComponent,
        FaIconComponent,
        TranslocoDirective,
        RouterLink,
        CardHeaderComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        ButtonGroupComponent,
        NgClass,
        BadgeOutlineComponent,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective,
        AccordionButtonDirective
    ],
    templateUrl: './wizards-index.component.html',
    styleUrl: './wizards-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardsIndexComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly WizardsService: WizardsService = inject(WizardsService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected filter: any = {
        Category: {
            linux: true,
            windows: true,
            database: true,
            mail: true,
            network: true,
            docker: true,
            macos: true,
            virtualization: true,
            hardware: true
        }
    }

    protected result?: WizardsIndex;

    protected deprecatedWizards: DeprecatedWizards = {
        deprecatedWizards: {},
        possibleDeprecatedWizards: {}
    };
    protected deprecatedWizardsTitles: { [key: string]: string } = {};

    protected deprecatedTitle = this.TranslocoService.translate('deprecated');

    public ngOnInit() {
        this.loadWizards();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private loadWizards(): void {
        this.subscriptions.add(this.WizardsService.getIndex()
            .subscribe((result: WizardsIndex) => {
                this.result = result;
                const regex = new RegExp('- ' + this.deprecatedTitle, 'i');
                for (let wizardType in this.result.wizards) {
                    let title = this.result.wizards[wizardType].title;
                    if (title.toLowerCase().includes(('- ' + this.deprecatedTitle).toLowerCase())) {
                        title = title.replace(regex, '');
                        this.deprecatedWizards.deprecatedWizards[wizardType] = this.result.wizards[wizardType];
                        this.deprecatedWizardsTitles[wizardType] = title;
                        delete this.result.wizards[wizardType]; // Remove deprecated wizards from the main list
                    }
                }
                for (let wizardType in this.result.possibleWizards) {
                    let title = this.result.possibleWizards[wizardType].title;
                    if (title.toLowerCase().includes(('- ' + this.deprecatedTitle)).toLowerCase()) {
                        title = title.replace(regex, '');
                        this.deprecatedWizards.possibleDeprecatedWizards[wizardType] = this.result.possibleWizards[wizardType];
                        this.deprecatedWizardsTitles[wizardType] = title;
                        delete this.result.possibleWizards[wizardType]; // Remove deprecated wizards from the main list
                    }
                }
                this.cdr.markForCheck();
            }))
    }

    protected filterByCategory(categories: string[]): boolean {
        // Traverse all categories

        for (let i = 0; i < categories.length; i++) {
            if (this.filter.Category[categories[i]]) {
                return true;
            }
        }
        return false;
    }

}

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
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TemplateIdDirective,
    TooltipDirective
} from '@coreui/angular';
import { WizardsService } from '../wizards.service';
import { DeprecatedWizards, WizardElement, WizardsIndex } from '../wizards.interface';
import { KeyValuePipe, NgClass } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-wizards-index',
    imports: [
        RowComponent,
        ColComponent,
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
        AccordionButtonDirective,
        FormControlDirective,
        FormsModule,
        TooltipDirective,
        InputGroupComponent,
        InputGroupTextDirective
    ],
    templateUrl: './wizards-index.component.html',
    styleUrl: './wizards-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardsIndexComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly WizardsService: WizardsService = inject(WizardsService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected filter: any = {
        search: '',
        Category: {
            linux: true,
            windows: true,
            database: true,
            mail: true,
            network: true,
            docker: true,
            macos: true,
            virtualization: true,
            hardware: true,
            webserver: true
        }
    }

    protected result?: WizardsIndex;

    protected deprecatedWizards: DeprecatedWizards = {
        deprecatedWizards: {},
        possibleDeprecatedWizards: {}
    };

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
                for (let wizardType in this.result.wizards) {
                    if (!this.result.wizards[wizardType].active) {
                        this.deprecatedWizards.deprecatedWizards[wizardType] = this.result.wizards[wizardType];
                        delete this.result.wizards[wizardType]; // Remove deprecated wizards from the main list
                    }
                }
                for (let wizardType in this.result.possibleWizards) {
                    if (!this.result.possibleWizards[wizardType]) {
                        this.deprecatedWizards.possibleDeprecatedWizards[wizardType] = this.result.possibleWizards[wizardType];
                        delete this.result.possibleWizards[wizardType]; // Remove deprecated wizards from the main list
                    }
                }
                this.cdr.markForCheck();
            }))
    }

    /**
     * I will decide whether the given wizard is shown or not.
     * @param wizard
     * @return boolean: True, if the wizard should be hidden.
     * @protected
     */
    protected hidden(wizard: WizardElement): boolean {
        let searchTerm: string = this.filter.search?.toLowerCase();
        if (searchTerm) {
            let inTitle: boolean = wizard.title.toLowerCase().includes(searchTerm),
                inDescription: boolean = wizard.description.toLowerCase().includes(searchTerm),
                inCategory: boolean = wizard.category?.join(' ').toLowerCase().includes(searchTerm);
            if (!inTitle && !inDescription && !inCategory) {
                return true;
            }
        }

        return !wizard.category.some(cat => this.filter.Category[cat]);
    }

}

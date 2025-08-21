import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    EventEmitter,
    inject,
    Input,
    input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChildren,
} from '@angular/core';
import {
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    TemplateIdDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { Service } from '../../../pages/wizards/wizards.interface';
import { GenericValidationError } from '../../../generic-responses';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';

@Component({
    selector: 'oitc-wizards-dynamicfields',
    imports: [
        ColComponent,
        FaIconComponent,
        FormCheckInputDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        NgForOf,
        NgIf,
        NgSelectComponent,
        RowComponent,
        TranslocoPipe,
        TranslocoDirective,
        FormFeedbackComponent,
        NgClass,
        FormCheckLabelDirective,
        FormCheckComponent,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective,
        AccordionButtonDirective
    ],
    templateUrl: './wizards-dynamicfields.component.html',
    styleUrl: './wizards-dynamicfields.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardsDynamicfieldsComponent implements OnChanges {
    @ViewChildren('accordionItem') accordionItems: AccordionItemComponent[] = [];

    public cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected searchedTags: string[] = [];

    public title = input.required<string>();
    public titleErrorField = input<string>('');
    public checked: boolean = false;
    public accordionClosed: boolean = true;

    @Input() post: Service[] = [];
    @Input() errors: GenericValidationError = {} as GenericValidationError;
    @Output() postChange = new EventEmitter<Service[]>();

    constructor() {
        effect(() => {
            this.cdr.markForCheck();
        });
    }

    public hasName = (name: string): boolean => {
        if (this.searchedTags.length === 0) {
            return true;
        }
        return this.searchedTags.some((tag) => {
            return name.toLowerCase().includes(tag.toLowerCase());
        });
    }

    protected toggleCheck(checked: boolean): void {
        this.checked = checked;
        this.post.forEach((service: Service) => {
            if (!this.hasName(service.name)) {
                return;
            }
            service.createService = this.checked;
        });
        this.cdr.markForCheck();
    }

    protected toggleAccordionClose(checked: boolean): void {
        this.accordionClosed = checked;
        this.accordionItems.forEach((accordionItem: AccordionItemComponent) => {
            if ((accordionItem.visible && this.accordionClosed) || (!accordionItem.visible && !this.accordionClosed)) {
                accordionItem.toggleItem();
            }
        });
        this.cdr.markForCheck();
    }

    protected detectColor = function (label: string): string {
        if (label.match(/warning/gi)) {
            return 'warning';
        }

        if (label.match(/critical/gi)) {
            return 'critical';
        }

        return '';
    };

    public ngOnChanges(changes: SimpleChanges): void {
        this.cdr.markForCheck();
    }
}

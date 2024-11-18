import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { OitcColors, OitcIconBases } from '../../oitc.types';
import { JsonPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { IconLookup } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-alert',
    standalone: true,
    imports: [
        NgClass,
        NgTemplateOutlet,
        JsonPipe
    ],
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})


/**
 * AlertComponent Usage examples
 *
 * Icons can be set using the FontAwesome IconProp type. For example:
 * [icon]="'exclamation-triangle'"
 * [icon]="['fas', 'exclamation-triangle']"
 * [icon]="{prefix: 'fas', iconName: 'exclamation-triangle'}"
 *
 *
 *
 * Usage examples
 *
 * Default Alert
 *                 <oitc-alert
 *                     color="primary"
 *                     baseIcon="square"
 *                     [icon]="['fas', 'exclamation-triangle']"></oitc-alert>
 *
 *
 * Default Alert - with custom messages
 *                 <oitc-alert
 *                     color="danger"
 *                     baseIcon="circle"
 *                     [icon]="['fas', 'bomb']"
 *                     [errorHeadline]="'Panic'"
 *                     [errorText]="'Everything is broken 🤯'"></oitc-alert>
 *
 * Alert with custom templates and controls
 *                 <ng-template #contentTemplate let-data>
 *                     <span class="h5" [ngClass]="['text-'+data.color]" *ngIf="data">
 *                         Take the headline from a custom template
 *                     </span>
 *                     <br>
 *                     Lot of space for custom elements or text
 *
 *                     <div class="mt-2">
 *                         <p-progressBar mode="indeterminate"
 *                                        [style]="{ height: '6px' }"/>
 *                     </div>
 *
 *                 </ng-template>
 *
 *                 <ng-template #buttonTemplate let-data>
 *                     <div class="ms-2" *ngIf="data">
 *                         <button class="btn btn-sm ripple" [ngClass]="'btn-outline-'+data.color">
 *                             Go Search
 *                         </button>
 *                     </div>
 *
 *                 </ng-template>
 *
 *                 <oitc-alert
 *                     baseIcon="shield"
 *                     color="success"
 *                     [icon]="['fas', 'hat-wizard']"
 *                     [contentTemplate]="contentTemplate"
 *                     [buttonTemplate]="buttonTemplate"></oitc-alert>
 *
 */
export class OitcAlertComponent implements AfterContentInit {

    public color = input<OitcColors>('primary');
    public baseIcon = input<OitcIconBases>('circle');
    public icon = input<IconProp>(['fas', 'exclamation-triangle']);
    public iconClass = input<string>('text-white');

    public errorHeadline = input<string>('Error');
    public errorText = input<string>('An error occurred');

    // Inputs for the user to pass custom templates
    public contentTemplate = input<TemplateRef<any> | null>(null);
    public buttonTemplate = input<TemplateRef<any> | null>(null);

    // Load the default templates from alert.component.html
    @ViewChild('defaultContentTemplate', {static: true}) private defaultContentTemplate!: TemplateRef<any>;
    @ViewChild('defaultButtonTemplate', {static: true}) private defaultButtonTemplate!: TemplateRef<any>;

    // Variables for the alert.component.html template, that will hold the custom template or the default one
    // if no custom template is passed.
    protected useContentTemplate!: TemplateRef<any>;
    protected useButtonTemplate!: TemplateRef<any>;

    // This will be used in the template.
    protected templateIcon: string[] = ['fas', 'fa-exclamation-triangle'];

    private cdr = inject(ChangeDetectorRef);
    private templates: string[] = ["content", "button"];

    constructor() {
        effect(() => {
            this.cdr.markForCheck();

            // IconProp can be a string[IconName], array[IconPrefix, IconName] or object[IconLookup]
            // We need to add "fa-" prefix if it's not already there because the template
            // uses a traditional <i class="fas fa-exclamation-triangle"></i> syntax
            let icon = this.icon();
            if (typeof icon === 'string') {
                // Icon is a string, add default prefix
                if (!icon.startsWith('fa-')) {
                    icon = 'fa-' + icon;
                }

                this.templateIcon = ['fas', icon];
            } else if (Array.isArray(icon)) {
                // Icon is an array, use it as is
                const prefix = icon[0];
                let iconName = icon[1];
                if (!iconName.startsWith('fa-')) {
                    iconName = 'fa-' + iconName;
                }
                this.templateIcon = [prefix, iconName];
            } else {
                const iconObj = icon as IconLookup;
                let iconName = iconObj.iconName;
                if (!iconName.startsWith('fa-')) {
                    iconName = 'fa-' + iconName;
                }

                this.templateIcon = [iconObj.prefix, iconName];
            }

            // Add the iconClass to the templateIcon array
            this.templateIcon.push(this.iconClass());
        });
    }


    public ngAfterContentInit(): void {

        this.useContentTemplate = this.defaultContentTemplate;
        if (this.contentTemplate() && this.contentTemplate() !== null) {
            // User passed a content template - overwrite the default one
            this.useContentTemplate = this.contentTemplate() as TemplateRef<any>;
            this.cdr.markForCheck();
        }

        this.useButtonTemplate = this.defaultButtonTemplate;
        if (this.buttonTemplate() && this.buttonTemplate() !== null) {
            // User passed a button template - overwrite the default one
            this.useButtonTemplate = this.buttonTemplate() as TemplateRef<any>;
            this.cdr.markForCheck();
        }
    }

}

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    Output
} from '@angular/core';
import { DropdownColorpickerComponent } from '../dropdown-colorpicker/dropdown-colorpicker.component';
import {
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    RowComponent
} from '@coreui/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective } from '@jsverse/transloco';

import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { DocumentationLink } from '../documentations.interface';
import { NgIf } from '@angular/common';


@Component({
    selector: 'oitc-bb-code-editor',
    imports: [
        DropdownColorpickerComponent,
        FormControlDirective,
        ReactiveFormsModule,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        FaIconComponent,
        XsButtonDirective,
        TranslocoDirective,
        FormsModule,
        ModalToggleDirective,
        ModalComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ButtonCloseDirective,
        ModalBodyComponent,
        RowComponent,
        ColComponent,
        FormLabelDirective,
        RequiredIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        ModalFooterComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NgIf
    ],
    templateUrl: './bb-code-editor.component.html',
    styleUrl: './bb-code-editor.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BbCodeEditorComponent {
    public colors: string[] = [
        '#00C851',
        '#ffbb33',
        '#CC0000',
        '#727b84',
        '#9ccc65',
        '#ffd54f',
        '#ff4444',
        '#33b5e5',
        '#007E33',
        '#FF8800',
        '#ff5722',
        '#0099CC',
        '#2E2E2E',
        '#4B515D',
        '#aa66cc',
        '#4285F4'
    ];

    @Input() bbcode: string = '';
    @Input() isDisplayedAsModal: boolean = true; // to display the editor as a modal or above the editor (because link modal is not working in modal)
    @Output() bbcodeChange = new EventEmitter<string>();

    private selectionStart: number = 0;
    private selectionEnd: number = 0;
    public selectedText: string = '';
    public link: DocumentationLink = {
        url: '',
        targetBlank: true
    };
    public isLinkAreaOpen: boolean = false; //needed to show the link area if isDisplayedAsModal is false

    private cdr = inject(ChangeDetectorRef);

    public updateBbcode(newBbcode: string) {
        this.bbcode = newBbcode;
        this.bbcodeChange.emit(newBbcode);
        this.cdr.markForCheck();
    }

    public selection(ev: any) {
        this.selectionStart = ev.target.selectionStart;
        this.selectionEnd = ev.target.selectionEnd;
        this.selectedText = ev.target.value.substring(this.selectionStart, this.selectionEnd);
    }

    public surroundSelectedText(task: string) {
        switch (task) {
            case 'bold':
                this.updateBbcode(this.doSurrounding('[b]', '[/b]'));
                break;

            case 'italic':
                this.updateBbcode(this.doSurrounding('[i]', '[/i]'));
                break;

            case 'underline':
                this.updateBbcode(this.doSurrounding('[u]', '[/u]'));
                break;

            case 'align-left':
                this.updateBbcode(this.doSurrounding('[left]', '[/left]'));
                break;

            case 'align-center':
                this.updateBbcode(this.doSurrounding('[center]', '[/center]'));
                break;

            case 'align-right':
                this.updateBbcode(this.doSurrounding('[right]', '[/right]'));
                break;

            case 'align-justify':
                this.updateBbcode(this.doSurrounding('[justify]', '[/justify]'));
                break;
        }
    }

    public surroundSelectedTextWithColor(color: string) {
        this.updateBbcode(this.doSurrounding(`[color='${color}']`, '[/color]'));
    }

    public insertLink() {
        const newTab = this.link.targetBlank ? 'tab' : '';
        this.updateBbcode(this.doSurrounding(`[url='${this.link.url}' ${newTab}]`, '[/url]'));
        this.isLinkAreaOpen = false;
    }

    public resetLink() {
        this.link = {
            url: '',
            targetBlank: true
        }
        this.isLinkAreaOpen = false;
    };

    public surroundSelectedTextWithFontSize(size: string) {
        this.updateBbcode(this.doSurrounding(`[text='${size}']`, '[/text]'));
    }

    private doSurrounding(before: string, after: string): string {
        return this.bbcode.substring(0, this.selectionStart) +
            before + this.selectedText + after +
            this.bbcode.substring(this.selectionEnd)
    }

    protected onLinkUrlInputChange(newUrl: string) {
        if (this.selectionStart === this.selectionEnd) {
            this.selectedText = newUrl;
        }
        this.cdr.markForCheck();
    }

}

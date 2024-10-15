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
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf } from '@angular/common';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { DocumentationLink } from '../documentations.interface';
import { DebounceDirective } from '../../../directives/debounce.directive';

@Component({
    selector: 'oitc-bb-code-editor',
    standalone: true,
    imports: [
        DropdownColorpickerComponent,
        FormControlDirective,
        FormErrorDirective,
        ReactiveFormsModule,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        FaIconComponent,
        NgForOf,
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
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        ModalFooterComponent,
        InputGroupComponent,
        InputGroupTextDirective
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
    @Output() bbcodeChange = new EventEmitter<string>();

    private selectionStart: number = 0;
    private selectionEnd: number = 0;
    public selectedText: string = '';
    public link: DocumentationLink = {
        url: '',
        targetBlank: true
    };

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
    }

    public resetLink() {
        this.link = {
            url: '',
            targetBlank: true
        }
    };

    public surroundSelectedTextWithFontSize(size: string) {
        this.updateBbcode(this.doSurrounding(`[text='${size}']`, '[/text]'));
    }

    private doSurrounding(before: string, after: string): string {
        return this.bbcode.substring(0, this.selectionStart) +
            before + this.selectedText + after +
            this.bbcode.substring(this.selectionEnd)
    }

}

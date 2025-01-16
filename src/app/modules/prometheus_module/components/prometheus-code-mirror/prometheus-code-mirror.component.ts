import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    inject,
    Input,
    numberAttribute,
    OnDestroy,
    ViewChild
} from '@angular/core';
import { PromQLExtension } from '@prometheus-io/codemirror-promql';
import { basicSetup, EditorView } from 'codemirror';
import { EditorState, StateEffect, StateField } from '@codemirror/state';
import { DecorationSet, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { oneDark } from '@codemirror/theme-one-dark';
import { LayoutService } from '../../../../layouts/coreui/layout.service';
import { CodeMirrorUpdateType } from '../../../../components/code-mirror-container/code-mirror-update-type';
import { AutocompleteItem } from '../../../../components/code-mirror-container/code-mirror-container.interface';
import { autocompletion, completeFromList, Completion } from '@codemirror/autocomplete';

const promQL = new PromQLExtension()

@Component({
    selector: 'oitc-prometheus-code-mirror',
    imports: [],
    templateUrl: './prometheus-code-mirror.component.html',
    styleUrl: './prometheus-code-mirror.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrometheusCodeMirrorComponent implements AfterViewInit, OnDestroy {
    @ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLDivElement>;
    @ContentChild(NgModel) textareaModel!: NgModel;
    private editor!: EditorView;
    private customHighlightExtension!: StateField<DecorationSet>[];
    private autocompleteExtension: any;
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly LayoutService: LayoutService = inject(LayoutService);
    private cdr = inject(ChangeDetectorRef);

    private theme: 'light' | 'dark' = 'light';

    constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = theme;
        }));
    }

    // border focus style
    // only this way is possible, because codemirror overwrites the set css classes
    private borderFocusStyle = EditorView.theme({
        "&.cm-editor.cm-focused": {
            borderColor: '#acabeb',
            outline: 0,
            boxShadow: '0 0 0 0.25rem rgba(88, 86, 214, 0.25)'
        }
    });

    private formControlStyle = EditorView.editorAttributes.of({class: "form-control"});

    private baseExtensions = [
        this.formControlStyle,
        this.borderFocusStyle,
        basicSetup,
        keymap.of([...defaultKeymap])
    ];

    @Input({transform: numberAttribute}) rows: number = 6;


    //Macros are overwriting highlightPatterns and autocompleteWords from user

    ngAfterViewInit() {
        const textarea = this.containerRef.nativeElement.querySelector('textarea');

        if (textarea) {

            if (this.textareaModel !== undefined && this.textareaModel !== null && this.textareaModel.valueChanges !== undefined && this.textareaModel.valueChanges !== null) {
                this.subscriptions.add(
                    this.textareaModel.valueChanges.subscribe(newValue => {
                        // update codemirror if the value of the textarea changes
                        if (newValue !== this.editor.state.doc.toString()) {
                            this.updateCodemirrorExtension(CodeMirrorUpdateType.MACROS);
                        }
                    })
                );
            }

            let updateValueChangeCodemirrorListener = this.setUpdateValueChangeCodemirrorListener();

            //  this.autocompleteExtension = this.createAutoCompleteExtension(this._autocompleteWords);


            if (this.theme === 'dark') {
                this.baseExtensions.push(oneDark);
            }

            const state = EditorState.create({
                doc: textarea.value,
                extensions: [
                    this.baseExtensions,
                    promQL.asExtension(),
                ],
            });

            this.editor = new EditorView({
                state,
                parent: this.containerRef.nativeElement,
            });

            // Set the number of rows
            const lineHeight = 21.5;
            const numberOfRows = this.rows;
            this.editor.dom.style.height = `${lineHeight * numberOfRows}px`;

            // hide textarea
            textarea.style.display = 'none';
        } else {
            console.warn(this.TranslocoService.translate('Could not find textarea'));
        }
    }


    // create autocompletion based on the given list
    private createAutoCompleteExtension(autocompleteWords: AutocompleteItem[]) {
        const completions: Completion[] = autocompleteWords.map((item) => ({
            label: item.value,
            detail: item.description,
            type: 'variable',
        }));
        return autocompletion({
            override: [completeFromList(completions)],
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    // sets the listener that updates changes in the codemirror with the textarea
    private setUpdateValueChangeCodemirrorListener() {
        const textarea = this.containerRef.nativeElement.querySelector('textarea');

        let updateValueChangeCodemirrorListener;

        if (textarea) {
            // listener that updates changes in the codemirror with the textarea
            updateValueChangeCodemirrorListener = EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    textarea.value = this.editor.state.doc.toString();
                    textarea.dispatchEvent(new Event('input'));
                }
            });

        }
        return updateValueChangeCodemirrorListener;
    }


    // update the codemirror extension based on the given value
    private updateCodemirrorExtension(updateType: string) {
        this.cdr.markForCheck();

        switch (updateType) {
            case CodeMirrorUpdateType.HIGHLIGHT:
                break
            case CodeMirrorUpdateType.AUTOCOMPLETE:
                break;
            case CodeMirrorUpdateType.MACROS:
                break;
            default:
                break;
        }

        let updateValueChangeCodemirrorListener = this.setUpdateValueChangeCodemirrorListener();

        if (this.editor !== undefined && this.editor !== null) {
            this.editor.dispatch({
                changes: {from: 0, to: this.editor.state.doc.length, insert: this.textareaModel.value},
                effects: StateEffect.reconfigure.of([this.baseExtensions, this.autocompleteExtension, this.customHighlightExtension, updateValueChangeCodemirrorListener]),
            });
        }
    }


}

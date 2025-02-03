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
import { EditorState, Extension, StateEffect } from '@codemirror/state';
import { PromQLExtension } from '@prometheus-io/codemirror-promql';
import { basicSetup, EditorView } from 'codemirror';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { autocompletion, completeFromList, Completion, } from '@codemirror/autocomplete';
import {
    AutocompleteItem,
    DefaultMacros,
    Macros
} from '../../../../../app/components/code-mirror-container/code-mirror-container.interface';
import { MacroIndex } from "../../../../pages/macros/macros.interface";
import { NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { oneDark } from '@codemirror/theme-one-dark';
import { LayoutService } from '../../../../layouts/coreui/layout.service';
import { CodeMirrorUpdateType } from '../../../../components/code-mirror-container/code-mirror-update-type';

const promQL = new PromQLExtension()
promQL.setComplete({
    remote: {
        apiPrefix: '/prometheus_module/prometheusQuery/proxy'
    }
});


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
    private autocompleteExtension: any;
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly LayoutService = inject(LayoutService);
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

    private defaultMacros: DefaultMacros[] = [];
    private _macros: MacroIndex[] = [];
    @Input({transform: numberAttribute}) rows: number = 6;


    @Input() set autocompleteWords(autocompleteWords: AutocompleteItem[]) {
        this.updateCodemirrorExtension(CodeMirrorUpdateType.AUTOCOMPLETE);
    };

    @Input() set macros(macros: DefaultMacros[] | MacroIndex[] | Macros) {

        if (Array.isArray(macros)) {
            if (macros.length === 0) {
                this.defaultMacros = [];
                this._macros = [];
            } else if (this.isDefaultMacros(macros[0])) {
                this.defaultMacros = macros as DefaultMacros[];
            } else if (this.isMacroIndex(macros[0])) {
                this._macros = macros as MacroIndex[];
            }
        } else if (this.isMacros(macros)) {
            this.defaultMacros = macros.defaultMacros;
            this._macros = macros.macros;
        }

        this.updateCodemirrorExtension(CodeMirrorUpdateType.MACROS);
        this.cdr.markForCheck();
    };

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


            if (this.theme === 'dark') {
                this.baseExtensions.push(oneDark);
            }

            const state = EditorState.create({
                doc: textarea.value,
                extensions: [
                    this.baseExtensions,
                    this.setUpdateValueChangeCodemirrorListener() as unknown as Extension,
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

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    // update the codemirror extension based on the given value
    private updateCodemirrorExtension(updateType: string) {
        this.cdr.markForCheck();

        switch (updateType) {
            case CodeMirrorUpdateType.AUTOCOMPLETE:
                break;
            case CodeMirrorUpdateType.MACROS:
                break;
            default:
                break;
        }

        let updateValueChangeCodemirrorListener = this.setUpdateValueChangeCodemirrorListener();
        console.log('HIER BIN ICH');
        if (this.editor !== undefined && this.editor !== null) {
            console.log('HIER BIN ICH');
            this.editor.dispatch({
                changes: {from: 0, to: this.editor.state.doc.length, insert: this.textareaModel.value},
                effects: StateEffect.reconfigure.of([this.baseExtensions, this.autocompleteExtension, updateValueChangeCodemirrorListener]),
            });
            console.log('HIER BIN ICH');
        }
    }

    // sets the listener that updates changes in the codemirror with the textarea
    private setUpdateValueChangeCodemirrorListener() {
        console.log('HIER BIN ICH');
        const textarea = this.containerRef.nativeElement.querySelector('textarea');

        let updateValueChangeCodemirrorListener;

        if (textarea) {console.log('HIER BIN ICH');
            // listener that updates changes in the codemirror with the textarea
            updateValueChangeCodemirrorListener = EditorView.updateListener.of((update) => {
                console.log('HIER BIN ICH');
                if (update.docChanged) {
                    console.log('HIER BIN ICH');
                    textarea.value = this.editor.state.doc.toString();
                    textarea.dispatchEvent(new Event('input'));
                }
                console.log('HIER BIN ICH');
            });

        }

        return updateValueChangeCodemirrorListener;
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


    private isDefaultMacros(obj: any): obj is DefaultMacros {
        return typeof obj === 'object' && 'category' in obj && 'class' in obj && 'macros' in obj;

    }

    private isMacroIndex(obj: any): obj is MacroIndex {
        return typeof obj === 'object' && 'id' in obj && 'name' in obj && 'value' in obj && 'description' in obj && 'password' in obj && 'created' in obj && 'modified' in obj;
    }

    private isMacros(obj: any): obj is Macros {
        return typeof obj === 'object' && 'defaultMacros' in obj && 'macros' in obj;
    }

}

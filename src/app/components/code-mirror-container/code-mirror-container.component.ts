import { AfterViewInit, Component, ElementRef, Input, numberAttribute, ViewChild } from '@angular/core';
import { basicSetup, EditorView } from 'codemirror';
import { EditorState, Range, RangeSet, StateEffect, StateField } from '@codemirror/state';
import { Decoration, DecorationSet, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { autocompletion, completeFromList, Completion, } from '@codemirror/autocomplete';
import { AutocompleteItem, DefaultMacros, HighlightPattern, Macros } from './code-mirror-container.interface';
import { CodeMirrorUpdateType } from './code-mirror-update-type';
import { MacroIndex } from "../../pages/macros/macros.interface";

@Component({
    selector: 'oitc-code-mirror-container',
    standalone: true,
    imports: [],
    templateUrl: './code-mirror-container.component.html',
    styleUrl: './code-mirror-container.component.css'
})
export class CodeMirrorContainerComponent implements AfterViewInit {
    @ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLDivElement>;
    private editor!: EditorView;
    private customHighlightExtension!: StateField<DecorationSet>[];
    private autocompleteExtension: any;

    private defaultHighlightPatterns: HighlightPattern[] = [
        {
            highlight: /(\$ARG\d+\$)/g,
            className: 'highlight-blue'
        },
        {
            highlight: /(\$USER\d+\$)/g,
            className: 'highlight-green'
        },
        {
            highlight: /(\$_HOST.*?\$)/g,
            className: 'highlight-purple'
        },
        {
            highlight: /(\$_SERVICE.*?\$)/g,
            className: 'highlight-purple'
        },
        {
            highlight: /(\$_CONTACT.*?\$)/g,
            className: 'highlight-purple'
        }
    ];

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

    private baseExtensions = [this.formControlStyle, this.borderFocusStyle, basicSetup, keymap.of([...defaultKeymap])];

    private _highlightPatterns: HighlightPattern[] =
        this.defaultHighlightPatterns;
    private _autocompleteWords: AutocompleteItem[] = this.getNagiosMacroNames();
    //Macros are overwriting highlightPatterns and autocompleteWords from user
    private defaultMacros: DefaultMacros[] = [];
    private _macros: MacroIndex[] = [];
    @Input({transform: numberAttribute}) rows: number = 6;

    @Input() set highlightPatterns(highlightPatterns: HighlightPattern[]) {
        this._highlightPatterns = highlightPatterns;
        this.updateCodemirrorExtension(CodeMirrorUpdateType.HIGHLIGHT);
    }

    @Input() set autocompleteWords(autocompleteWords: AutocompleteItem[]) {
        this._autocompleteWords = autocompleteWords;
        this.updateCodemirrorExtension(CodeMirrorUpdateType.AUTOCOMPLETE);
    };

    //Macros are overwriting highlightPatterns and autocompleteWords from user
    @Input() set macros(macros: DefaultMacros[] | MacroIndex[] | Macros) {

        if (Array.isArray(macros)) {
            if (macros.length === 0) {
                this.defaultMacros = [];
                this._macros = [];
            } else if (this.isDefaultMacros(macros[0])) {
                // @ts-ignore
                this.defaultMacros = macros;
            } else if (this.isMacroIndex(macros[0])) {
                // @ts-ignore
                this._macros = macros;
            }
        } else if (this.isMacros(macros)) {
            this.defaultMacros = macros.defaultMacros;
            this._macros = macros.macros;
        }

        this.addMacrosToHighlight();
        this.addMacrosToAutocompletion();
        this.updateCodemirrorExtension(CodeMirrorUpdateType.MACROS);
    };

    ngAfterViewInit() {
        const textarea = this.containerRef.nativeElement.querySelector('textarea');

        if (textarea) {
            let updateValueChangeCodemirrorListener = this.setUpdateValueChangeCodemirrorListener();

            this.autocompleteExtension = this.createAutoCompleteExtension(this._autocompleteWords);

            this.customHighlightExtension = this.createHighlightExtension(
                this._highlightPatterns
            );

            const state = EditorState.create({
                doc: textarea.value,
                extensions: [
                    this.baseExtensions,
                    updateValueChangeCodemirrorListener,
                    this.customHighlightExtension,
                    this.autocompleteExtension,
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
            console.warn('Keine Textarea gefunden.');
        }
    }

    // update the codemirror extension based on the given value
    private updateCodemirrorExtension(updateType: string) {

        switch (updateType) {
            case CodeMirrorUpdateType.HIGHLIGHT:
                this.customHighlightExtension = this.createHighlightExtension(
                    this._highlightPatterns
                );
                break
            case CodeMirrorUpdateType.AUTOCOMPLETE:
                this.autocompleteExtension = this.createAutoCompleteExtension(this._autocompleteWords);
                break;
            case CodeMirrorUpdateType.MACROS:
                this.autocompleteExtension = this.createAutoCompleteExtension(this._autocompleteWords);
                this.customHighlightExtension = this.createHighlightExtension(
                    this._highlightPatterns
                );
                break;
            default:
                break;
        }

        let updateValueChangeCodemirrorListener = this.setUpdateValueChangeCodemirrorListener();

        if (this.editor !== undefined && this.editor !== null) {
            this.editor.dispatch({
                effects: StateEffect.reconfigure.of([this.baseExtensions, this.autocompleteExtension, this.customHighlightExtension, updateValueChangeCodemirrorListener]),
            });
        }
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

    // creates highlighting based on the given list
    private createHighlightExtension(highlightPatterns: HighlightPattern[]) {
        const decorationsFromRegex = (doc: string) => {
            const decorations: Range<Decoration>[] = [];

            highlightPatterns.forEach((pattern) => {
                const regex = new RegExp(pattern.highlight, 'g');
                let match;
                while ((match = regex.exec(doc))) {
                    const start = match.index;
                    const end = start + match[0].length;
                    const deco = Decoration.mark({
                        class: pattern.className,
                    });
                    decorations.push(deco.range(start, end));
                }
            });

            // Sort decorations by from position
            decorations.sort((a, b) => a.from - b.from);

            const rangeSet = RangeSet.of(decorations);

            return <DecorationSet>rangeSet;
        };

        const field = StateField.define<DecorationSet>({
            create: (state) => decorationsFromRegex(state.doc.toString()),
            update: (value, tr) => {
                if (tr.docChanged) {
                    return decorationsFromRegex(tr.newDoc.toString());
                }
                return value;
            },
            provide: (field) => EditorView.decorations.from(field),
        });

        return [field];
    }

    private getNagiosMacroNames(): AutocompleteItem[] {

        let autocompleteItems: AutocompleteItem[] = [];

        for (let i = 1; i <= 32; i++) {
            let item: AutocompleteItem = {
                value: '$ARG' + i + '$',
                description: 'Nagios Macro'
            };
            autocompleteItems.push(item);
        }

        return autocompleteItems;

    }

    private addMacrosToHighlight() {

        let escapeDollar = new RegExp('\\$', 'g');

        this._highlightPatterns = this.defaultHighlightPatterns;

        for (let index in this.defaultMacros) {
            for (let i in this.defaultMacros[index].macros) {
                let macroName = this.defaultMacros[index].macros[i].macro;
                macroName = macroName.replace(escapeDollar, '\\$');
                this._highlightPatterns.push({
                    highlight: new RegExp(macroName, "g"),
                    className: this.defaultMacros[index].class
                });
            }
        }

    }

    private addMacrosToAutocompletion() {

        let autocompleteItems: AutocompleteItem[] = this.getNagiosMacroNames();

        for (let index in this.defaultMacros) {
            for (let i in this.defaultMacros[index].macros) {
                let item: AutocompleteItem = {
                    value: this.defaultMacros[index].macros[i].macro,
                    description: this.defaultMacros[index].macros[i].description
                };
                autocompleteItems.push(item);
            }
        }

        for (let index in this._macros) {
            let item: AutocompleteItem = {
                value: this._macros[index].name,
                description: this._macros[index].description
            };
            autocompleteItems.push(item);
        }

        autocompleteItems.sort((a, b) => a.value.localeCompare(b.value));

        this._autocompleteWords = autocompleteItems;

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

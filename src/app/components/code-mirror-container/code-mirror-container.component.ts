import {AfterViewInit, Component, ElementRef, Input, numberAttribute, ViewChild} from '@angular/core';
import {basicSetup, EditorView} from 'codemirror';
import {EditorState, Range, RangeSet, StateField} from '@codemirror/state';
import {Decoration, DecorationSet, keymap} from '@codemirror/view';
import {defaultKeymap} from '@codemirror/commands';
import {autocompletion, completeFromList, Completion,} from '@codemirror/autocomplete';
import {AutocompleteItem, DefaultMacros, HighlightPattern} from './code-mirror-container.interface';

@Component({
    selector: 'oitc-code-mirror-container',
    standalone: true,
    imports: [],
    templateUrl: './code-mirror-container.component.html',
    styleUrl: './code-mirror-container.component.css'
})
export class CodeMirrorContainerComponent implements AfterViewInit {
    @ViewChild('container', {static: true})
    containerRef!: ElementRef<HTMLDivElement>;
    private editor!: EditorView;

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

    @Input() highlightPatterns: HighlightPattern[] =
        this.defaultHighlightPatterns;
    @Input() autocompleteWords: AutocompleteItem[] = this.getNagiosMacroNames();
    //Macros are overwriting highlightPatterns and autocompleteWords from user
    @Input() macros: DefaultMacros[] = [];
    @Input({transform: numberAttribute}) rows: number = 6;

    ngAfterViewInit() {
        const textarea = this.containerRef.nativeElement.querySelector('textarea');

        if (textarea) {
            // listeners that updates changes in the codemirror with the textarea
            let updateValueChangeCodemirrorListener = EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    textarea.value = this.editor.state.doc.toString();
                }
            });

            if (this.macros.length > 0) {
                this.addMacrosToHighlight();
                this.addMacrosToAutocompletion();
            }

            // autocomplete extension
            const completions: Completion[] = this.autocompleteWords.map((item) => ({
                label: item.value,
                detail: item.description,
                type: 'variable',
            }));

            const autocompleteExtension = autocompletion({
                override: [completeFromList(completions)],
            });

            const customHighlight = this.createHighlightExtension(
                this.highlightPatterns
            );

            // border focus style
            // only this way is possible, because codemirror overwrites the set css classes
            const borderFocusStyle = EditorView.theme({
                "&.cm-editor.cm-focused": {
                    borderColor: '#acabeb',
                    outline: 0,
                    boxShadow: '0 0 0 0.25rem rgba(88, 86, 214, 0.25)'
                }
            });

            const state = EditorState.create({
                doc: textarea.value,
                extensions: [
                    EditorView.editorAttributes.of({class: "form-control"}),
                    borderFocusStyle,
                    basicSetup,
                    keymap.of([...defaultKeymap]),
                    updateValueChangeCodemirrorListener,
                    customHighlight,
                    autocompleteExtension,
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

        this.highlightPatterns = this.defaultHighlightPatterns;

        for (let index in this.macros) {
            for (let i in this.macros[index].macros) {
                let macroName = this.macros[index].macros[i].macro;
                macroName = macroName.replace(escapeDollar, '\\$');
                this.highlightPatterns.push({
                    highlight: new RegExp(macroName, "g"),
                    className: this.macros[index].class
                });
            }
        }

    }

    private addMacrosToAutocompletion() {

        let autocompleteItems: AutocompleteItem[] = this.getNagiosMacroNames();

        for (let index in this.macros) {
            for (let i in this.macros[index].macros) {
                let item: AutocompleteItem = {
                    value: this.macros[index].macros[i].macro,
                    description: this.macros[index].macros[i].description
                };
                autocompleteItems.push(item);
            }
        }

        this.autocompleteWords = autocompleteItems;

    }

}

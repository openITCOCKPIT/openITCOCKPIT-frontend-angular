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
import { EditorState, Extension } from '@codemirror/state';
import { PromQLExtension } from '@prometheus-io/codemirror-promql';
import { basicSetup, EditorView } from 'codemirror';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
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
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly LayoutService = inject(LayoutService);
    private readonly cdr = inject(ChangeDetectorRef);
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
        const textarea = this.containerRef.nativeElement.querySelector('textarea');

        let updateValueChangeCodemirrorListener = this.setUpdateValueChangeCodemirrorListener();
        if (textarea) {
            const state = EditorState.create({
                doc: textarea.value,
                extensions: [
                    this.baseExtensions,
                    updateValueChangeCodemirrorListener as unknown as Extension,
                    promQL.asExtension(),
                ],
            });
            this.editor.setState(state);
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




}

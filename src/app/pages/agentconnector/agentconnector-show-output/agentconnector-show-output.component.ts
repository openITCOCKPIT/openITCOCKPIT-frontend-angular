import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { AgentconnectorShowOutputParams, AgentconnectorShowOutputRoot, AgentModes } from '../agentconnector.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgentconnectorPullService } from '../agentconnector-pull.service';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import { LayoutService } from '../../../layouts/coreui/layout.service';
import {
    BooleanToggle,
    createJSONEditor,
    isBoolean,
    Mode,
    ReadonlyValue,
    RenderValueComponentDescription,
    RenderValueProps
} from 'vanilla-jsoneditor';

@Component({
    selector: 'oitc-agentconnector-show-output',
    imports: [
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        DeleteAllModalComponent,
        DropdownDividerDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        ItemSelectComponent,
        LabelLinkComponent,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        BackButtonDirective,
        BlockLoaderComponent,
        AsyncPipe,
        NgClass
    ],
    templateUrl: './agentconnector-show-output.component.html',
    styleUrl: './agentconnector-show-output.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentconnectorShowOutputComponent implements OnInit, OnDestroy {

    // Select jsoneditor div the Angular way
    @ViewChild('jsoneditor') jsoneditor!: ElementRef;

    public output?: AgentconnectorShowOutputRoot;
    public mode: AgentModes = AgentModes.Pull

    public readonly LayoutService: LayoutService = inject(LayoutService);

    private subscriptions: Subscription = new Subscription();
    private id: number = 0;


    private readonly AgentconnectorPullService = inject(AgentconnectorPullService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.id = Number(this.route.snapshot.paramMap.get('id'));
            const mode = String(this.route.snapshot.paramMap.get('mode'));
            if (mode) {
                this.mode = mode as AgentModes;
            }
            this.loadAgentOutput();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadAgentOutput() {
        if (this.id <= 0) {
            return;
        }

        const params: AgentconnectorShowOutputParams = {
            angular: true,
            id: this.id,
            mode: this.mode
        };

        this.subscriptions.add(
            this.AgentconnectorPullService.showOutput(params).subscribe((output) => {
                this.output = output;
                this.createEditor();
                this.cdr.markForCheck();
            })
        );
    }

    private createEditor() {
        if (!this.output) {
            return;
        }

        const editor = createJSONEditor({
            target: this.jsoneditor.nativeElement,
            props: {
                mode: Mode.tree,
                mainMenuBar: true,
                readOnly: true,
                onRenderValue(props: RenderValueProps) {
                    // In the past, there was an colorPicker: false and timestampTag: false option.
                    // Because this was WAY too easy to use, someone in there infinite wisdom decided to remove it.
                    // So now the totally simple solution is, to provide a freaking own render method.
                    // Of course, this is total the best and easiest way to disable something.
                    // I have copy and pasted the basics from
                    // https://github.com/josdejong/svelte-jsoneditor/blob/96e4179871a18c42edbac25d3d62548ed7fe2aa7/src/lib/plugins/value/renderValue.ts#L9-L78
                    // and removed the god-damn ColorPicker and TimestampTag.
                    // By the love of god! (╯‵□′)╯︵┻━┻

                    const renderers: RenderValueComponentDescription[] = [];
                    const isEditing = props.isEditing;

                    if (!isEditing && isBoolean(props.value)) {
                        renderers.push({
                            component: BooleanToggle,
                            props: {
                                path: props.path,
                                value: props.value,
                                readOnly: props.readOnly,
                                onPatch: props.onPatch,
                                focus: props.focus
                            }
                        });
                    }

                    if (!isEditing) {
                        renderers.push({
                            component: ReadonlyValue,
                            props: {
                                path: props.path,
                                value: props.value,
                                mode: props.mode,
                                readOnly: props.readOnly,
                                parser: props.parser,
                                normalization: props.normalization,
                                searchResultItems: props.searchResultItems,
                                onSelect: props.onSelect
                            }
                        });
                    }

                    return renderers;
                },

                content: {
                    text: undefined,
                    json: JSON.parse(this.output.outputAsJson)
                }
            }
        });

        this.cdr.markForCheck();
    }

    protected readonly AgentModes = AgentModes;
}

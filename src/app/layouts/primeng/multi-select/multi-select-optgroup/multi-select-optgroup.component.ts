import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { HighlightSearchPipe } from '../../../../pipes/highlight-search.pipe';
import { MultiSelect, MultiSelectChangeEvent, MultiSelectFilterEvent } from 'primeng/multiselect';
import { SharedModule } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CheckboxModule } from 'primeng/checkbox';
import _ from 'lodash';
import { AnimationEvent } from '@angular/animations';


@Component({
    selector: 'oitc-multi-select-optgroup',
    imports: [
        HighlightSearchPipe,
        SharedModule,
        FormsModule,
        CheckboxModule,
        MultiSelect
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiSelectOptgroupComponent),
            multi: true
        }
    ],
    templateUrl: './multi-select-optgroup.component.html',
    styleUrl: './multi-select-optgroup.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectOptgroupComponent implements ControlValueAccessor, OnInit, OnDestroy {
    @ViewChild('multiSelectOptgroup') multiSelectOptgroup: MultiSelect | undefined;


    private init: boolean = false;
    @Input() id: string | undefined;
    @Input() name: string | undefined;

    /**
     * Array of the options for the select box
     * @group Props
     */
        //@Input() options: any[] | undefined;
    private _options: any[] | undefined;
    @Input()
    set options(options) {

        // Fix for the issue that the options are not updated when search
        // Probably some JavaScript objects reference issue
        this._options = [];

        this.cdr.markForCheck();
        this.cdr.detectChanges();

        this._options = options;
        this.onOptionsChanged();
    }

    get options() {
        return this._options;
    }


    /**
     * ngModel for the form
     * @group Props
     */
    @Input() ngModel: any | undefined;

    /**
     * Enable / Disable filter input
     * @group Props
     */
    @Input() filter: boolean = true;

    /**
     * String of CSS classes to apply to the select box
     * @group Props
     */
    @Input() class: string = 'w-auto d-flex';

    /**
     * Name of the label field of an option.
     * @group Props
     */
    @Input() optionValue: string | undefined;

    /**
     * Name of the label field of an option.
     * This can be a string or path like 'key.subkey'
     * @group Props
     */
    @Input() optionLabel: string = 'value';
    @Input() optionDisabled: string | undefined;
    @Input() disabled: boolean = false;
    @Input() placeholder: string | undefined;
    @Input() filterPlaceHolder: string | undefined;
    @Input() maxSelectedLabels: number | null | undefined = null;
    @Input() display: string | 'comma' | 'chip' = 'chip';
    @Input() showClear: boolean = false;

    /**
     * If ngModel should be debounced
     * @group Props
     */
    @Input() debounce: boolean = false;
    @Input() debounceTime: number = 500;
    private onChangeSubject = new Subject<any>();

    /**
     * Callback that will be called when the user enter a search text
     * @group Props
     */
    private searchCallbackSubject = new Subject<any>();
    @Input() searchCallback: Function | undefined;
    @Input() group: boolean = false;

    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * Set this to an empty string for Modals !!!
     *
     *
     * @group Props
     */
    @Input() appendTo: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any = 'body';

    /**
     * If the selected value (current value of ngModel) does not exist in the options, the value will be reset to 0
     * This is important in case a user change a container, and some objects (templates, contacts, etc.) are not available in the new container
     *
     * In some rare cases, you might want to disable this check
     */
    @Input() disableCheckThatEnsuresSelectedValueExistsInOptions: boolean = false;

    @Output() ngModelChange = new EventEmitter();
    @Output() onChange: EventEmitter<MultiSelectChangeEvent> = new EventEmitter<MultiSelectChangeEvent>();
    @Output() onFilter: EventEmitter<MultiSelectFilterEvent> = new EventEmitter<MultiSelectFilterEvent>();
    private readonly TranslocoService = inject(TranslocoService);

    public searchText: string = '';

    private Subscriptions: Subscription = new Subscription();

    public constructor(private cdr: ChangeDetectorRef) {
        if (this.placeholder == undefined) {
            this.placeholder = this.TranslocoService.translate('Please choose');
        }

        if (this.filterPlaceHolder == undefined) {
            this.filterPlaceHolder = this.TranslocoService.translate('Type to search');
        }
    }

    public ngOnInit(): void {
        if (this.debounce) {
            this.Subscriptions.add(
                this.onChangeSubject.pipe(
                    debounceTime(this.debounceTime),
                    distinctUntilChanged()
                ).subscribe(value => {
                    this.onChange.emit(value);
                }));
        }

        if (this.searchCallback) {
            this.Subscriptions.add(
                this.searchCallbackSubject.pipe(
                    debounceTime(this.debounceTime),
                    distinctUntilChanged()
                ).subscribe(value => {
                    this.searchCallback!(this.searchText);
                }));
        }
        this.init = true;
    }

    public ngOnDestroy(): void {
        this.Subscriptions.unsubscribe();
    }

    updateNgModel(value: any) {
        this.ngModel = value;
        this.ngModelChange.emit(this.ngModel);
    }

    triggerOnChange(event: any) {
        if (this.debounce) {
            this.onChangeSubject.next(event);
        } else {
            this.onChange.emit(event);
        }
    }

    triggerOnFilter(event: any) {
        this.onFilter.emit(event);
    }

    public doHighlightSearch(searchText: string) {
        this.searchText = searchText;

        // Call the search callback debounced
        if (this.searchCallback) {
            this.searchCallbackSubject.next(searchText);
        }
    }

    public writeValue(obj: any): void {
        this.ngModel = obj;
    }

    public registerOnChange(fn: Function): void {
        this.ngModelChange.subscribe(fn);
    }

    public registerOnTouched(fn: Function): void {
        this.ngModelChange.subscribe(fn);
    }

    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public onClickSetSelected(group: any) {
        group.items.forEach((item: any) => {
            this.ngModel = this.ngModel ? [...this.ngModel] : [];
            if (!this.ngModel.includes(item.value) && !item.disabled) {
                this.ngModel.push(item.value);
            }
        });
        this.ngModelChange.emit(this.ngModel);
    }

    protected readonly String = String;

    public resetSearchString() {
        this.searchText = '';
    }

    public onOptionsChanged() {
        // Remove selected values that are not in the options anymore.
        // This can happen, if a user change the selected container

        if (!this.init) {
            // Fix Expression has changed after it was checked
            return;
        }

        this.cdr.markForCheck();

        if (this.ngModel && this._options && !this.disableCheckThatEnsuresSelectedValueExistsInOptions) {
            let optionGroupValues: (string | number)[] = [];

            this._options.map(obj => {
                obj.items.map((option: { value: number; }) => {
                    optionGroupValues.push(option.value);
                })
            });
            this.ngModel = _.intersection(
                optionGroupValues,
                this.ngModel
            );

            setTimeout(() => {
                // Fix Expression has changed after it was checked 🧻
                this.ngModelChange.emit(this.ngModel);
            }, 0);
        }
    }

    /**
     * This method is an ugly workaround to a limitation of the PrimeNG select component.
     * By default, PrimeNG calculates a value for "min-width" which absolutely
     * is bad for long option labels. This behavior is not configurable.
     * https://github.com/primefaces/primeng/issues/17363#issuecomment-2714217581
     *
     * This method copies the value of min-width into width to make the overlay use an absolute width
     * so we can linebreak long option labels.
     *
     * @param event
     */
    public onShow(event: AnimationEvent) {
        event.element.parentElement.style.width = event.element.parentElement.style.minWidth;

        // 🩹
        // Fix for long option labels
        // PrimeNG calculates the left position with the min-width value. So if you have an option with a very long name
        // the dropdown will be displayed outside the viewport.
        // To fix this, PrimeNG sets left to 0. https://github.com/primefaces/primeng/blob/33b099064e75d2ba9aa5fd45889837ff9a9875e5/packages/primeng/src/dom/domhandler.ts#L194
        // We try to fix this, when left = 0, we set it to the same position as the select box is.
        if (this.multiSelectOptgroup) {
            if (event.element.parentElement.style.left === '0px' && this.multiSelectOptgroup.appendTo.length !== 0) {
                const selectBoxPosition = this.multiSelectOptgroup.el.nativeElement.getBoundingClientRect();
                event.element.parentElement.style.left = selectBoxPosition.x + 'px';
            }
        }
    }
}

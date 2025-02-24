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
    TemplateRef
} from '@angular/core';
import { HighlightSearchPipe } from '../../../../pipes/highlight-search.pipe';
import { PrimeTemplate } from 'primeng/api';
import { Select } from 'primeng/select';
import { distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { MultiSelectChangeEvent, MultiSelectFilterEvent } from 'primeng/multiselect';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { debounceTime } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'oitc-select-optgroup',
    imports: [
        HighlightSearchPipe,
        PrimeTemplate,
        Select,
        FormsModule,
        JsonPipe
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectOptgroupComponent),
            multi: true
        }
    ],
    templateUrl: './select-optgroup.component.html',
    styleUrl: './select-optgroup.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectOptgroupComponent implements ControlValueAccessor, OnInit, OnDestroy {
    private init: boolean = false;

    @Input() id: string | undefined;
    @Input() name: string | undefined;

    /**
     * Array of the options for the select box
     * @group Props
     */
    private _options: any[] | undefined;
    @Input()
    set options(value: any[] | undefined) {
        this._options = value;
        this.onOptionsChanged();
    }

    get options(): any[] | undefined {
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
    @Input() optionLabel: string = 'key';
    @Input() optionDisabled: string | undefined;
    @Input() disabled: boolean = false;
    @Input() labelSuffix: string = '';
    @Input() labelPrefix: string = '';
    @Input() placeholder: string | undefined;
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

    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * Set this to an empty string for Modals !!!
     *
     * UPDATE 11.02.2025.
     * With PrimeNG 19, we changed the default value from 'body' to ''.
     * This will fix the issue with the dropdown not showing in modals and als resolve a style issue where the dropdown
     * is 100% width of the body.
     *
     * @group Props
     */
    @Input() appendTo: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any = '';

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

    public onOptionsChanged() {
        // Remove selected values that are not in the options anymore.
        // This can happen, if a user change the selected container

        if (!this.init) {
            // Fix Expression has changed after it was checked
            return;
        }

        this.cdr.markForCheck();

        if (this.ngModel && this._options && !this.disableCheckThatEnsuresSelectedValueExistsInOptions) {
            // Check if the selected values are still in the options
            let valueStillInOptions = false;
            let key = this.optionValue || 'key';
            this._options.filter((option) => {
                if (option[key] === this.ngModel) {
                    valueStillInOptions = true;
                }
            });

            if (valueStillInOptions === false) {
                // We need to reset to 0 for hosts edit and services edit because "null" means inherit from template
                // In case you need some other value, make this configurable and set the default to zero to avoid breaking changes
                this.ngModel = 0;
            }

            setTimeout(() => {
                // Fix Expression has changed after it was checked 🧻
                this.ngModelChange.emit(this.ngModel);
            }, 0);
        }

        this._options?.forEach((element) => {
            // Check that we actually have a name to add prefix / suffix.
            if (!element.value) {
                return;
            }
            if (this.labelSuffix && !element.value.endsWith(this.labelSuffix)) {
                element.value += this.labelSuffix;
            }
            if (this.labelPrefix && !element.value.startsWith(this.labelPrefix)) {
                element.value = this.labelPrefix + element.value;
            }
        })
    }

    protected readonly String = String;
}

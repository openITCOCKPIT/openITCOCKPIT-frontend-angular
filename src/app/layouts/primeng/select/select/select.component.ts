import { Component, EventEmitter, forwardRef, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { MultiSelectChangeEvent, MultiSelectFilterEvent, MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { HighlightSearchPipe } from '../../../../pipes/highlight-search.pipe';
import { TranslocoService } from '@jsverse/transloco';
import { debounceTime } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'oitc-select',
    standalone: true,
    imports: [
        DropdownModule,
        MultiSelectModule,
        FormsModule,
        HighlightSearchPipe,
        JsonPipe
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true
        }
    ],
    templateUrl: './select.component.html',
    styleUrl: './select.component.css'
})
export class SelectComponent implements ControlValueAccessor, OnInit, OnDestroy {
    @Input() id: string | undefined;
    @Input() name: string | undefined;

    /**
     * Array of the options for the select box
     * @group Props
     */
    @Input() options: any[] | undefined;

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

    @Output() ngModelChange = new EventEmitter();
    @Output() onChange: EventEmitter<MultiSelectChangeEvent> = new EventEmitter<MultiSelectChangeEvent>();
    @Output() onFilter: EventEmitter<MultiSelectFilterEvent> = new EventEmitter<MultiSelectFilterEvent>();
    private readonly TranslocoService = inject(TranslocoService);

    public searchText: string = '';

    private Subscriptions: Subscription = new Subscription();

    public constructor() {
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

    protected readonly String = String;
}

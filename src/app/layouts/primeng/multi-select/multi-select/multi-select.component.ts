import { Component, EventEmitter, forwardRef, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HighlightSearchPipe } from '../../../../pipes/highlight-search.pipe';
import { MultiSelectChangeEvent, MultiSelectFilterEvent, MultiSelectModule } from 'primeng/multiselect';
import { SharedModule } from 'primeng/api';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
    selector: 'oitc-multi-select',
    standalone: true,
    imports: [
        HighlightSearchPipe,
        MultiSelectModule,
        SharedModule,
        TranslocoPipe,
        FormsModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiSelectComponent),
            multi: true
        }
    ],
    templateUrl: './multi-select.component.html',
    styleUrl: './multi-select.component.css'
})
export class MultiSelectComponent implements ControlValueAccessor, OnInit, OnDestroy {
    @Input() id: string | undefined;
    @Input() name: string | undefined;
    @Input() options: any[] | undefined;
    @Input() ngModel: any | undefined;
    @Input() filter: boolean = true;
    @Input() class: string = 'w-auto d-flex';
    @Input() optionValue: string | undefined;
    @Input() optionLabel: string | undefined;
    @Input() optionDisabled: string | undefined;
    @Input() disabled: boolean = false;
    @Input() placeholder: string | undefined;
    @Input() filterPlaceHolder: string | undefined;
    @Input() maxSelectedLabels: number | null | undefined = null;
    @Input() display: string | 'comma' | 'chip' = 'chip';
    @Input() showClear: boolean = false;

    @Input() debounce: boolean = false;
    @Input() debounceTime: number = 500;
    private onChangeSubject = new Subject<any>();


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

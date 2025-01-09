import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';
import _ from 'lodash';
import { PopoverDirective } from '@coreui/angular';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'oitc-template-diff',
    imports: [
        FaIconComponent,
        NgClass,
        PopoverDirective,
        TranslocoDirective
    ],
    templateUrl: './template-diff.component.html',
    styleUrl: './template-diff.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateDiffComponent implements OnChanges {

    public hasDiff: boolean = false;

    @Input() public value: any;
    @Output() public valueChange = new EventEmitter<any>();

    @Input() public templateValue: any;

    @Output() public valueResetted = new EventEmitter<any>();


    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    ngOnChanges(changes: SimpleChanges) {
        if (changes['value']) {
            this.runDiff();
        }
    }

    restoreDefault() {
        this.value = this.templateValue;
        this.valueChange.emit(this.value);
        this.valueResetted.emit(this.value);
        this.cdr.markForCheck();
    }

    public getPopoverContent(): string {
        if (this.hasDiff === false) {
            return this.TranslocoService.translate('Same value as defined by the template.');
        }

        let msg = this.TranslocoService.translate('Click to restore the template default value:')
        if (this.templateValue !== null && this.templateValue !== undefined) {
            if (typeof this.templateValue === 'object') {
                msg += ' ' + JSON.stringify(this.templateValue);
            } else {
                if (this.templateValue === '') {
                    msg += ' ' + '<empty>'
                } else {
                    msg += ' ' + this.templateValue;

                }
            }
        }
        return msg;
    }

    runDiff() {
        this.cdr.markForCheck();

        if (this.templateValue === null && this.value === null) {
            this.hasDiff = false;
            return;
        }
        switch (typeof this.templateValue) {
            case "undefined":
                break;

            case "object":
                this.hasDiff = false;
                if (Array.isArray(this.templateValue) === false) {
                    //Compare keys for objects {}
                    for (let key in this.value) {
                        if (!this.templateValue.hasOwnProperty(key)) {
                            this.hasDiff = true;
                        }
                    }
                } else {
                    let resultOne = _.difference(this.value, this.templateValue);
                    if (resultOne.length > 0) {
                        this.hasDiff = true;
                    } else {
                        var resultTow = _.difference(this.templateValue, this.value);
                        if (resultTow.length > 0) {
                            this.hasDiff = true;
                        }
                    }
                }

                if (this.hasDiff === false) {
                    //typeof null is object
                    //https://262.ecma-international.org/5.1/#sec-11.4.3
                    if (this.templateValue === null && this.value !== null) {
                        this.hasDiff = true;
                    }
                }

                if (this.hasDiff === false) {
                    var sizeOne = Object.keys(this.value).length;
                    var sizeTow = Object.keys(this.templateValue).length;

                    this.hasDiff = sizeOne !== sizeTow;
                }
                break;

            default:
                //string
                this.hasDiff = this.value != this.templateValue;
        }
    }

}

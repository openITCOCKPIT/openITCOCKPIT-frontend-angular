import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormCheckComponent, FormCheckInputDirective } from '@coreui/angular';
import { SelectionServiceService } from '../selection-service.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-item-select',
    imports: [
        FormCheckInputDirective,
        FormCheckComponent,
        FormsModule
    ],
    templateUrl: './item-select.component.html',
    styleUrl: './item-select.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemSelectComponent implements OnInit, OnDestroy {

    @Input() item: any;
    @Input() public disabled: boolean = true;
    @Input() initialChecked: boolean = false;

    public checked = false;
    private subscriptions: Subscription = new Subscription();

    private cdr = inject(ChangeDetectorRef);

    constructor(public selection: SelectionServiceService) {
    }

    public ngOnInit() {
        // Subscript to SelectionService so we get an update when a user press on "Select All"
        this.subscriptions.add(this.selection.selectAll$.subscribe(value => {
            this.cdr.markForCheck();

            if (this.disabled) {
                // Do not allow selection if the checkbox is disabled
                return;
            }

            this.checked = value;

            if (this.checked) {
                // Send feedback to the SelectionService that this item is selected (used for Select All)
                this.selection.selectItem(this.item);
            }
        }));

        if (this.initialChecked) {
            if (!this.disabled) {
                this.checked = true;
                this.selection.selectItem(this.item);
            }
        }
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public notifyItemSelection() {
        if (this.checked) {
            // Selectbox in table got checked
            this.selection.selectItem(this.item);
        } else {
            // Selectbox in table got unchecked
            this.selection.deselectItem(this.item);
        }
    }


}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormCheckComponent, FormCheckInputDirective } from '@coreui/angular';
import { SelectionServiceService } from '../selection-service.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-item-select',
    standalone: true,
    imports: [
        FormCheckInputDirective,
        FormCheckComponent,
        FormsModule
    ],
    templateUrl: './item-select.component.html',
    styleUrl: './item-select.component.css'
})
export class ItemSelectComponent implements OnInit, OnDestroy {

    @Input() item: any;
    @Input() public disabled: boolean = true;

    public checked = false;
    private subscriptions: Subscription = new Subscription();

    constructor(public selection: SelectionServiceService) {
    }

    public ngOnInit() {
        // Subscript to SelectionService so we get an update when a user press on "Select All"
        this.subscriptions.add(this.selection.selectAll$.subscribe(value => {
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

        // Subscript to SelectionService in case .selectItem() get called.
        // Only supports "id" field for now
        this.subscriptions.add(this.selection.selection$.subscribe(items => {
            if (this.disabled) {
                // Do not allow selection if the checkbox is disabled
                return;
            }

            for (let item of items) {
                if (item.hasOwnProperty('id') && this.item.hasOwnProperty('id')) {
                    if (item.id === this.item.id) {
                        this.checked = true;
                        return;
                    }
                }
            }

            // We are not in the current selection :(
            this.checked = false;
        }));
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

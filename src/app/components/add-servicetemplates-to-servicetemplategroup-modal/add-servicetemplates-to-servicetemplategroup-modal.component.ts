import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    AddServicetemplatesToServicetemplategroupItem
} from './add-servicetemplates-to-servicetemplategroup.interface';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-add-servicetemplates-to-servicetemplategroup-modal',
    imports: [
    ButtonCloseDirective,
    ColComponent,
    FaIconComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    RowComponent,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink
],
    templateUrl: './add-servicetemplates-to-servicetemplategroup-modal.component.html',
    styleUrl: './add-servicetemplates-to-servicetemplategroup-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddServicetemplatesToServicetemplategroupModalComponent implements OnChanges {

    @Input({required: true}) public items: AddServicetemplatesToServicetemplategroupItem[] = [];

    private readonly modalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);

    protected servicetemplateIds: number[] = [];
    protected servicetemplateIdsAsString: string = '';

    public hideModal() {
        this.servicetemplateIds = [];
        this.cdr.markForCheck();

        this.modalService.toggle({
            show: false,
            id: 'addServicetemplatesToServicetemplategroups'
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['items']) {
            this.servicetemplateIds = this.items.map(item => Number(item.id));
            this.servicetemplateIdsAsString = this.servicetemplateIds.join(',');
            this.cdr.markForCheck();
        }
    }

}

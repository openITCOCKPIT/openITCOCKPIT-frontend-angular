import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
    ViewChild
} from '@angular/core';
import {
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgSelectModule } from '@ng-select/ng-select';

import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'oitc-ldapgroups-add-to-usercontainerroles-modal',
    imports: [
        ButtonCloseDirective,
        XsButtonDirective,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        TranslocoDirective,
        FormsModule,
        NgSelectModule,
        RouterLink
    ],
    templateUrl: './ldapgroups-add-to-usercontainerroles.component.html',
    styleUrl: './ldapgroups-add-to-usercontainerroles.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LdapgroupsAddToUsercontainerrolesComponent implements OnChanges {
    @Input({required: true}) public items: SelectKeyValue[] = [];
    @Input({required: false}) public maintenanceMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();
    private readonly modalService: ModalService = inject(ModalService);
    protected hasErrors: boolean = false;
    protected isSend: boolean = false;
    protected state?: any

    protected joinedLdapgroupsIds: string = '';

    private cdr = inject(ChangeDetectorRef);

    @ViewChild('modal') private modal!: ModalComponent;

    public hideModal() {
        this.isSend = false;
        this.hasErrors = false;

        this.cdr.markForCheck();

        this.modalService.toggle({
            show: false,
            id: 'ldapgroupAddToUsercontainerrolesModal'
        });
    }

    public ngOnChanges() {
        this.joinedLdapgroupsIds = this.items.map(item => item.key).join(',');
    }

}

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output
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
import { Subscription } from 'rxjs';
import { UsersService } from '../../pages/users/users.service';
import { AllUser } from '../../pages/users/users.interface';

@Component({
    selector: 'oitc-reset-password-modal',
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
        XsButtonDirective
    ],
    templateUrl: './reset-password-modal.component.html',
    styleUrl: './reset-password-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordModalComponent implements OnInit, OnDestroy {

    @Output() completed = new EventEmitter<boolean>();
    @Input({required: true}) public user?: AllUser;

    private readonly modalService: ModalService = inject(ModalService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly UsersService: UsersService = inject(UsersService);

    private cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            //console.log(state);
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public hideModal() {
        this.modalService.toggle({
            show: false,
            id: 'resetPasswordModal'
        });
    }

    protected resetPassword() {
        if (!this.user) {
            return;
        }
        this.UsersService.resetPassword(this.user.id).subscribe({
            next: (response) => {
                this.hideModal();
            },
            error: (error) => {
                this.hideModal();
            }
        });
    }


}

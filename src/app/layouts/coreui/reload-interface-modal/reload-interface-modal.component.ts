import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    ViewChild
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
    ProgressComponent,
    RowComponent,
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-reload-interface-modal',
    imports: [
        ButtonCloseDirective,
        ColComponent,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgForOf,
        NgIf,
        ProgressComponent,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective
    ],
    templateUrl: './reload-interface-modal.component.html',
    styleUrl: './reload-interface-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReloadInterfaceModalComponent implements OnInit, OnDestroy {
    public percentage = 0;
    public reloadDelay = 3;
    public interfaceReloadIn = 3;

    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;

    private reloadInterval: any;

    private cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.id === 'reloadInterfaceModal') {
                // Modal is opened - fire reload countdown
                this.triggerReloadCountdown();
            }
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public triggerReloadCountdown(): void {
        if (this.reloadInterval) {
            clearInterval(this.reloadInterval);
        }

        let i = 0;
        this.reloadInterval = setInterval(() => {
            this.interfaceReloadIn--;
            i++;
            this.percentage = Math.round(i / this.reloadDelay * 100);

            if (i === this.reloadDelay) {
                clearInterval(this.reloadInterval);
                location.reload();
            }
            this.cdr.markForCheck();
        }, 1000);
    }

}

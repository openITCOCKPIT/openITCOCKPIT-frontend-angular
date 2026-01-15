import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalService
} from '@coreui/angular';

import { TranslocoDirective } from '@jsverse/transloco';
import { TrustAsHtmlPipe } from '../../pipes/trust-as-html.pipe';
import { CurrentMessageOfTheDay } from '../../pages/messagesotd/messagesotd.interface';
import { BbCodeParserService } from '../../services/bb-code-parser.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'oitc-message-of-the-day-modal',
    imports: [
        ButtonCloseDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalHeaderComponent,
        TranslocoDirective,
        TrustAsHtmlPipe,
        NgClass
    ],
    templateUrl: './message-of-the-day-modal.component.html',
    styleUrl: './message-of-the-day-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageOfTheDayModalComponent implements OnChanges {
    @Input({required: true}) public messageOfTheDay: CurrentMessageOfTheDay = {} as CurrentMessageOfTheDay;

    protected html: string = '';
    private readonly BbCodeParserService = inject(BbCodeParserService);
    private readonly ModalService = inject(ModalService);

    public ngOnChanges(changes: SimpleChanges) {
        if (!this.messageOfTheDay.messageOtd) {
            return;
        }
        this.html = this.BbCodeParserService.parse(this.messageOfTheDay.messageOtd.content);
        if (this.messageOfTheDay?.showMessageAfterLogin) {
            // Show the modal
        }
    }

    protected hideModal(): void {
        this.ModalService.toggle({
            show: false,
            id: 'messageOfTheDayModal'
        });
    }
}

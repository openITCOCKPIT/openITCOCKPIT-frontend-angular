import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalService,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective } from '@jsverse/transloco';
import { TrustAsHtmlPipe } from '../../pipes/trust-as-html.pipe';
import { CurrentMessageOfTheDay } from '../../pages/messagesotd/messagesotd.interface';
import { BbCodeParserService } from '../../services/bb-code-parser.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-message-of-the-day-modal',
    standalone: true,
    imports: [
        ButtonCloseDirective,
        ColComponent,
        FaIconComponent,
        FaStackComponent,
        FaStackItemSizeDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalHeaderComponent,
        RowComponent,
        TranslocoDirective,
        TrustAsHtmlPipe,
        NgIf
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
        if (! this.messageOfTheDay.messageOtd) {
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

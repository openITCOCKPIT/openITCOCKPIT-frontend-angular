/*
 * Copyright (C) <2015>  <it-novum GmbH>
 *
 * This file is dual licensed
 *
 * 1.
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, version 3 of the License.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * 2.
 *     If you purchased an openITCOCKPIT Enterprise Edition you can use this file
 *     under the terms of the openITCOCKPIT Enterprise Edition license agreement.
 *     License agreement and license key will be shipped with the order
 *     confirmation.
 */

import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    ButtonCloseDirective, ColComponent,
    FormControlDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    RowComponent,
} from '@coreui/angular';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { XsButtonDirective } from '../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { MessagesOfTheDayService } from '../../pages/messagesotd/messagesotd.service';
import { CurrentMessageOfTheDay, MessageOfTheDay } from '../../pages/messagesotd/messagesotd.interface';
import { BbCodeParserService } from '../../services/bb-code-parser.service';
import { TrustAsHtmlPipe } from '../../pipes/trust-as-html.pipe';


type NewBookmark = {
    name: string
    filter: string;
    favorite: boolean
}

@Component({
    selector: 'oitc-message-of-the-day',
    standalone: true,
    imports: [
        TranslocoDirective,
        ModalComponent,
        ButtonCloseDirective,
        ModalHeaderComponent,
        ModalTitleDirective,
        XsButtonDirective,
        FaIconComponent,
        ModalFooterComponent,
        ModalBodyComponent,
        RowComponent,
        FormsModule,
        NgIf,
        FormControlDirective,
        NgClass,
        ColComponent,
        FaStackComponent,
        FaStackItemSizeDirective,
        TrustAsHtmlPipe
    ],
    templateUrl: './message-of-the-day.component.html',
    styleUrl: './message-of-the-day.component.css'
})
export class MessageOfTheDayComponent implements OnInit, OnDestroy {

    private readonly modalService = inject(ModalService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly MessagesOfTheDayService = inject(MessagesOfTheDayService);
    private readonly BbCodeParserService = inject(BbCodeParserService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected html: string = '';
    protected messageOfTheDay: CurrentMessageOfTheDay = {
        messageOtdAvailable: false,
        messageOtd: {} as MessageOfTheDay,
        showMessageAfterLogin: false
    } as CurrentMessageOfTheDay;

    public hideModal() {
        this.modalService.toggle({
            show: false,
            id: 'messageOfTheDayModal'
        });
        this.cdr.markForCheck();
    }

    public showModal() {
        this.modalService.toggle({
            show: true,
            id: 'messageOfTheDayModal'
        });
        this.cdr.markForCheck();
    }

    ngOnInit() {
        // Fetch current message of the day.
        this.subscriptions.add(this.MessagesOfTheDayService.getCurrentMessageOfTheDay().subscribe((message: CurrentMessageOfTheDay) => {
            this.messageOfTheDay = message;
            this.html = this.BbCodeParserService.parse(message.messageOtd.content || '');

            if (this.messageOfTheDay.showMessageAfterLogin) {
                this.showModal();
            }
        }));
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}

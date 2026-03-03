import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MessageOfTheDay } from '../messagesotd.interface';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgClass } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SelectKeyValue, SelectKeyValueString } from '../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { HistoryService } from '../../../history.service';
import { MessagesOfTheDayService } from '../messagesotd.service';
import { UsergroupsService } from '../../usergroups/usergroups.service';
import { UsergroupIndex, UsergroupsIndexParams, UsergroupsIndexRoot } from '../../usergroups/usergroups.interface';
import { BbCodeParserService } from '../../../services/bb-code-parser.service';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';
import { BbCodeEditorComponent } from '../../documentations/bb-code-editor/bb-code-editor.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';


@Component({
    selector: 'oitc-messagesotd-add',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormCheckInputDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormCheckComponent,
        RowComponent,
        ColComponent,
        TrustAsHtmlPipe,
        BbCodeEditorComponent,
        InputGroupComponent,
        DropdownComponent,
        DropdownMenuDirective,
        InputGroupTextDirective,
        DropdownToggleDirective,
        DropdownItemDirective,
        TrueFalseDirective,
        FormCheckLabelDirective,
        NgClass
    ],
    templateUrl: './messagesotd-add.component.html',
    styleUrl: './messagesotd-add.component.css'
})
export class MessagesotdAddComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly router: Router = inject(Router);
    private readonly UsergroupsService: UsergroupsService = inject(UsergroupsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly MessagesOfTheDayService = inject(MessagesOfTheDayService);
    private readonly BbCodeParserService = inject(BbCodeParserService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected post: MessageOfTheDay = this.getDefaultPost();
    protected usergroups: SelectKeyValue[] = [];
    protected readonly styles: SelectKeyValueString[] = [
        {key: 'info', value: 'Info'} as SelectKeyValueString,
        {key: 'primary', value: 'Primary'} as SelectKeyValueString,
        {key: 'success', value: 'Success'} as SelectKeyValueString,
        {key: 'warning', value: 'Warning'} as SelectKeyValueString,
        {key: 'danger', value: 'Danger'} as SelectKeyValueString
    ] as SelectKeyValueString[];
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected html: string = '';
    protected placeholder: string = '';
    protected createAnother: boolean = false;

    constructor() {
        this.post = this.getDefaultPost();
    }


    private getDefaultPost(): MessageOfTheDay {
        return {
            title: '',
            description: '',
            content: '',
            style: 'primary',
            date: '',
            expiration_duration: null,
            expire: false,
            name: '', // This field seems unused but is transported.
            notify_users: 0,
            usergroups: {
                _ids: []
            }
        } as MessageOfTheDay;
    }

    protected onChangeOfBbCode(event: any): void {
        this.html = this.BbCodeParserService.parse(this.post.content);
    }

    protected addMessageOfTheDay(): void {
        this.subscriptions.add(this.MessagesOfTheDayService.addMessageOfTheDay(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Message of the day');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    const url: (string | number)[] = ['messagesOtd', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/messagesOtd/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.html = '';
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();
                    this.errors = {} as GenericValidationError;
                    return;
                }

                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

    protected setExpiration(expiration: boolean): void {
        this.post.expire = expiration;
        if (!expiration) {
            this.post.expiration_duration = null;
            this.placeholder = '';
        } else {
            this.placeholder = '1';
        }
        this.cdr.markForCheck();
    }

    public ngOnInit() {
        this.loadUsergroups();
    }

    private loadUsergroups(): void {
        this.subscriptions.add(this.UsergroupsService.getIndex({} as UsergroupsIndexParams)
            .subscribe((result: UsergroupsIndexRoot): void => {
                this.usergroups = [];

                // Simplify the object
                result.allUsergroups.forEach((value: UsergroupIndex) => {
                    this.usergroups.push({
                        value: value.name,
                        key: value.id
                    });
                })
            }))
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}

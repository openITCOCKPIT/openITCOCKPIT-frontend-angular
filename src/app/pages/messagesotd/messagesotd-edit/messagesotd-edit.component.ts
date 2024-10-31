import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { BbCodeEditorComponent } from '../../documentations/bb-code-editor/bb-code-editor.component';
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
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgClass, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SelectKeyValue, SelectKeyValueString } from '../../../layouts/primeng/select.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { BbCodeParserService } from '../../../services/bb-code-parser.service';
import { EditableMessageOfTheDay } from '../messagesotd.interface';
import { MessagesOfTheDayService } from '../messagesotd.service';
import { HistoryService } from '../../../history.service';
import { UsergroupsService } from '../../usergroups/usergroups.service';
import { UsergroupIndex, UsergroupsIndexParams, UsergroupsIndexRoot } from '../../usergroups/usergroups.interface';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';

@Component({
    selector: 'oitc-messagesotd-edit',
    standalone: true,
    imports: [
        BackButtonDirective,
        BbCodeEditorComponent,
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
        FaIconComponent,
        FaStackComponent,
        FaStackItemSizeDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        PermissionDirective,
        RequiredIconComponent,
        RowComponent,
        SelectComponent,
        TranslocoDirective,
        TrustAsHtmlPipe,
        XsButtonDirective,
        RouterLink,
        FormLoaderComponent,
        FormCheckLabelDirective,
        TrueFalseDirective,
        NgClass
    ],
    templateUrl: './messagesotd-edit.component.html',
    styleUrl: './messagesotd-edit.component.css'
})
export class MessagesotdEditComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly router: Router = inject(Router);
    private readonly UsergroupsService: UsergroupsService = inject(UsergroupsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly MessagesOfTheDayService = inject(MessagesOfTheDayService);
    private readonly BbCodeParserService = inject(BbCodeParserService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected post: EditableMessageOfTheDay = {
        title: '',
        description: '',
        content: '',
        style: 'primary',
        date: '',
        expiration_duration: 0,
        expire: false,
        name: '', // This field seems unused but is transported.
        notify_users: 0,
        usergroups: {
            _ids: []
        },
        id: 0,
        created: '',
        modified: '',
        user_id: 0
    } as EditableMessageOfTheDay;
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

    protected onChangeOfBbCode(event: any): void {
        this.html = this.BbCodeParserService.parse(this.post.content);
    }


    public ngOnInit(): void {
        this.loadUsergroups();

        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.MessagesOfTheDayService.getEdit(id)
            .subscribe((result: EditableMessageOfTheDay) => {
                this.post = result;
                this.post.expire = this.post.expiration_duration > 0;
                this.html = this.BbCodeParserService.parse(this.post.content);
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    protected updateMessageOfTheDay(): void {
        if (!this.post.expire) {
            this.post.expiration_duration = 0;
        }
        this.subscriptions.add(this.MessagesOfTheDayService.updateMessageOfTheDay(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Message of the day');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['/', 'messagesOtd', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.HistoryService.navigateWithFallback(['/messagesOtd/index']);
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

    protected setExpiration(expiration: boolean): void {
        this.post.expire = expiration;
    }


}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { HistoryService } from '../../../../../history.service';
import { ContainersService } from '../../../../../pages/containers/containers.service';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    ModalService,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { ColorPicker } from 'primeng/colorpicker';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { ChangecalendarsService } from '../changecalendars.service';
import { ContainersLoadContainersByStringParams } from '../../../../../pages/containers/containers.interface';
import { ChangecalendarEvent, EditChangecalendar, EditChangecalendarRoot } from '../changecalendars.interface';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { CalendarComponent } from '../../../../../pages/calendars/calendar/calendar.component';
import { CalendarEvent } from '../../../../../pages/calendars/calendars.interface';
import {
    ChangecalendarsEventEditorComponent
} from '../../../components/changecalendars-event-editor/changecalendars-event-editor.component';
import { EventClickArg } from '@fullcalendar/core';

@Component({
    selector: 'oitc-changecalendars-edit',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColorPicker,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgIf,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormLoaderComponent,
        CalendarComponent,
        ChangecalendarsEventEditorComponent
    ],
    templateUrl: './changecalendars-edit.component.html',
    styleUrl: './changecalendars-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangecalendarsEditComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly ChangecalendarsService: ChangecalendarsService = inject(ChangecalendarsService);
    private readonly ContainersService: ContainersService = inject(ContainersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly route = inject(ActivatedRoute);
    private readonly ModalService: ModalService = inject(ModalService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected post: EditChangecalendarRoot = {
        changeCalendar: {}
    } as EditChangecalendarRoot;
    protected events: CalendarEvent[] = [];
    protected containers: SelectKeyValue[] = [];
    protected errors: GenericValidationError = {} as GenericValidationError;

    protected event: ChangecalendarEvent = {
        title: '',
        description: '',
        start: '',
        end: '',
        changecalendar_id: 0,
    } as ChangecalendarEvent;

    public editEvent(clickInfo: EventClickArg): void {
        // set this.event to the event from this.events where the originId matches clickInfo.event._def.extendedProps.originId
        this.event = this.post.changeCalendar.changecalendar_events.find((event: ChangecalendarEvent) => {
            return event.id === clickInfo.event._def.extendedProps['originId'];
        }) as ChangecalendarEvent;

        console.warn(this.event);

        this.ModalService.toggle({
            show: true,
            id: 'changeCalendarEditorModal'
        });

        this.cdr.markForCheck();
        return;
        /*
        this.event = event;


        this.cdr.markForCheck();

         */
    }

    public ngOnInit() {
        this.loadContainers();
        this.loadEditChangecalendar();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }


    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    private loadEditChangecalendar(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.ChangecalendarsService.getEdit(id)
            .subscribe((result: EditChangecalendar) => {
                this.post = result;
                this.events = result.events;
                this.cdr.markForCheck();
            }));
    }


    public updateChangecalendar(): void {
        this.subscriptions.add(this.ChangecalendarsService.updateChangecalendar(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const title: string = this.TranslocoService.translate('Changecalendar');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['changecalendar_module', 'changecalendars', 'edit', result.data.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/changecalendar_module/changecalendars/index']);
                    return;
                }
                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;

                    console.warn(this.errors);
                }
            })
        );
    }

}

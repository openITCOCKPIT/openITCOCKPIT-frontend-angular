import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Router, RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { UserMacrosModalComponent } from '../../commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { CalendarContainer, CalendarPost } from '../calendars.interface';
import { GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { CalendarsService } from '../calendars.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgForOf } from '@angular/common';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

@Component({
    selector: 'oitc-calendars-add',
    standalone: true,
    imports: [
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormDirective,
        FormsModule,
        ReactiveFormsModule,
        BackButtonDirective,
        NavComponent,
        NavItemComponent,
        UserMacrosModalComponent,
        XsButtonDirective,
        CardBodyComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        CardFooterComponent,
        NgSelectModule,
        NgForOf,
        NgOptionHighlightModule
    ],
    templateUrl: './calendars-add.component.html',
    styleUrl: './calendars-add.component.css'
})
export class CalendarsAddComponent implements OnInit, OnDestroy {
    public post: CalendarPost = {
        container_id: 0,
        name: "",
        description: ""
    }
    public containers: CalendarContainer[] = [];
    public errors: GenericValidationError | null = null;

    private CalendarsService = inject(CalendarsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private router = inject(Router);

    private subscriptions: Subscription = new Subscription();

    public ngOnInit() {
        this.subscriptions.add(this.CalendarsService.getAdd()
            .subscribe((result) => {
                console.log(result);
            }));
        this.loadContainers();
    }

    public ngOnDestroy(): void {
    }


    private loadContainers() {
        this.subscriptions.add(this.CalendarsService.getContainers()
            .subscribe((result) => {
                this.containers = result;
            })
        );
    }
}

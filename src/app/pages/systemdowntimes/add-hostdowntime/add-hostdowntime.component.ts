import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { UserMacrosModalComponent } from '../../commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectKeyValueWithDisabled } from '../../../layouts/primeng/select.interface';
import { GenericValidationError } from '../../../generic-responses';
import { SystemdowntimesHostGet, SystemdowntimesHostPost } from '../systemdowntimes.interface';
import { HostsLoadHostsByStringParams } from '../../hosts/hosts.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { HostsService } from '../../hosts/hosts.service';
import { SystemdowntimesService } from '../systemdowntimes.service';
import { JsonPipe } from '@angular/common';
import { ObjectTypesEnum } from '../../changelogs/object-types.enum';
import { TrueFalseDirective } from '../../../directives/true-false.directive';


@Component({
    selector: 'oitc-add-hostdowntime',
    standalone: true,
    imports: [
        CardComponent,
        CoreuiComponent,
        FaIconComponent,
        FormDirective,
        FormsModule,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        BackButtonDirective,
        CardBodyComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        UserMacrosModalComponent,
        XsButtonDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        InputGroupComponent,
        MultiSelectComponent,
        RequiredIconComponent,
        JsonPipe,
        FormCheckComponent,
        FormCheckLabelDirective,
        FormCheckInputDirective,
        FormControlDirective,
        TrueFalseDirective
    ],
    templateUrl: './add-hostdowntime.component.html',
    styleUrl: './add-hostdowntime.component.css'
})
export class AddHostdowntimeComponent implements OnInit, OnDestroy {
    public hosts: SelectKeyValueWithDisabled[] = [];
    public errors: GenericValidationError | null = null;
    public post: SystemdowntimesHostPost = {
        is_recurring: 0,
        weekdays: {},
        day_of_month: '',
        from_date: '',
        from_time: '',
        to_date: '',
        to_time: '',
        duration: 15,
        downtime_type: 'host',
        downtimetype_id: '0',
        objecttype_id: ObjectTypesEnum['HOST'],
        object_id: [],
        comment: '',
        is_recursive: 0
    }
    public get!: SystemdowntimesHostGet;
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private router: Router = inject(Router);
    private readonly HostsService = inject(HostsService);
    private readonly SystemdowntimesService = inject(SystemdowntimesService);
    private subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
        this.subscriptions.add(this.SystemdowntimesService.loadDefaults()
            .subscribe((result) => {
                let fromDate: Date = this.parseDateTime(result.defaultValues.js_from);
                let toDate: Date = this.parseDateTime(result.defaultValues.js_to);
                this.post.from_date = fromDate;
                this.post.from_time = fromDate;
                this.post.to_date = toDate;
                this.post.to_time = toDate;
                this.post.comment = result.defaultValues.comment;
                this.post.duration = result.defaultValues.duration;
                this.post.downtimetype_id = result.defaultValues.downtimetype_id;
            }));
        this.loadHosts('');

    }

    public ngOnDestroy(): void {
    }

    public loadHosts = (searchString: string) => {
        let selected: number[] = [];
        if (this.post.object_id) {
            selected = this.post.object_id;
        }
        console.log(this.post);

        let params: HostsLoadHostsByStringParams = {
            angular: true,
            'filter[Hosts.name]': searchString,
            'selected[]': selected,
            includeDisabled: false
        }

        this.subscriptions.add(this.HostsService.loadHostsByString(params, true)
            .subscribe((result) => {
                this.hosts = result;
            })
        );
    }

    private parseDateTime(jsStringData: string): Date {
        let splitData = jsStringData.split(',');
        let date: Date = new Date(Number(splitData[0]), Number(splitData[1]) - 1, Number(splitData[2]));
        date.setHours(Number(splitData[3]), Number(splitData[4]), 0);
        return date;

    }
}

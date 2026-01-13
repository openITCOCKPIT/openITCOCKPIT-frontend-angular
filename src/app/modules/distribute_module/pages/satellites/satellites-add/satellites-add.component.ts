import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { HistoryService } from '../../../../../history.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SatellitesAddRoot } from '../satellites.interface';
import { Subscription } from 'rxjs';
import { SatellitesService } from '../satellites.service';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { SelectKeyValue, SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../../../services/timezone.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
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
    NavItemComponent
} from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { UserTimezonesSelect } from '../../../../../pages/users/users.interface';
import { ProfileService } from '../../../../../pages/profile/profile.service';

import { UsersService } from '../../../../../pages/users/users.service';

@Component({
    selector: 'oitc-satellites-add',
    imports: [
    TranslocoDirective,
    FaIconComponent,
    PermissionDirective,
    RouterLink,
    FormDirective,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    BackButtonDirective,
    NavComponent,
    NavItemComponent,
    XsButtonDirective,
    CardBodyComponent,
    CardFooterComponent,
    FormCheckInputDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    SelectComponent,
    FormCheckComponent,
    FormCheckLabelDirective,
    TrueFalseDirective,
    RequiredIconComponent,
    NgOptionTemplateDirective,
    NgSelectComponent,
    NgOptionHighlightDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective
],
    templateUrl: './satellites-add.component.html',
    styleUrl: './satellites-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SatellitesAddComponent implements OnDestroy, OnInit {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly SatellitesService: SatellitesService = inject(SatellitesService);
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly TimezoneService: TimezoneService = inject(TimezoneService);
    private readonly ProfileService: ProfileService = inject(ProfileService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected timezone!: TimezoneObject;
    protected createAnother: boolean = false;
    protected containers: SelectKeyValue[] = [];
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected readonly syncMethods: SelectKeyValueString[] = [
        {value: 'SSH', key: 'ssh'},
        {value: this.TranslocoService.translate('HTTPS pull mode'), key: 'https_pull'},
        {value: this.TranslocoService.translate('HTTPS push mode'), key: 'https_push'},
    ]

    protected timezones: UserTimezonesSelect[] = [];
    protected post: SatellitesAddRoot = this.getDefaultPost();
    protected serverTime: string = '';
    protected serverTimeZone: string = '';

    public ngOnInit() {
        this.loadContainers();
        this.getUserTimezone();
        this.getTimeZones();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    protected setUrlProtocol(protocol: string): void {
        this.post.protocol = protocol;
        this.cdr.markForCheck();
    }

    protected setProxyProtocol(protocol: string): void {
        this.post.proxyProtocol = protocol;
        this.cdr.markForCheck();
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.SatellitesService.loadAllContainers()
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.post.Satellite.timezone = data.user_timezone;
            this.cdr.markForCheck();
        }));
    }

    private getTimeZones(): void {
        this.subscriptions.add(this.UsersService.getDateformats().subscribe(data => {
            this.timezones = data.timezones;
            this.cdr.markForCheck();
        }));
    }

    protected refreshApiKey(): void {
        this.subscriptions.add(this.ProfileService.generateNewApiKey()
            .subscribe((result) => {
                this.post.Satellite.api_key = result.apikey;
                this.cdr.markForCheck();
            })
        );
    }

    public addSatellite(): void {
        this.post.Satellite.url = `${this.post.protocol}://${this.post.Satellite.address}/${this.post.frontendUrl}`;
        this.post.Satellite.proxy_url = '';
        if (this.post.Satellite.use_proxy) {
            this.post.Satellite.proxy_url = `${this.post.proxyProtocol}://${this.post.proxyUrl}`;
        }
        this.subscriptions.add(this.SatellitesService.addSatellite(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                if (result.success) {
                    const title: string = this.TranslocoService.translate('Satellite');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    const url: (string | number)[] = ['distribute_module', 'satellites', 'edit', result.data.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/distribute_module/satellites/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.errors = {} as GenericValidationError;
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();

                    this.cdr.markForCheck();
                    return;
                }

                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;
                }
                this.cdr.markForCheck();
            })
        );
    }

    private getDefaultPost(): SatellitesAddRoot {
        return {
            Satellite: {
                address: '',
                api_key: '',
                container_id: 0,
                description: '',
                interval: 10,
                login: 'nagios',
                name: '',
                port: 22,
                private_key_path: '/var/lib/nagios/.ssh/id_rsa',
                proxy_url: '',
                remote_port: 4730,
                sync_method: 'https_pull',
                timeout: 300,
                timezone: '',
                url: '',
                use_proxy: 0,
                use_timesync: 0,
                verify_certificate: 1,
            },
            frontendUrl: '',
            protocol: 'https',
            proxyProtocol: 'https',
            proxyUrl: ''
        }
    }
}

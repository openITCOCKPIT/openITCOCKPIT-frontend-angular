import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../../../services/timezone.service';
import { SelectKeyValue, SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { UserTimezonesSelect } from '../../../../../pages/users/users.interface';
import { EditSatellitePostRoot, EditSatelliteRoot } from '../satellites.interface';
import { SatellitesService } from '../satellites.service';
import { UsersService } from '../../../../../pages/users/users.service';
import { HistoryService } from '../../../../../history.service';
import { ProfileService } from '../../../../../pages/profile/profile.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
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
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { NgIf } from '@angular/common';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-satellites-edit',
    imports: [
        FormsModule,
        FaIconComponent,
        FormFeedbackComponent,
        RequiredIconComponent,
        InputGroupComponent,
        FormErrorDirective,
        DropdownComponent,
        TrueFalseDirective,
        FormCheckComponent,
        SelectComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        NavComponent,
        NavItemComponent,
        BackButtonDirective,
        RouterLink,
        PermissionDirective,
        FormLabelDirective,
        FormControlDirective,
        FormCheckLabelDirective,
        FormCheckInputDirective,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownItemDirective,
        NgIf,
        InputGroupTextDirective,
        NgSelectComponent,
        NgOptionTemplateDirective,
        CardFooterComponent,
        TranslocoDirective,
        FormLoaderComponent,
        NgOptionHighlightDirective,
        BackButtonDirective,
        XsButtonDirective,
        CardTitleDirective,
        FormDirective
    ],
    templateUrl: './satellites-edit.component.html',
    styleUrl: './satellites-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SatellitesEditComponent implements OnDestroy, OnInit {
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
    protected post: EditSatellitePostRoot = {Satellite: {id: 0}} as EditSatellitePostRoot;
    protected serverTime: string = '';
    protected serverTimeZone: string = '';


    public ngOnInit() {
        this.loadContainers();
        this.getUserTimezone();
        this.getTimeZones();
        this.loadEditSatellite();
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


    private readonly route = inject(ActivatedRoute);

    private loadEditSatellite(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.SatellitesService.getEdit(id)
            .subscribe((result: EditSatelliteRoot) => {
                this.post = {
                    frontendUrl: '',
                    Satellite: result.satellite
                }

                this.post.protocol = 'https';
                if (this.post.Satellite.url.startsWith('http://')) {
                    this.post.protocol = 'http';
                }
                this.post.proxyProtocol = 'https';
                if (this.post.Satellite.proxy_url.startsWith('http://')) {
                    this.post.proxyProtocol = 'http';
                }


                if (this.post.Satellite.url) {
                    this.post.frontendUrl = this.post.Satellite.url.replaceAll(`${this.post.protocol}://${this.post.Satellite.address}/`, '');
                }

                if (this.post.Satellite.proxy_url) {
                    this.post.proxyUrl = this.post.Satellite.proxy_url.replaceAll(`${this.post.proxyProtocol}://`, '');
                }

                this.cdr.markForCheck();
            }));
    }

    protected updateSatellite(): void {

        this.post.Satellite.url = `${this.post.protocol}://${this.post.Satellite.address}/${this.post.frontendUrl}`;
        this.subscriptions.add(this.SatellitesService.updateSatellite(this.post.Satellite.id, this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const title: string = this.TranslocoService.translate('Satellite');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['distribute_module', 'satellites', 'edit', result.data.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/distribute_module/satellites/index']);
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

    protected refreshApiKey(): void {
        this.subscriptions.add(this.ProfileService.generateNewApiKey()
            .subscribe((result) => {
                this.post.Satellite.api_key = result.apikey;
                this.cdr.markForCheck();
            })
        );
    }


}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    AlertComponent,
    AlertHeadingDirective,
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CodeMirrorContainerComponent
} from '../../../components/code-mirror-container/code-mirror-container.component';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { UserMacrosModalComponent } from '../../commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocationPost } from '../locations.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { LocationsService } from '../locations.service';
import { NgOptionComponent, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { UserTimezonesSelect } from '../../users/users.interface';
import { UsersService } from '../../users/users.service';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../history.service';
import { VectormapComponent } from '../../../components/vectormap/vectormap.component';
import { VectormapMarker } from '../../../components/vectormap/vactormap.interface';

@Component({
    selector: 'oitc-locations-add',
    imports: [
        AlertComponent,
        AlertHeadingDirective,
        BackButtonDirective,
        ButtonCloseDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CodeMirrorContainerComponent,
        FaIconComponent,
        FormCheckComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormSelectDirective,
        FormTextDirective,
        FormsModule,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        TranslocoPipe,
        UserMacrosModalComponent,
        XsButtonDirective,
        RouterLink,
        FormCheckInputDirective,
        ModalToggleDirective,
        NgOptionComponent,
        NgSelectComponent,
        SelectComponent,
        NgOptionTemplateDirective,
        NgOptionHighlightDirective,
        VectormapComponent
    ],
    templateUrl: './locations-add.component.html',
    styleUrl: './locations-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsAddComponent implements OnInit, OnDestroy {

    public createAnother: boolean = false;
    public containers: SelectKeyValue[] = [];
    public timezones: UserTimezonesSelect[] = [];
    public post: LocationPost = this.getDefaultPost();
    public errors: GenericValidationError | null = null;

    // For the map only
    public markers: VectormapMarker[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly LocationsService = inject(LocationsService);
    private readonly UsersService = inject(UsersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.loadContainers();
        this.loadTimezones();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public getDefaultPost(): LocationPost {
        return {
            description: '',
            latitude: null,
            longitude: null,
            timezone: 'Europe/Berlin',
            container: {
                name: '',
                parent_id: 0
            }
        }
    }

    public loadContainers() {
        this.subscriptions.add(this.LocationsService.loadContainers().subscribe(containers => {
            this.containers = containers;
            this.cdr.markForCheck();
        }));
    }

    public loadTimezones() {
        this.subscriptions.add(this.UsersService.getDateformats().subscribe(data => {
            this.timezones = data.timezones;
            this.cdr.markForCheck();
        }));
    }

    public submit() {
        this.subscriptions.add(this.LocationsService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Location');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['locations', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/locations/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.markers = [];
                    this.notyService.scrollContentDivToTop();
                    this.errors = null;
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            }));
    }

    public updateMarker() {
        const latitude = Number(this.post.latitude);
        const longitude = Number(this.post.longitude);

        // If we pass wrong values to the map, the marker of the map will fail
        if (latitude <= 90 && latitude >= -90 && longitude <= 180 && longitude >= -180) {
            const marker: VectormapMarker = {
                name: this.post.container.name,
                coords: [latitude, longitude],
                style: {
                    initial: {
                        fill: '#6261cc'
                    }
                }
            };

            this.markers = [marker];
            this.cdr.markForCheck();
        }
    }

}

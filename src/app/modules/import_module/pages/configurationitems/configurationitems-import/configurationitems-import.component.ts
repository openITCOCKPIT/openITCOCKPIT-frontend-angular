import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgClass, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { UiBlockerComponent } from '../../../../../components/ui-blocker/ui-blocker.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { GenericValidationError } from '../../../../../generic-responses';
import { ProfileMaxUploadLimit } from '../../../../../pages/profile/profile.interface';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ConfigurationitemsService } from '../configurationitems.service';

@Component({
    selector: 'oitc-configurationitems-import',
    standalone: true,
    imports: [
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormDirective,
        FormLabelDirective,
        FormLoaderComponent,
        FormsModule,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        PermissionDirective,
        TranslocoDirective,
        UiBlockerComponent,
        XsButtonDirective,
        NgClass,
        RouterLink,
        RowComponent,
        ColComponent
    ],
    templateUrl: './configurationitems-import.component.html',
    styleUrl: './configurationitems-import.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationitemsImportComponent implements OnInit, OnDestroy {

    public errors: GenericValidationError | null = null;
    public maxUploadLimit?: ProfileMaxUploadLimit;

    private subscriptions: Subscription = new Subscription();
    private readonly ConfigurationitemsService = inject(ConfigurationitemsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadMaxUploadLimit(): void {
        this.subscriptions.add(this.ConfigurationitemsService.loadMaxUploadLimit().subscribe(response => {
            this.maxUploadLimit = response;
        }));
    }

    public submit() {
    }

}

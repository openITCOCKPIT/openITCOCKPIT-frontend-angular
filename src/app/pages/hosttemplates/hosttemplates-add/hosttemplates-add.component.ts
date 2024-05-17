import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { UserMacrosModalComponent } from '../../commands/user-macros-modal/user-macros-modal.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HosttemplateTypesEnum } from '../hosttemplate-types.enum';

@Component({
    selector: 'oitc-hosttemplates-add',
    standalone: true,
    imports: [
        CoreuiComponent,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        TranslocoDirective,
        UserMacrosModalComponent,
        XsButtonDirective,
        RouterLink
    ],
    templateUrl: './hosttemplates-add.component.html',
    styleUrl: './hosttemplates-add.component.css'
})
export class HosttemplatesAddComponent implements OnInit, OnDestroy {

    private hosttemplateTypeId = HosttemplateTypesEnum.GENERIC_HOSTTEMPLATE;

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            let hosttemplateTypeId = params['hosttemplateTypeId'];
            if (hosttemplateTypeId === undefined) {
                hosttemplateTypeId = HosttemplateTypesEnum.GENERIC_HOSTTEMPLATE
            }
            this.hosttemplateTypeId = Number(hosttemplateTypeId);
        });
    }

    public ngOnDestroy(): void {
    }

}

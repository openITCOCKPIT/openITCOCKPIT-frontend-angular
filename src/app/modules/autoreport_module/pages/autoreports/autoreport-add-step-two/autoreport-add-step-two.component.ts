import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormDirective, RowComponent
} from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'oitc-autoreport-add-step-two',
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
        CardBodyComponent,
        BadgeComponent,
        RowComponent,
        TranslocoPipe
    ],
  templateUrl: './autoreport-add-step-two.component.html',
  styleUrl: './autoreport-add-step-two.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportAddStepTwoComponent {


    public submitAddStepTwo() {}
}

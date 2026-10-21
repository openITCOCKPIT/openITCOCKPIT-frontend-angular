import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { TranslocoDirective } from '@jsverse/transloco';
import {
    BorderDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DowntimeObject } from '../../../pages/downtimes/downtimes.interface';

@Component({
    selector: "oitc-downtime-component",
    imports: [
        TranslocoDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        ColComponent,
        FaIconComponent,
        PermissionDirective,
        RowComponent,
        XsButtonDirective,
        BorderDirective
    ],
    templateUrl: "./downtime-component.component.html",
    styleUrl: "./downtime-component.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DowntimeComponent {

    private _Downtime: DowntimeObject = {} as DowntimeObject;
    private _DowntimeType: string = '';

    @Output() onCancelClick: EventEmitter<void> = new EventEmitter<void>();

    @Input({required: true})
    set Downtime(Downtime: DowntimeObject) {
        this._Downtime = Downtime;
    }

    get Downtime(): DowntimeObject {
        return this._Downtime;
    }

    @Input({required: true})
    set DowntimeType(DowntimeType: string) {
        this._DowntimeType = DowntimeType;
    }

    get DowntimeType(): string {
        return this._DowntimeType;
    }

    protected clickCancel(): void {
        this.onCancelClick.emit();
    }
}

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    input,
    InputSignal,
    OnDestroy,
    OnInit
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import {
    BgColorDirective,
    CardBodyComponent, CardComponent,
    ColComponent,
    RowComponent,
    TemplateIdDirective,
    TextColorDirective,
    WidgetStatFComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { LocalNumberPipe } from '../../../pipes/local-number.pipe';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { PackagesTotalSummary } from '../packages.interface';
import { Subscription } from 'rxjs';
import { PackagesService } from '../packages.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { AgentconnectorOperatingSystems } from '../../agentconnector/agentconnector.enums';
import { PermissionDirective } from '../../../permissions/permission.directive';

@Component({
    selector: 'oitc-packages-summary',
    imports: [
        AsyncPipe,
        BlockLoaderComponent,
        ColComponent,
        FaIconComponent,
        LocalNumberPipe,
        RowComponent,
        TemplateIdDirective,
        TranslocoPipe,
        WidgetStatFComponent,
        TranslocoDirective,
        RouterLink,
        TextColorDirective,
        PermissionDirective,
        CardBodyComponent,
        CardComponent,
        BgColorDirective
    ],
    templateUrl: './packages-summary.component.html',
    styleUrl: './packages-summary.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesSummaryComponent implements OnInit, OnDestroy {

    public summary?: PackagesTotalSummary;

    private readonly subscriptions: Subscription = new Subscription();
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly PackagesService = inject(PackagesService);
    public readonly PermissionsService = inject(PermissionsService);

    /**
     * OS Family the component linux, windows or macos.
     * @type InputSignal<'linux' | 'windows' | 'macos'>
     */
    readonly os_family: InputSignal<'linux' | 'windows' | 'macos'> = input<'linux' | 'windows' | 'macos'>('linux');

    public ngOnInit(): void {
        this.subscriptions.add(
            this.PackagesService.getSummary().subscribe((summary) => {
                this.summary = summary;
                this.cdr.markForCheck();
            })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    protected readonly String = String;
    protected readonly AgentconnectorOperatingSystems = AgentconnectorOperatingSystems;
}

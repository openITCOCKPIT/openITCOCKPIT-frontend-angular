import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';

import { AgentconnectorOperatingSystems } from '../../../../../pages/agentconnector/agentconnector.enums';
import { MkagentsListDownloadsComponent } from './mkagents-list-downloads/mkagents-list-downloads.component';
import { MkagentsDownloadRoot } from '../mkagents.interface';
import { Subscription } from 'rxjs';
import { MkagentsService } from '../mkagents.service';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';

@Component({
    selector: 'oitc-mkagents-download',
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardBodyComponent,
        RowComponent,
        ColComponent,
        AlertComponent,
        MkagentsListDownloadsComponent,
        BlockLoaderComponent
    ],
    templateUrl: './mkagents-download.component.html',
    styleUrl: './mkagents-download.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MkagentsDownloadComponent implements OnInit, OnDestroy {

    public base_path: string = '';
    public agentDownloads?: MkagentsDownloadRoot;

    private subscriptions: Subscription = new Subscription();
    private readonly MkagentsService = inject(MkagentsService)
    private cdr = inject(ChangeDetectorRef);

    protected readonly AgentconnectorOperatingSystems = AgentconnectorOperatingSystems;

    public ngOnInit(): void {
        this.subscriptions.add(this.MkagentsService.getDownload().subscribe(data => {
            this.agentDownloads = data;
            this.base_path = data.base_path;
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}

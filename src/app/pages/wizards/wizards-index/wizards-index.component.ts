import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    ColComponent,
    ModalService,
    RowComponent
} from '@coreui/angular';
import { WizardsService } from '../wizards.service';
import { WizardsIndex } from '../wizards.interface';
import { KeyValuePipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';

@Component({
    selector: 'oitc-wizards-index',
    standalone: true,
    imports: [
        RowComponent,
        ColComponent,
        NgIf,
        NgForOf,
        KeyValuePipe,
        CardComponent,
        CardBodyComponent,
        NgOptimizedImage,
        CardFooterComponent,
        FaIconComponent,
        BadgeOutlineComponent
    ],
    templateUrl: './wizards-index.component.html',
    styleUrl: './wizards-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardsIndexComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly WizardsService: WizardsService = inject(WizardsService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected result?: WizardsIndex;


    public ngOnInit() {
        this.loadWizards();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private loadWizards(): void {
        this.subscriptions.add(this.WizardsService.getIndex()
            .subscribe((result: WizardsIndex) => {
                this.result = result;
                this.cdr.markForCheck();
            }))
    }

    protected filterByCategory(category: string[]): boolean {
        return false;
    }

}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WidgetGetForRender } from '../../dashboards.interface';
import { WidgetsService } from '../widgets.service';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { TranslocoService } from '@jsverse/transloco';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'oitc-base-widget',
    imports: [],
    templateUrl: './base-widget.component.html',
    styleUrl: './base-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('flip', [
            state('false', style({transform: 'none'})),
            state('true', style({transform: 'rotateY(180deg)'})),
            transition('false <=> true', animate('0.8s ease-in-out'))
        ])
    ]
})
export abstract class BaseWidgetComponent implements OnDestroy {

    public widgetInput = input<WidgetGetForRender>();
    public widget?: WidgetGetForRender;
    public isReadonly = input<boolean>(false);

    protected readonly subscriptions = new Subscription();
    protected readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected readonly WidgetsService = inject(WidgetsService);
    public readonly PermissionsService = inject(PermissionsService);
    protected readonly TranslocoService = inject(TranslocoService);

    protected animationStateShowContent: boolean = true;
    protected animationStateShowConfig: boolean = true;

    public onAnimationStart(event: AnimationEvent) {
        this.animationStateShowContent = true;
        this.animationStateShowConfig = true;
        this.cdr.markForCheck();
    }

    public onAnimationDone(event: AnimationEvent) {
        if (event.toState) {
            // "true" means show config.
            // Animation is done, we can now remove the content to avoid scroll bars if the content is higher than the config
            this.animationStateShowContent = false;
        } else {
            // "false" means show content.
            // Animation is done, we can now remove the config to avoid scroll bars if the config is higher than the content
            this.animationStateShowConfig = false;
        }
        this.cdr.markForCheck();
    }

    public constructor() {
        effect(() => {
            this.widget = this.widgetInput();
            this.load();
        });

        this.subscriptions.add(this.WidgetsService.onResizeEnded$.subscribe(event => {
            if (this.widget) {
                if (event.layoutItem.id === this.widget.id) {
                    this.resizeWidget(event);
                }
            }
        }));

        this.subscriptions.add(this.WidgetsService.onLayoutUpdated$.subscribe(event => {
            if (this.widget) {
                this.layoutUpdate(event);
            }
        }));

    }

    public load() {
        console.log('Implement load() method in your widget component');
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public resizeWidget(event?: KtdResizeEnd) {
        console.log('Implement resizeWidget(event: KtdResizeEnd) method in your widget component');
    }

    public layoutUpdate(event: KtdGridLayout) {
        console.log('Implement layoutUpdate(event: KtdGridLayout) method in your widget component');
    }
}

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild
} from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { NoticeWidgetService } from './notice-widget.service';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { NoticeWidgetConfig } from './notice-widget.interface';
import { FormControlDirective, FormLabelDirective } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TrustAsHtmlPipe } from '../../../../pipes/trust-as-html.pipe';

@Component({
    selector: 'oitc-notice-widget',
    imports: [
        FaIconComponent,
        NgIf,
        TranslocoDirective,
        FormControlDirective,
        FormLabelDirective,
        FormsModule,
        XsButtonDirective,
        TrustAsHtmlPipe
    ],
    templateUrl: './notice-widget.component.html',
    styleUrl: './notice-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('flip', [
            state('false', style({transform: 'none'})),
            state('true', style({transform: 'rotateY(180deg)'})),
            transition('false <=> true', animate('0.8s ease-in-out'))
        ])
    ]
})
export class NoticeWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;
    public widgetHeight: number = 0;
    public textareaHeight: number = 100;

    public config?: NoticeWidgetConfig;
    public htmlContent: string = '';

    private readonly NoticeWidgetService = inject(NoticeWidgetService);


    public override load() {
        if (this.widget) {
            this.NoticeWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                this.config = response.config;
                this.htmlContent = response.htmlContent;
                this.cdr.markForCheck();
            });
        }
    }

    public ngAfterViewInit(): void {
        this.calcTextareaHeight();
    }

    private calcTextareaHeight() {
        this.widgetHeight = this.boxContainer?.nativeElement.offsetHeight;

        let height = this.widgetHeight - 29 - 30 - 34 - 8; //Unit: px
        //                                        ^ Show / Hide Config button
        //                                             ^ Label
        //                                                  ^ Save Button
        //                                                      ^ Some Padding

        if (height < 15) {
            height = 15;
        }

        this.textareaHeight = height;
        this.cdr.markForCheck();
    }

    public saveConfig() {
        if (this.config && this.widget) {
            this.NoticeWidgetService.saveWidgetConfig(this.widget.id, this.config).subscribe((response) => {
                // Update the markdown content
                this.load();

                // Close config
                this.flipped.set(false);
            });
        }
    }

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        this.calcTextareaHeight();
    }

    public override layoutUpdate(event: KtdGridLayout) {

    }
}

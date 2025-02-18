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
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { IframeComponent } from '../../../../components/iframe/iframe.component';
import { NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent, ColComponent, FormControlDirective, FormLabelDirective, RowComponent } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { WebsiteWidgetService } from './website-widget.service';
import { WebsiteWidgetConfig } from './website-widget.interface';

@Component({
    selector: 'oitc-website-widget',
    imports: [
        IframeComponent,
        NgIf,
        FaIconComponent,
        FormLabelDirective,
        FormControlDirective,
        FormsModule,
        XsButtonDirective,
        ColComponent,
        RowComponent,
        AlertComponent
    ],
    templateUrl: './website-widget.component.html',
    styleUrl: './website-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebsiteWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;
    public widgetHeight: number = 0;
    public textareaHeight: number = 100;

    public config?: WebsiteWidgetConfig;

    private readonly WebsiteWidgetService = inject(WebsiteWidgetService);

    public override load() {
        if (this.widget) {
            this.WebsiteWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                this.config = response.config;
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
            this.WebsiteWidgetService.saveWidgetConfig(this.widget.id, this.config).subscribe((response) => {
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

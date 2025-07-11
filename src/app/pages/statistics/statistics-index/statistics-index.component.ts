import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
  DOCUMENT
} from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { createJSONEditor, Mode } from 'vanilla-jsoneditor'


import {
  AlertComponent,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleDirective,
  ColComponent,
  RowComponent
} from '@coreui/angular';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { StatisticsService } from '../statistics.service';
import { StatisticsIndex } from '../statistics.interface';
import { Statistics } from '../statistics.enum';
import { LayoutService } from '../../../layouts/coreui/layout.service';

@Component({
    selector: 'oitc-statistics-index',
    imports: [
    TranslocoDirective,
    FaIconComponent,
    PermissionDirective,
    RouterLink,
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    RowComponent,
    ColComponent,
    NgIf,
    NgClass,
    AsyncPipe
],
    templateUrl: './statistics-index.component.html',
    styleUrl: './statistics-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsIndexComponent implements OnDestroy, AfterViewInit {

    // Select jsoneditor div the Angular way
    @ViewChild('jsoneditor') jsoneditor!: ElementRef;

    public currentSettings: StatisticsIndex | undefined;

    private StatisticsService = inject(StatisticsService);
    public readonly LayoutService = inject(LayoutService);
    private readonly document = inject(DOCUMENT);
    private readonly subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngAfterViewInit(): void {
        this.subscriptions.add(this.StatisticsService.getCurrentStatisticSettings().subscribe(settings => {
            this.currentSettings = settings;
            this.createEditor();
            this.cdr.markForCheck();
        }));
    }

    private createEditor() {
        if (!this.currentSettings) {
            return;
        }

        const editor = createJSONEditor({
            target: this.jsoneditor.nativeElement,
            props: {
                mode: Mode.tree,
                mainMenuBar: true,
                readOnly: true,
                content: {
                    text: undefined,
                    json: this.currentSettings.statistics
                }
            }
        });
        this.cdr.markForCheck();
    }

    public saveSettings(value: Statistics): void {
        this.subscriptions.add(this.StatisticsService.saveSettings(value)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.ngAfterViewInit();
            }));
    }


    protected readonly Statistics = Statistics;
}

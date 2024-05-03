import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { JSONEditor, JSONEditorPropsOptional, Mode } from 'vanilla-jsoneditor'
import {
    AlertComponent,
    AlertHeadingDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    RowComponent
} from '@coreui/angular';
import { DOCUMENT, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { StatisticsService } from '../statistics.service';
import { StatisticsIndex } from '../statistics.interface';
import { Statistics } from '../statistics.enum';

@Component({
    selector: 'oitc-statistics-index',
    standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        AlertComponent,
        AlertHeadingDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        RowComponent,
        ColComponent,
        NgIf
    ],
    templateUrl: './statistics-index.component.html',
    styleUrl: './statistics-index.component.css'
})
export class StatisticsIndexComponent implements OnInit, OnDestroy {

    public currentSettings: StatisticsIndex | undefined;

    private StatisticsService = inject(StatisticsService);
    private readonly document = inject(DOCUMENT);
    private readonly subscriptions: Subscription = new Subscription();

    private jsonEditorProps: JSONEditorPropsOptional = {
        mode: Mode.tree,
        mainMenuBar: true,
        readOnly: true,
    };

    public ngOnInit(): void {
        this.subscriptions.add(this.StatisticsService.getCurrentStatisticSettings().subscribe(settings => {
            this.currentSettings = settings;
            this.createEditor();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private createEditor() {
        if (!this.currentSettings) {
            return;
        }

        let options = this.jsonEditorProps as any;
        options['content'] = {
            json: this.currentSettings.statistics
        };

        let elm = this.document.getElementById('jsoneditor');
        if (elm) {
            const editor = new JSONEditor({
                target: elm,
                props: options
            });
        }
    }

    public saveSettings(value: Statistics): void {
        this.subscriptions.add(this.StatisticsService.saveSettings(value)
            .subscribe((result) => {
                this.ngOnInit();
            }));
    }


    protected readonly Statistics = Statistics;
}

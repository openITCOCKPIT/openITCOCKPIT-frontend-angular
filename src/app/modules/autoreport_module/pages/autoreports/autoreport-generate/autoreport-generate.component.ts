import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent, CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective, ColComponent, FormControlDirective, FormDirective, FormLabelDirective,
    NavComponent,
    NavItemComponent, RowComponent
} from '@coreui/angular';
import { DatePipe, formatDate, NgClass, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { AutoreportsService } from '../autoreports.service';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    AutoreportsIndexRoot,
    AutoreportIndex
} from '../autoreports.interface';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenericValidationError } from '../../../../../generic-responses';
import { DateTime } from 'luxon'

@Component({
  selector: 'oitc-autoreport-generate',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardComponent,
        NgIf,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        BackButtonDirective,
        NavItemComponent,
        XsButtonDirective,
        NgClass,
        CardBodyComponent,
        RowComponent,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        SelectComponent,
        FormControlDirective,
        ReactiveFormsModule,
        FormsModule,
        CardFooterComponent,
        ColComponent,
        FormDirective,
    ],
  templateUrl: './autoreport-generate.component.html',
  styleUrl: './autoreport-generate.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportGenerateComponent implements OnInit, OnDestroy {

    private nowDate = new Date();

   /* constructor(private datePipe: DatePipe){
        // @ts-ignore
        this.post.Autoreport.from_date  = this.datePipe.transform(this.nowDate, 'dd.mm.yyyy');
    } */

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private subscriptions: Subscription = new Subscription();
    private readonly AutoreportsService: AutoreportsService = inject(AutoreportsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
  //  private readonly DatePipe: DatePipe = inject(DatePipe);
    private cdr = inject(ChangeDetectorRef);



    public id: number = 0;
    public errors: GenericValidationError | null = null;
    public autoreports!: AutoreportIndex[];
    private now = DateTime.now();
    public post = {
        Autoreport: {
            id: this.id,
            format: 'html',
            from_date: this.now.minus({ days: 30 }).toISODate(),
            to_date: this.now.toISODate()
        }
    };
    public formatOptions: SelectKeyValueString[] = [
        {key: 'pdf', value: this.TranslocoService.translate('PDV')},
        {key: 'html', value: this.TranslocoService.translate('HTML')},
        {key: 'csv', value: this.TranslocoService.translate('CSV')},
    ];



    public ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.post.Autoreport.id = this.id;
        this.loadAutoreports()
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadAutoreports(): void {

        this.subscriptions.add(this.AutoreportsService.getAutreportsGenerateIndex().subscribe(data => {
            this.autoreports = data.autoreports;
            this.cdr.markForCheck();
        }));
    }

    public onReportChange() {

    }
    public onFormatChange() {

    }

    public generateReport() {}

}

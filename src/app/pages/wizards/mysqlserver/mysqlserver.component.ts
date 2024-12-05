import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Service } from '../wizards.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormControlDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    TemplateIdDirective
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { NgForOf, NgIf } from '@angular/common';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NotyService } from '../../../layouts/coreui/noty.service';
import {
    WizardsDynamicfieldsComponent
} from '../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { MysqlWizardGet, MysqlWizardPost } from './mysqlserver-wizard.interface';
import { MysqlserverWizardService } from './mysqlserver-wizard.service';

@Component({
    selector: 'oitc-mysqlserver',
    standalone: true,
    imports: [
        FaIconComponent,
        TranslocoDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        FormsModule,
        FormErrorDirective,
        FormFeedbackComponent,
        FormControlDirective,
        RequiredIconComponent,
        NgForOf,
        AccordionComponent,
        AccordionItemComponent,
        AccordionButtonDirective,
        TemplateIdDirective,
        RowComponent,
        ColComponent,
        DebounceDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        NgSelectComponent,
        FormCheckInputDirective,
        FormCheckComponent,
        NgIf,
        FormLabelDirective,
        WizardsDynamicfieldsComponent
    ],
    templateUrl: './mysqlserver.component.html',
    styleUrl: './mysqlserver.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MysqlserverComponent implements OnInit, OnDestroy {
    private readonly subscriptions = new Subscription();
    private readonly MysqlserverWizardService: MysqlserverWizardService = inject(MysqlserverWizardService);
    private readonly route = inject(ActivatedRoute);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly router: Router = inject(Router);

    protected readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected hostId: number = 0;
    protected wizard: MysqlWizardGet = {} as MysqlWizardGet;
    protected serverAddr: string = 'localhost';
    protected systemName: string = 'mysqlserver';
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected servicetemplates: any = null;
    protected servicesNamesForExistCheck: string[] = [];
    protected post: MysqlWizardPost = {
        database: '',
        host_id: 0,
        password: '',
        services: [],
        username: ''
    } as MysqlWizardPost;

    public ngOnInit() {
        this.post.host_id = Number(this.route.snapshot.paramMap.get('hostId'));

        // Fetch wizard settings and service templates
        this.loadWizard();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }


    protected submit(): void {
        this.subscriptions.add(this.MysqlserverWizardService.submit(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const title: string = this.TranslocoService.translate('Success');
                    const msg: string = this.TranslocoService.translate('Data saved successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.router.navigate(['/wizards/index']);
                    return;
                }
                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;

                }
            })
        );
    }

    private loadWizard() {
        this.subscriptions.add(this.MysqlserverWizardService.fetch(this.post.host_id)
            .subscribe((result: MysqlWizardGet) => {
                this.wizard = result;


                this.servicetemplates = result.servicetemplates;
                this.servicesNamesForExistCheck = result.servicesNamesForExistCheck;
                this.post.username = result.username;
                this.post.password = result.password;

                for (let key in this.servicetemplates) {
                    this.post.services.push(
                        {
                            host_id: this.post.host_id,
                            servicetemplate_id: this.servicetemplates[key].id,
                            name: this.servicetemplates[key].name,
                            description: this.servicetemplates[key].description,
                            servicecommandargumentvalues: this.servicetemplates[key].servicetemplatecommandargumentvalues,
                            createService: true
                        } as Service);
                }

                this.cdr.markForCheck();
            }));
    }
}

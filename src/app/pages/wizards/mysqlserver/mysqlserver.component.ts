import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WizardsService } from '../wizards.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Service, WizardPost, WizardRoot } from '../wizards.interface';
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
import { HistoryService } from '../../../history.service';

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
        FormLabelDirective
    ],
    templateUrl: './mysqlserver.component.html',
    styleUrl: './mysqlserver.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MysqlserverComponent implements OnInit, OnDestroy {
    private readonly subscriptions = new Subscription();
    private readonly WizardsService: WizardsService = inject(WizardsService);
    private readonly route = inject(ActivatedRoute);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    protected readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected hostId: number = 0;
    protected wizard: WizardRoot = {} as WizardRoot;
    protected serverAddr: string = 'localhost';
    protected systemName: string = 'mysqlserver';
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected servicetemplates: any = null;
    protected servicesNamesForExistCheck: string[] = [];
    protected searchedTags: string[] = [];
    protected post: WizardPost = {
        database: '',
        host_id: 0,
        password: '',
        services: [],
        username: ''
    } as WizardPost;

    public ngOnInit() {
        this.post.host_id = Number(this.route.snapshot.paramMap.get('hostId'));

        // Fetch wizard settings and service templates
        this.loadWizard();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    protected detectColor = function (label: string): string {
        if (label.match(/warning/gi)) {
            return 'warning';
        }

        if (label.match(/critical/gi)) {
            return 'critical';
        }

        return '';
    };

    protected submit(): void {

        this.subscriptions.add(this.WizardsService.postMysqlWizard(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const title: string = this.TranslocoService.translate('User');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['users', 'edit', result.data.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/users/index']);
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

    protected hasName = (name: string): boolean => {
        if (this.searchedTags.length === 0) {
            return true;
        }
        return this.searchedTags.some((tag) => {
            return name.toLowerCase().includes(tag.toLowerCase());
        });
    }
    protected showParams = (service: Service): boolean => {
        return service.createService;
    }

    protected check(state: boolean): void {
        this.post.services.forEach((service: Service) => {
            if (!this.hasName(service.name)) {
                return;
            }
            service.createService = state
        });
        this.cdr.markForCheck();
    }

    protected search = (): void => {
        console.warn(this.searchedTags);
        this.cdr.markForCheck();
    }

    private loadWizard() {
        this.subscriptions.add(this.WizardsService.getMysqlWizard(this.post.host_id)
            .subscribe((result: WizardRoot) => {
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

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { MysqlWizardPost } from '../mysqlserver/mysqlserver-wizard.interface';
import { Service, Servicetemplate, WizardGet } from '../wizards.interface';
import { WizardsService } from '../wizards.service';

@Component({
    selector: 'oitc-wizards-abstract',
    standalone: true,
    imports: [],
    templateUrl: './wizards-abstract.component.html',
    styleUrl: './wizards-abstract.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class WizardsAbstractComponent implements OnInit, OnDestroy {
    protected readonly subscriptions = new Subscription();
    protected readonly route = inject(ActivatedRoute);
    protected readonly TranslocoService: TranslocoService = inject(TranslocoService);
    protected readonly notyService: NotyService = inject(NotyService);
    protected readonly router: Router = inject(Router);
    protected readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected WizardService: WizardsService = {} as WizardsService;

    protected hostId: number = 0;
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected servicetemplates: Servicetemplate[] = [];
    protected servicesNamesForExistCheck: string[] = [];
    protected post: any = {
        host_id: 0
    } as MysqlWizardPost;

    public ngOnInit() {
        this.post.host_id = Number(this.route.snapshot.paramMap.get('hostId'));

        // Fetch wizard settings and service templates. This method must be implemented in the child class
        this.loadWizard();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    protected afterWizardLoaded(result: WizardGet): void {
        // Set fields
        this.servicetemplates = result.servicetemplates;
        this.servicesNamesForExistCheck = result.servicesNamesForExistCheck;

        // Import services
        for (let key in this.servicetemplates) {
            this.post.services.push(
                {
                    host_id: this.post.host_id,
                    servicetemplate_id: this.servicetemplates[key].id,
                    name: this.servicetemplates[key].name,
                    description: this.servicetemplates[key].description,
                    servicecommandargumentvalues: this.servicetemplates[key].servicetemplatecommandargumentvalues,
                    createService: ! this.servicesNamesForExistCheck.includes(this.servicetemplates[key].name)
                } as Service);
        }
        this.cdr.markForCheck();
    }


    public submit(): void {
        this.subscriptions.add(this.WizardService.submit(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const title: string = this.TranslocoService.translate('Success');
                    const msg: string = this.TranslocoService.translate('Data saved successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.router.navigate(['/services/notMonitored']);
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

    protected wizardLoad(result: WizardGet): void {
    }

    public loadWizard() {
        this.subscriptions.add(this.WizardService.fetch(this.post.host_id)
            .subscribe((result: WizardGet) => {
                this.servicetemplates = result.servicetemplates;
                this.servicesNamesForExistCheck = result.servicesNamesForExistCheck;

                // Call custom implementation
                this.wizardLoad(result);

                // Call default stub that fills services and calls CDR.
                this.afterWizardLoaded(result);
            }));
    }
}

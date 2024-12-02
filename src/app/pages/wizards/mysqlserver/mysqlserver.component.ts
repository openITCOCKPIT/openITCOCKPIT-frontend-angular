import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WizardsService } from '../wizards.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WizardRoot } from '../wizards.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { GenericValidationError } from '../../../generic-responses';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { NgForOf } from '@angular/common';

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
        NgForOf
    ],
    templateUrl: './mysqlserver.component.html',
    styleUrl: './mysqlserver.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MysqlserverComponent implements OnInit, OnDestroy {
    private readonly Subscriptions = new Subscription();
    private readonly WizardsService: WizardsService = inject(WizardsService);
    private readonly route = inject(ActivatedRoute);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected hostId: number = 0;
    protected wizard: WizardRoot = {} as WizardRoot;
    protected serverAddr: string = 'localhost';
    protected systemName: string = 'mysqlserver';
    protected errors: GenericValidationError = {} as GenericValidationError;

    public ngOnInit() {
        this.hostId = Number(this.route.snapshot.paramMap.get('hostId'));

        // Fetch wizard settings and service templates
        this.loadWizard();
    }

    public ngOnDestroy() {
        this.Subscriptions.unsubscribe();
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


    protected servicetemplates: any = null;
    protected servicesNamesForExistCheck: string[] = [];
    protected post: any = {
        database: '',
        host_id: this.hostId,
        password: '',
        services: [],
        username: ''
    };

    private loadWizard() {
        this.Subscriptions.add(this.WizardsService.getMysqlWizard(this.hostId)
            .subscribe((result: WizardRoot) => {
                this.wizard = result;


                this.servicetemplates = result.servicetemplates;
                this.servicesNamesForExistCheck = result.servicesNamesForExistCheck;
                this.post.username = result.username;
                this.post.password = result.password;

                for (let key in this.servicetemplates) {
                    this.post.services.push(
                        {
                            'host_id': this.hostId,
                            'servicetemplate_id': this.servicetemplates[key].id,
                            'name': this.servicetemplates[key].name,
                            'description': this.servicetemplates[key].description,
                            'servicecommandargumentvalues': this.servicetemplates[key].servicetemplatecommandargumentvalues,
                            'createService': true
                        });
                }

                this.cdr.markForCheck();
            }));
    }
}

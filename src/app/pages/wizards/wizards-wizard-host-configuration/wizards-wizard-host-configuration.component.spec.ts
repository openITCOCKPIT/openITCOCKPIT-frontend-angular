import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardsWizardHostConfigurationComponent } from './wizards-wizard-host-configuration.component';

describe('WizardsWizardHostConfigurationComponent', () => {
    let component: WizardsWizardHostConfigurationComponent;
    let fixture: ComponentFixture<WizardsWizardHostConfigurationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WizardsWizardHostConfigurationComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(WizardsWizardHostConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardAssignmentsComponent } from './wizard-assignments.component';

describe('WizardAssignmentsComponent', () => {
    let component: WizardAssignmentsComponent;
    let fixture: ComponentFixture<WizardAssignmentsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WizardAssignmentsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(WizardAssignmentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

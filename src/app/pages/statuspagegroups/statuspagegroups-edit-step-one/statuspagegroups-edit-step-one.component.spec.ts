import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagegroupsEditStepOneComponent } from './statuspagegroups-edit-step-one.component';

describe('StatuspagegroupsEditStepOneComponent', () => {
    let component: StatuspagegroupsEditStepOneComponent;
    let fixture: ComponentFixture<StatuspagegroupsEditStepOneComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatuspagegroupsEditStepOneComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StatuspagegroupsEditStepOneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

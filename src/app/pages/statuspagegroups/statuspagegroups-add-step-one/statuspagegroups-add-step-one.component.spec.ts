import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagegroupsAddStepOneComponent } from './statuspagegroups-add-step-one.component';

describe('StatuspagegroupsAddStepOneComponent', () => {
    let component: StatuspagegroupsAddStepOneComponent;
    let fixture: ComponentFixture<StatuspagegroupsAddStepOneComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatuspagegroupsAddStepOneComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StatuspagegroupsAddStepOneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoreportAddStepTwoComponent } from './autoreport-add-step-two.component';

describe('AutoreportAddStepTwoComponent', () => {
    let component: AutoreportAddStepTwoComponent;
    let fixture: ComponentFixture<AutoreportAddStepTwoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AutoreportAddStepTwoComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AutoreportAddStepTwoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

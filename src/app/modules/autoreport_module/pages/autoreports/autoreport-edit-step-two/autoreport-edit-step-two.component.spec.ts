import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoreportEditStepTwoComponent } from './autoreport-edit-step-two.component';

describe('AutoreportEditStepTwoComponent', () => {
    let component: AutoreportEditStepTwoComponent;
    let fixture: ComponentFixture<AutoreportEditStepTwoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AutoreportEditStepTwoComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AutoreportEditStepTwoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoreportEditStepOneComponent } from './autoreport-edit-step-one.component';

describe('AutoreportEditStepOneComponent', () => {
    let component: AutoreportEditStepOneComponent;
    let fixture: ComponentFixture<AutoreportEditStepOneComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AutoreportEditStepOneComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AutoreportEditStepOneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

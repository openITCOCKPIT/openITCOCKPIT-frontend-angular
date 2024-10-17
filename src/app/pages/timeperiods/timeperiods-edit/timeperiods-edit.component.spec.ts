import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeperiodsEditComponent } from './timeperiods-edit.component';

describe('TimeperiodsEditComponent', () => {
    let component: TimeperiodsEditComponent;
    let fixture: ComponentFixture<TimeperiodsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TimeperiodsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TimeperiodsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

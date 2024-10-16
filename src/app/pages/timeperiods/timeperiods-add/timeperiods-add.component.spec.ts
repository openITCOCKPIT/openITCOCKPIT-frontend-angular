import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeperiodsAddComponent } from './timeperiods-add.component';

describe('TimeperiodsAddComponent', () => {
    let component: TimeperiodsAddComponent;
    let fixture: ComponentFixture<TimeperiodsAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TimeperiodsAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TimeperiodsAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

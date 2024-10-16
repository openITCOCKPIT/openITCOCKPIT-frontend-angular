import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeperiodsViewDetailsComponent } from './timeperiods-view-details.component';

describe('TimeperiodsViewDetailsComponent', () => {
    let component: TimeperiodsViewDetailsComponent;
    let fixture: ComponentFixture<TimeperiodsViewDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TimeperiodsViewDetailsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TimeperiodsViewDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

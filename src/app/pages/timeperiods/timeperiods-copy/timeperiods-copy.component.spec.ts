import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeperiodsCopyComponent } from './timeperiods-copy.component';

describe('TimeperiodsCopyComponent', () => {
    let component: TimeperiodsCopyComponent;
    let fixture: ComponentFixture<TimeperiodsCopyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TimeperiodsCopyComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TimeperiodsCopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

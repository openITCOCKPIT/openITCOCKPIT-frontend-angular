import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarsEditComponent } from './calendars-edit.component';

describe('CalendarsEditComponent', () => {
    let component: CalendarsEditComponent;
    let fixture: ComponentFixture<CalendarsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CalendarsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CalendarsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

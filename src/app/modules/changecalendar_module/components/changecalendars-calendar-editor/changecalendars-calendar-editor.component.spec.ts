import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangecalendarsCalendarEditorComponent } from './changecalendars-calendar.component';

describe('ChangecalendarsCalendarComponent', () => {
    let component: ChangecalendarsCalendarEditorComponent;
    let fixture: ComponentFixture<ChangecalendarsCalendarEditorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChangecalendarsCalendarEditorComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChangecalendarsCalendarEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

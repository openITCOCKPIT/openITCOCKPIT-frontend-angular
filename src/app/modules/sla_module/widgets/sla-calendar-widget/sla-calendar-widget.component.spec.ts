import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaCalendarWidgetComponent } from './sla-calendar-widget.component';

describe('SlaCalendarWidgetComponent', () => {
    let component: SlaCalendarWidgetComponent;
    let fixture: ComponentFixture<SlaCalendarWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlaCalendarWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlaCalendarWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

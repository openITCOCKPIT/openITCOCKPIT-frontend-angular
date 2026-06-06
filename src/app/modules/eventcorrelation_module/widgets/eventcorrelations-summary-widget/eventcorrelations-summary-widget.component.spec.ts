import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcorrelationsSummaryWidgetComponent } from './eventcorrelations-summary-widget.component';

describe('EventcorrelationsSummaryWidgetComponent', () => {
    let component: EventcorrelationsSummaryWidgetComponent;
    let fixture: ComponentFixture<EventcorrelationsSummaryWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EventcorrelationsSummaryWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EventcorrelationsSummaryWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

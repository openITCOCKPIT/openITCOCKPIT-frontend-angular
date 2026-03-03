import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcorrelationWidgetComponent } from './eventcorrelation-widget.component';

describe('EventcorrelationWidgetComponent', () => {
    let component: EventcorrelationWidgetComponent;
    let fixture: ComponentFixture<EventcorrelationWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EventcorrelationWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EventcorrelationWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

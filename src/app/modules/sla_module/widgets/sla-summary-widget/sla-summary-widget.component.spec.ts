import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaSummaryWidgetComponent } from './sla-summary-widget.component';

describe('SlaSummaryWidgetComponent', () => {
    let component: SlaSummaryWidgetComponent;
    let fixture: ComponentFixture<SlaSummaryWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlaSummaryWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlaSummaryWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

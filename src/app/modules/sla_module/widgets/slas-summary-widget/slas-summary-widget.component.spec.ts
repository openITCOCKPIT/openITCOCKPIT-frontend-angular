import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlasSummaryWidgetComponent } from './slas-summary-widget.component';

describe('SlaSummaryWidgetComponent', () => {
    let component: SlasSummaryWidgetComponent;
    let fixture: ComponentFixture<SlasSummaryWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlasSummaryWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlasSummaryWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

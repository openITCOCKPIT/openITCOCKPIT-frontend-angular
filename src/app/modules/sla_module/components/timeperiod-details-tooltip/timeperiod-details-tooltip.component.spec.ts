import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeperiodDetailsTooltipComponent } from './timeperiod-details-tooltip.component';

describe('TimeperiodDetailsTooltipComponent', () => {
    let component: TimeperiodDetailsTooltipComponent;
    let fixture: ComponentFixture<TimeperiodDetailsTooltipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TimeperiodDetailsTooltipComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TimeperiodDetailsTooltipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

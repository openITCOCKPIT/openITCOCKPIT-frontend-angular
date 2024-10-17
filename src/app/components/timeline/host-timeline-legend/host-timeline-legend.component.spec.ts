import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostTimelineLegendComponent } from './host-timeline-legend.component';

describe('HostTimelineLegendComponent', () => {
    let component: HostTimelineLegendComponent;
    let fixture: ComponentFixture<HostTimelineLegendComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostTimelineLegendComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostTimelineLegendComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

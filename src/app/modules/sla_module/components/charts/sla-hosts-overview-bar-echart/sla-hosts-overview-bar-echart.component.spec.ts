import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaHostsOverviewBarEchartComponent } from './sla-hosts-overview-bar-echart.component';

describe('SlaHostsOverviewBarEchartComponent', () => {
    let component: SlaHostsOverviewBarEchartComponent;
    let fixture: ComponentFixture<SlaHostsOverviewBarEchartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlaHostsOverviewBarEchartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlaHostsOverviewBarEchartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

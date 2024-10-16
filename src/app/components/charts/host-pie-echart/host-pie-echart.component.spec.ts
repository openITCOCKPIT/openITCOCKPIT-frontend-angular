import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostPieEchartComponent } from './host-pie-echart.component';

describe('HostPieEchartComponent', () => {
    let component: HostPieEchartComponent;
    let fixture: ComponentFixture<HostPieEchartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostPieEchartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostPieEchartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

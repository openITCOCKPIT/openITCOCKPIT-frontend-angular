import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparklineStatsComponent } from './sparkline-stats.component';

describe('SparklineStatsComponent', () => {
    let component: SparklineStatsComponent;
    let fixture: ComponentFixture<SparklineStatsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SparklineStatsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SparklineStatsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

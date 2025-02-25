import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSummaryToasterComponent } from './map-summary-toaster.component';

describe('MapSummaryToasterComponent', () => {
    let component: MapSummaryToasterComponent;
    let fixture: ComponentFixture<MapSummaryToasterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapSummaryToasterComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapSummaryToasterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

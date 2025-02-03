import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSummaryItemComponent } from './map-summary-item.component';

describe('MapSummaryItemComponent', () => {
    let component: MapSummaryItemComponent;
    let fixture: ComponentFixture<MapSummaryItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapSummaryItemComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapSummaryItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

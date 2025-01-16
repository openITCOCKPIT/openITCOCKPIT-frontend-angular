import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapItemBaseComponent } from './map-item-base.component';

describe('MapItemComponent', () => {
    let component: MapItemBaseComponent;
    let fixture: ComponentFixture<MapItemBaseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapItemBaseComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapItemBaseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

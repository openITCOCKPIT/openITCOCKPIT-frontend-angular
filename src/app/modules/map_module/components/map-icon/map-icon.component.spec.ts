import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapIconComponent } from './map-icon.component';

describe('MapIconComponent', () => {
    let component: MapIconComponent;
    let fixture: ComponentFixture<MapIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapIconComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

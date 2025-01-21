import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTextComponent } from './map-text.component';

describe('MapTextComponent', () => {
    let component: MapTextComponent;
    let fixture: ComponentFixture<MapTextComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapTextComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapTextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

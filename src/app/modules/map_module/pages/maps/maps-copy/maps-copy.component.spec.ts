import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsCopyComponent } from './maps-copy.component';

describe('MapsCopyComponent', () => {
    let component: MapsCopyComponent;
    let fixture: ComponentFixture<MapsCopyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapsCopyComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapsCopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

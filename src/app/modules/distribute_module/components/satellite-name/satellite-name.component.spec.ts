import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatelliteNameComponent } from './satellite-name.component';

describe('SatelliteNameComponent', () => {
    let component: SatelliteNameComponent;
    let fixture: ComponentFixture<SatelliteNameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SatelliteNameComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SatelliteNameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

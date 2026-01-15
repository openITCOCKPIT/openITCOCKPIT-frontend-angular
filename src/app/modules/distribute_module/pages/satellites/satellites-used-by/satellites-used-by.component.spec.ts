import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatellitesUsedByComponent } from './satellites-used-by.component';

describe('SatellitesUsedByComponent', () => {
    let component: SatellitesUsedByComponent;
    let fixture: ComponentFixture<SatellitesUsedByComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SatellitesUsedByComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SatellitesUsedByComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

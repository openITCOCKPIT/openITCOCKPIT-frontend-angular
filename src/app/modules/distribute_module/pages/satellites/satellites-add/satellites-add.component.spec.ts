import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatellitesAddComponent } from './satellites-add.component';

describe('SatellitesAddComponent', () => {
    let component: SatellitesAddComponent;
    let fixture: ComponentFixture<SatellitesAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SatellitesAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SatellitesAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

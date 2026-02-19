import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GudeSensorsComponent } from './gude-sensors.component';

describe('GudeSensorsComponent', () => {
    let component: GudeSensorsComponent;
    let fixture: ComponentFixture<GudeSensorsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GudeSensorsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GudeSensorsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

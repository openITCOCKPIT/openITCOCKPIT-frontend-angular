import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SonicWallComponent } from './sonic-wall.component';

describe('SonicWallComponent', () => {
    let component: SonicWallComponent;
    let fixture: ComponentFixture<SonicWallComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SonicWallComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SonicWallComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

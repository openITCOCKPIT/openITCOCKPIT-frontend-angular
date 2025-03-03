import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotationsAddComponent } from './rotations-add.component';

describe('RotationsAddComponent', () => {
    let component: RotationsAddComponent;
    let fixture: ComponentFixture<RotationsAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RotationsAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RotationsAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

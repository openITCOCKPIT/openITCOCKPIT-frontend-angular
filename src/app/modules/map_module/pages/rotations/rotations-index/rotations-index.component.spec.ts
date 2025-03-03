import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotationsIndexComponent } from './rotations-index.component';

describe('RotationsIndexComponent', () => {
    let component: RotationsIndexComponent;
    let fixture: ComponentFixture<RotationsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RotationsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RotationsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceescalationsAddComponent } from './serviceescalations-add.component';

describe('ServiceescalationsAddComponent', () => {
    let component: ServiceescalationsAddComponent;
    let fixture: ComponentFixture<ServiceescalationsAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServiceescalationsAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServiceescalationsAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

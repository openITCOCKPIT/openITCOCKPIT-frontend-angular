import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitrixNetscalerComponent } from './citrix-netscaler.component';

describe('CitrixNetscalerComponent', () => {
    let component: CitrixNetscalerComponent;
    let fixture: ComponentFixture<CitrixNetscalerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CitrixNetscalerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CitrixNetscalerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

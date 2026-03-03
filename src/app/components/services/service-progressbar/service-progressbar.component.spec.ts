import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProgressbarComponent } from './service-progressbar.component';

describe('ServiceProgressbarComponent', () => {
    let component: ServiceProgressbarComponent;
    let fixture: ComponentFixture<ServiceProgressbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServiceProgressbarComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServiceProgressbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

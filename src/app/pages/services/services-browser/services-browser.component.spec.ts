import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesBrowserComponent } from './services-browser.component';

describe('ServicesBrowserComponent', () => {
    let component: ServicesBrowserComponent;
    let fixture: ComponentFixture<ServicesBrowserComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicesBrowserComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicesBrowserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

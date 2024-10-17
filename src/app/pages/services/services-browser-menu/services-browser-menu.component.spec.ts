import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesBrowserMenuComponent } from './services-browser-menu.component';

describe('ServicesBrowserMenuComponent', () => {
    let component: ServicesBrowserMenuComponent;
    let fixture: ComponentFixture<ServicesBrowserMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicesBrowserMenuComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicesBrowserMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

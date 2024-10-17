import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicenowServiceBrowserTabComponent } from './servicenow-service-browser-tab.component';

describe('ServicenowServiceBrowserTabComponent', () => {
    let component: ServicenowServiceBrowserTabComponent;
    let fixture: ComponentFixture<ServicenowServiceBrowserTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicenowServiceBrowserTabComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicenowServiceBrowserTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

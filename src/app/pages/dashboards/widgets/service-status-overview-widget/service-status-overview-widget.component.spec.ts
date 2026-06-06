import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceStatusOverviewWidgetComponent } from './service-status-overview-widget.component';

describe('HostStatusOverviewWidgetComponent', () => {
    let component: ServiceStatusOverviewWidgetComponent;
    let fixture: ComponentFixture<ServiceStatusOverviewWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServiceStatusOverviewWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServiceStatusOverviewWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

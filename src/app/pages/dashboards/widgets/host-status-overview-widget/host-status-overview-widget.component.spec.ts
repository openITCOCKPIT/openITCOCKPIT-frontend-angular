import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostStatusOverviewWidgetComponent } from './host-status-overview-widget.component';

describe('HostStatusOverviewWidgetComponent', () => {
    let component: HostStatusOverviewWidgetComponent;
    let fixture: ComponentFixture<HostStatusOverviewWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostStatusOverviewWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostStatusOverviewWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

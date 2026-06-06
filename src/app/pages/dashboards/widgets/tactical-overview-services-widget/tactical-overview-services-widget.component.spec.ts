import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacticalOverviewServicesWidgetComponent } from './tactical-overview-services-widget.component';

describe('TacticalOverviewHostsWidgetComponent', () => {
    let component: TacticalOverviewServicesWidgetComponent;
    let fixture: ComponentFixture<TacticalOverviewServicesWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TacticalOverviewServicesWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TacticalOverviewServicesWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

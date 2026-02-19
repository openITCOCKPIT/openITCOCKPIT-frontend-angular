import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaUserdashboardsViewComponent } from './grafana-userdashboards-view.component';

describe('GrafanaUserdashboardsViewComponent', () => {
    let component: GrafanaUserdashboardsViewComponent;
    let fixture: ComponentFixture<GrafanaUserdashboardsViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GrafanaUserdashboardsViewComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GrafanaUserdashboardsViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

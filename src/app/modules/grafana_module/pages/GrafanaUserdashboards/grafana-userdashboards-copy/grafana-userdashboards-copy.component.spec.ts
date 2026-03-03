import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaUserdashboardsCopyComponent } from './grafana-userdashboards-copy.component';

describe('GrafanaUserdashboardsCopyComponent', () => {
    let component: GrafanaUserdashboardsCopyComponent;
    let fixture: ComponentFixture<GrafanaUserdashboardsCopyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GrafanaUserdashboardsCopyComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GrafanaUserdashboardsCopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

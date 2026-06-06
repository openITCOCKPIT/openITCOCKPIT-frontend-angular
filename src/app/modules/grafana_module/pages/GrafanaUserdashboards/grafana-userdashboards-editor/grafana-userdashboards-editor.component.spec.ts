import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaUserdashboardsEditorComponent } from './grafana-userdashboards-editor.component';

describe('GrafanaUserdashboardsEditorComponent', () => {
    let component: GrafanaUserdashboardsEditorComponent;
    let fixture: ComponentFixture<GrafanaUserdashboardsEditorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GrafanaUserdashboardsEditorComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GrafanaUserdashboardsEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

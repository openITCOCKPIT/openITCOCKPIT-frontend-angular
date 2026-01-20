import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaUserdefinedWidgetComponent } from './grafana-userdefined-widget.component';

describe('GrafanaUserdefinedWidgetComponent', () => {
    let component: GrafanaUserdefinedWidgetComponent;
    let fixture: ComponentFixture<GrafanaUserdefinedWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GrafanaUserdefinedWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GrafanaUserdefinedWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

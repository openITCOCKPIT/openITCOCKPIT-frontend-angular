import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaRowComponent } from './grafana-row.component';

describe('GrafanaRowComponent', () => {
    let component: GrafanaRowComponent;
    let fixture: ComponentFixture<GrafanaRowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GrafanaRowComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GrafanaRowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

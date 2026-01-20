import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaPanelOptionsModalComponent } from './grafana-panel-options-modal.component';

describe('GrafanaPanelOptionsModalComponent', () => {
    let component: GrafanaPanelOptionsModalComponent;
    let fixture: ComponentFixture<GrafanaPanelOptionsModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GrafanaPanelOptionsModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GrafanaPanelOptionsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

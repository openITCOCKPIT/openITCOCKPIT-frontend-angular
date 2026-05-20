import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxmoxActionsComponent } from './proxmox-actions.component';

describe('ProxmoxActionsComponent', () => {
    let component: ProxmoxActionsComponent;
    let fixture: ComponentFixture<ProxmoxActionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProxmoxActionsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ProxmoxActionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxmoxLoadingModalComponent } from './proxmox-loading-modal.component';

describe('ProxmoxLoadingModalComponent', () => {
    let component: ProxmoxLoadingModalComponent;
    let fixture: ComponentFixture<ProxmoxLoadingModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProxmoxLoadingModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ProxmoxLoadingModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxmoxCreateSnapshotModalComponent } from './proxmox-create-snapshot-modal.component';

describe('ProxmoxCreateSnapshotModalComponent', () => {
    let component: ProxmoxCreateSnapshotModalComponent;
    let fixture: ComponentFixture<ProxmoxCreateSnapshotModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProxmoxCreateSnapshotModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ProxmoxCreateSnapshotModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

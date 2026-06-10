import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxmoxSnapshotsComponent } from './proxmox-snapshots.component';

describe('ProxmoxSnapshotsComponent', () => {
    let component: ProxmoxSnapshotsComponent;
    let fixture: ComponentFixture<ProxmoxSnapshotsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProxmoxSnapshotsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ProxmoxSnapshotsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

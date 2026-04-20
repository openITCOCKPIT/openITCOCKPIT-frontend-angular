import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxmoxSnapshotNestComponent } from './proxmox-snapshot-nest.component';

describe('ProxmoxSnapshotNestComponent', () => {
    let component: ProxmoxSnapshotNestComponent;
    let fixture: ComponentFixture<ProxmoxSnapshotNestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProxmoxSnapshotNestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ProxmoxSnapshotNestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

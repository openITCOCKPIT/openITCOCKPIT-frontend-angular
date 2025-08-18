import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmwareSnapshotsComponent } from './vmware-snapshots.component';

describe('VmwareSnapshotsComponent', () => {
    let component: VmwareSnapshotsComponent;
    let fixture: ComponentFixture<VmwareSnapshotsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VmwareSnapshotsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(VmwareSnapshotsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

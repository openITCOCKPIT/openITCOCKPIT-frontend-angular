import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmwareDatastoresComponent } from './vmware-datastores.component';

describe('VmwareDatastoresComponent', () => {
    let component: VmwareDatastoresComponent;
    let fixture: ComponentFixture<VmwareDatastoresComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VmwareDatastoresComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(VmwareDatastoresComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

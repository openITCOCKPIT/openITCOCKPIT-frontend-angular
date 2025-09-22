import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmwareEsxComponent } from './vmware-esx.component';

describe('VmwareEsxComponent', () => {
    let component: VmwareEsxComponent;
    let fixture: ComponentFixture<VmwareEsxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VmwareEsxComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(VmwareEsxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

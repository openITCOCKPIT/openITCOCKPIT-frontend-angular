import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutanixComponent } from './nutanix.component';

describe('NutanixComponent', () => {
    let component: NutanixComponent;
    let fixture: ComponentFixture<NutanixComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NutanixComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NutanixComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaritanKvmComponent } from './raritan-kvm.component';

describe('RaritanKvmComponent', () => {
    let component: RaritanKvmComponent;
    let fixture: ComponentFixture<RaritanKvmComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RaritanKvmComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RaritanKvmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

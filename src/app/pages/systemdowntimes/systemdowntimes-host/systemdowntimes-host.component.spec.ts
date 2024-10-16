import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemdowntimesHostComponent } from './systemdowntimes-host.component';

describe('SystemdowntimesHostComponent', () => {
    let component: SystemdowntimesHostComponent;
    let fixture: ComponentFixture<SystemdowntimesHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SystemdowntimesHostComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SystemdowntimesHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

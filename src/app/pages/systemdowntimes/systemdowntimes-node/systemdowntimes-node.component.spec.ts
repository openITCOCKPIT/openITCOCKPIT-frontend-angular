import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemdowntimesNodeComponent } from './systemdowntimes-node.component';

describe('SystemdowntimesNodeComponent', () => {
    let component: SystemdowntimesNodeComponent;
    let fixture: ComponentFixture<SystemdowntimesNodeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SystemdowntimesNodeComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SystemdowntimesNodeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

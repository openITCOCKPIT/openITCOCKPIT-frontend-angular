import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxmoxComponent } from './proxmox.component';

describe('ProxmoxComponent', () => {
    let component: ProxmoxComponent;
    let fixture: ComponentFixture<ProxmoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProxmoxComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ProxmoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

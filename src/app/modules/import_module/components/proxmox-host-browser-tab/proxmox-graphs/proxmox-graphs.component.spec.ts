import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxmoxGraphsComponent } from './proxmox-graphs.component';

describe('ProxmoxGraphsComponent', () => {
    let component: ProxmoxGraphsComponent;
    let fixture: ComponentFixture<ProxmoxGraphsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProxmoxGraphsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ProxmoxGraphsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

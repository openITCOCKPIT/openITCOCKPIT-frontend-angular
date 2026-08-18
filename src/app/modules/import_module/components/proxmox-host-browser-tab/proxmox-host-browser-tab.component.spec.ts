import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxmoxHostBrowserTabComponent } from './proxmox-host-browser-tab.component';

describe('ProxmoxHostBrowserTabComponent', () => {
    let component: ProxmoxHostBrowserTabComponent;
    let fixture: ComponentFixture<ProxmoxHostBrowserTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProxmoxHostBrowserTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ProxmoxHostBrowserTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

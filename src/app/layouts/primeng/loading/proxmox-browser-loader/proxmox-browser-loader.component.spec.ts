import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxmoxBrowserLoaderComponent } from './proxmox-browser-loader.component';

describe('ProxmoxBrowserLoaderComponent', () => {
    let component: ProxmoxBrowserLoaderComponent;
    let fixture: ComponentFixture<ProxmoxBrowserLoaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProxmoxBrowserLoaderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ProxmoxBrowserLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

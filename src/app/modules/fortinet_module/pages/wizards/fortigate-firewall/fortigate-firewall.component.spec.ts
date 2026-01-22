import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FortigateFirewallComponent } from './fortigate-firewall.component';

describe('FortigateFirewallComponent', () => {
    let component: FortigateFirewallComponent;
    let fixture: ComponentFixture<FortigateFirewallComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FortigateFirewallComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FortigateFirewallComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

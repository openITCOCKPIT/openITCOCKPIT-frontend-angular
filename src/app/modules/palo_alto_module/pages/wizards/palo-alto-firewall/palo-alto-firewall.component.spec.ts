import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaloAltoFirewallComponent } from './palo-alto-firewall.component';

describe('PaloAltoFirewallComponent', () => {
    let component: PaloAltoFirewallComponent;
    let fixture: ComponentFixture<PaloAltoFirewallComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PaloAltoFirewallComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PaloAltoFirewallComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

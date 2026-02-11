import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckpointFirewallComponent } from './checkpoint-firewall.component';

describe('CheckpointFirewallComponent', () => {
    let component: CheckpointFirewallComponent;
    let fixture: ComponentFixture<CheckpointFirewallComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CheckpointFirewallComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CheckpointFirewallComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentlessWindowsComponent } from './agentless-windows.component';

describe('AgentlessWindowsComponent', () => {
    let component: AgentlessWindowsComponent;
    let fixture: ComponentFixture<AgentlessWindowsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AgentlessWindowsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AgentlessWindowsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

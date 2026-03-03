import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentconnectorSelectAgentComponent } from './agentconnector-select-agent.component';

describe('AgentconnectorSelectAgentComponent', () => {
    let component: AgentconnectorSelectAgentComponent;
    let fixture: ComponentFixture<AgentconnectorSelectAgentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AgentconnectorSelectAgentComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AgentconnectorSelectAgentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

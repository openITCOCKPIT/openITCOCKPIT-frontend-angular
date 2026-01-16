import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentconnectorConfigComponent } from './agentconnector-config.component';

describe('AgentconnectorConfigComponent', () => {
    let component: AgentconnectorConfigComponent;
    let fixture: ComponentFixture<AgentconnectorConfigComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AgentconnectorConfigComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AgentconnectorConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

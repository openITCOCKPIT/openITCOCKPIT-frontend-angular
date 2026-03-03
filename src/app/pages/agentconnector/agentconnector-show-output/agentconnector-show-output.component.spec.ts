import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentconnectorShowOutputComponent } from './agentconnector-show-output.component';

describe('AgentconnectorShowOutputComponent', () => {
    let component: AgentconnectorShowOutputComponent;
    let fixture: ComponentFixture<AgentconnectorShowOutputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AgentconnectorShowOutputComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AgentconnectorShowOutputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

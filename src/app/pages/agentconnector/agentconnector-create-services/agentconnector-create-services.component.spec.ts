import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentconnectorCreateServicesComponent } from './agentconnector-create-services.component';

describe('AgentconnectorCreateServicesComponent', () => {
    let component: AgentconnectorCreateServicesComponent;
    let fixture: ComponentFixture<AgentconnectorCreateServicesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AgentconnectorCreateServicesComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AgentconnectorCreateServicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

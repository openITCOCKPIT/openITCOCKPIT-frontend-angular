import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentconnectorPushSatelliteComponent } from './agentconnector-push-satellite.component';

describe('AgentconnectorPushSatelliteComponent', () => {
    let component: AgentconnectorPushSatelliteComponent;
    let fixture: ComponentFixture<AgentconnectorPushSatelliteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AgentconnectorPushSatelliteComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AgentconnectorPushSatelliteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

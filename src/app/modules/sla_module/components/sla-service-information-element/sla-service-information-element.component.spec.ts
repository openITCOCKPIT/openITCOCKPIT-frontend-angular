import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaServiceInformationElementComponent } from './sla-service-information-element.component';

describe('SlaServiceInformationElementComponent', () => {
    let component: SlaServiceInformationElementComponent;
    let fixture: ComponentFixture<SlaServiceInformationElementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlaServiceInformationElementComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlaServiceInformationElementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

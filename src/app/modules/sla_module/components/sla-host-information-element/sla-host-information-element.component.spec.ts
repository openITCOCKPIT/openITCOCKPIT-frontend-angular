import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaHostInformationElementComponent } from './sla-host-information-element.component';

describe('SlaHostgroupHostsStatusOverviewComponent', () => {
    let component: SlaHostInformationElementComponent;
    let fixture: ComponentFixture<SlaHostInformationElementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlaHostInformationElementComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlaHostInformationElementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

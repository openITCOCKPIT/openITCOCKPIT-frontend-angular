import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalHostInformationComponent } from './additional-host-information.component';

describe('AdditionalHostInformationComponent', () => {
    let component: AdditionalHostInformationComponent;
    let fixture: ComponentFixture<AdditionalHostInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdditionalHostInformationComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AdditionalHostInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

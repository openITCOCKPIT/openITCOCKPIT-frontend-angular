import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgementIconComponent } from './acknowledgement-icon.component';

describe('AcknowledgementIconComponent', () => {
    let component: AcknowledgementIconComponent;
    let fixture: ComponentFixture<AcknowledgementIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AcknowledgementIconComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AcknowledgementIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

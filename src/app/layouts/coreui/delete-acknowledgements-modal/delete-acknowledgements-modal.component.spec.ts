import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAcknowledgementsModalComponent } from './delete-acknowledgements-modal.component';

describe('DeleteAcknowledgementsModalComponent', () => {
    let component: DeleteAcknowledgementsModalComponent;
    let fixture: ComponentFixture<DeleteAcknowledgementsModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DeleteAcknowledgementsModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DeleteAcknowledgementsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContainerModalComponent } from './edit-container-modal.component';

describe('EditContainerModalComponent', () => {
    let component: EditContainerModalComponent;
    let fixture: ComponentFixture<EditContainerModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditContainerModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EditContainerModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

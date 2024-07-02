import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBookmarkModalComponent } from './delete-bookmark-modal.component';

describe('DeleteAllComponent', () => {
    let component: DeleteBookmarkModalComponent;
    let fixture: ComponentFixture<DeleteBookmarkModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DeleteBookmarkModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DeleteBookmarkModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

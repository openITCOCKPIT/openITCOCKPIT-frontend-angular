import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBookmarkSaveModalComponent } from './filter-bookmark-save-modal.component';

describe('FilterBookmarkSaveModalComponent', () => {
    let component: FilterBookmarkSaveModalComponent;
    let fixture: ComponentFixture<FilterBookmarkSaveModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FilterBookmarkSaveModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FilterBookmarkSaveModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBookmarkAllocationModalComponent } from './filter-bookmark-allocation-modal.component';

describe('FilterBookmarkAllocationModalComponent', () => {
    let component: FilterBookmarkAllocationModalComponent;
    let fixture: ComponentFixture<FilterBookmarkAllocationModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FilterBookmarkAllocationModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            FilterBookmarkAllocationModalComponent,
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

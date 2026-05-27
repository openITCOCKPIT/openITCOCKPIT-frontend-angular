import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterbookmarkAllocationsIndexComponent } from './filterbookmark-allocations-index.component';

describe('FilterbookmarkAllocationsIndexComponent', () => {
    let component: FilterbookmarkAllocationsIndexComponent;
    let fixture: ComponentFixture<FilterbookmarkAllocationsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FilterbookmarkAllocationsIndexComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            FilterbookmarkAllocationsIndexComponent,
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

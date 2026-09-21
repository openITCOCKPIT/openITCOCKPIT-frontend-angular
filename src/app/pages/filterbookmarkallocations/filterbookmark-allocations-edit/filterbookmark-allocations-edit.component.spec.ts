import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterbookmarkAllocationsEditComponent } from './filterbookmark-allocations-edit.component';

describe('FilterbookmarkAllocationsEditComponent', () => {
    let component: FilterbookmarkAllocationsEditComponent;
    let fixture: ComponentFixture<FilterbookmarkAllocationsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FilterbookmarkAllocationsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FilterbookmarkAllocationsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

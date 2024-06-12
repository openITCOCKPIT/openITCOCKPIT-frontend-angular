import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectOptgroupComponent } from './multi-select-optgroup.component';

describe('MultiSelectOptgroupComponent', () => {
    let component: MultiSelectOptgroupComponent;
    let fixture: ComponentFixture<MultiSelectOptgroupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MultiSelectOptgroupComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MultiSelectOptgroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

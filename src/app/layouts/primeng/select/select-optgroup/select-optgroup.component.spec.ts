import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOptgroupComponent } from './select-optgroup.component';

describe('SelectOptgroupComponent', () => {
    let component: SelectOptgroupComponent;
    let fixture: ComponentFixture<SelectOptgroupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SelectOptgroupComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SelectOptgroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

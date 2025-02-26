import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcegroupsUsedByComponent } from './resourcegroups-used-by.component';

describe('ResourcegroupsUsedByComponent', () => {
    let component: ResourcegroupsUsedByComponent;
    let fixture: ComponentFixture<ResourcegroupsUsedByComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ResourcegroupsUsedByComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ResourcegroupsUsedByComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesIndexComponent } from './resources-index.component';

describe('ResourcesIndexComponent', () => {
    let component: ResourcesIndexComponent;
    let fixture: ComponentFixture<ResourcesIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ResourcesIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ResourcesIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicegroupsIndexComponent } from './servicegroups-index.component';

describe('ServicegroupsIndexComponent', () => {
    let component: ServicegroupsIndexComponent;
    let fixture: ComponentFixture<ServicegroupsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicegroupsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicegroupsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
